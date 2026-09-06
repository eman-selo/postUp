import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const baseUrl = "https://tarmeezacademy.com/api/v1";
// eslint-disable-next-line react-refresh/only-export-components
export const PostsContext = createContext();

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // دالة جلب المنشورات
  const fetchPosts = useCallback((currentPage) => {
    setLoading(true);

    axios
      .get(`${baseUrl}/posts?limit=15&page=${currentPage}`)
      .then((res) => {
        const newPosts = res.data.data || [];
        const lastPage = res.data.meta?.last_page || 1;

        if (currentPage === 1) {
          setPosts(newPosts);
        } else {
          // ✅ منع تكرار العناصر عند جلب صفحات إضافية
          setPosts((prevPosts) => {
            const combined = [...prevPosts, ...newPosts];
            return combined.filter(
              (post, index, self) =>
                self.findIndex((p) => p.id === post.id) === index,
            );
          });
        }

        if (currentPage >= lastPage) {
          setHasMore(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // جلب البيانات عند تغير رقم الصفحة
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPosts(page);
  }, [page, fetchPosts]);

  // ✅ دالة إضافة منشور جديد إلى بداية القائمة فوراً مع منع التكرار
  const addNewPost = (createdPost) => {
    if (!createdPost) return;
    setPosts((prevPosts) => {
      const exists = prevPosts.some((post) => post.id === createdPost.id);
      if (exists) return prevPosts;
      return [createdPost, ...prevPosts];
    });
  };

  // دالة إعادة التحديث الكامل
  const refreshPosts = () => {
    if (page === 1) {
      fetchPosts(1);
    } else {
      setPage(1);
    }
  };

  return (
    <PostsContext.Provider
      value={{
        posts,
        setPosts,
        loading,
        page,
        setPage,
        hasMore,
        fetchPosts,
        refreshPosts,
        addNewPost,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}
