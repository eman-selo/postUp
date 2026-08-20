import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const baseUrl = "https://tarmeezacademy.com/api/v1";
// eslint-disable-next-line react-refresh/only-export-components
export const PostsContext = createContext();

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // دالة جلب المنشورات
  const fetchPosts = () => {
    setLoading(true);
    axios
      .get(`${baseUrl}/posts?limit=15`)
      .then((res) => {
        setPosts(res.data.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPosts();
  }, []);

  return (
    <PostsContext.Provider value={{ posts, fetchPosts, loading }}>
      {children}
    </PostsContext.Provider>
  );
}
