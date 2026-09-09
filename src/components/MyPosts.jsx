import {
  Avatar,
  Box,
  Card,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router";
import { baseUrl } from "../contexts/getPostsContext";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import Post from "./Post";
export default function MyPosts() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. جلب البيانات من السيرفر عند التحميل أو تغير الـ userId
  useEffect(() => {
    if (!userId) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    const fetchUserData = axios.get(`${baseUrl}/users/${userId}`);
    const fetchUserPosts = axios.get(`${baseUrl}/users/${userId}/posts`);

    Promise.all([fetchUserData, fetchUserPosts])
      .then(([userRes, postsRes]) => {
        setUser(userRes.data.data);
        setPosts(postsRes.data.data || []);
      })
      .catch((err) => {
        console.error("Error fetching profile data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  // 2. معالج الحدث عند إنشاء منشور جديد
  const handleNewPostCreated = useCallback(
    (event) => {
      const createdPost = event.detail;
      if (!createdPost) return;

      // استخراج معرف الكاتب بأكثر من طريقة لضمان التطابق
      const authorId =
        createdPost.author?.id ?? createdPost.user?.id ?? createdPost.user_id;

      // إذا كان المنشور يخص المستخدم الحالي المعروض أو إذا تعذر معرفة المعرف (يضاف احتياطياً)
      const isCurrentProfileUser =
        String(authorId) === String(userId) || !authorId;

      if (isCurrentProfileUser) {
        // إضافة المنشور في الأعلى مع التأكد من عدم التكرار
        setPosts((prevPosts) => {
          const exists = prevPosts.some((p) => p.id === createdPost.id);
          return exists ? prevPosts : [createdPost, ...prevPosts];
        });

        // تحديث عداد المنشورات
        setUser((prevUser) =>
          prevUser
            ? { ...prevUser, posts_count: (prevUser.posts_count || 0) + 1 }
            : prevUser,
        );
      }
    },
    [userId],
  );

  // 3. الاشتراك في الحدث وإلغاء الاشتراك عند التنظيف
  useEffect(() => {
    window.addEventListener("postCreated", handleNewPostCreated);

    return () => {
      window.removeEventListener("postCreated", handleNewPostCreated);
    };
  }, [handleNewPostCreated]);

  const handlePostDeleted = (deletedPostId) => {
    setPosts((prevPosts) => prevPosts.filter((p) => p.id !== deletedPostId));
  };

  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{ display: "flex", justifyContent: "center", mt: 5 }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="md">
        <Card
          elevation={3}
          sx={{
            p: 2,
            borderRadius: 2,
            width: "100%",
            minWidth: 450,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            gap: 3,
            marginTop: "40px",
            marginBottom: "20px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: "#085071",
                color: "white",
              }}
            >
              {user?.profile_image &&
              typeof user.profile_image === "string" &&
              !user.profile_image.includes("default") ? (
                <img
                  src={user.profile_image}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                user?.name?.trim().charAt(0).toUpperCase() || "U"
              )}
            </Avatar>

            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {user?.email || "No email"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.name || "Unknown User"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.username ? `@${user.username}` : ""}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
              <Typography
                variant="h5"
                component="span"
                sx={{ fontWeight: 300 }}
              >
                {user?.posts_count ?? 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Posts
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
              <Typography
                variant="h5"
                component="span"
                sx={{ fontWeight: 300 }}
              >
                {user?.comments_count ?? 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Comments
              </Typography>
            </Box>
          </Box>
        </Card>

        <Typography variant="h4" sx={{ color: "white", mb: 2 }}>
          {user?.name ? `${user.name}'s Posts` : "Posts"}
        </Typography>

        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Post key={post.id} post={post} onPostDeleted={handlePostDeleted} />
          ))
        ) : (
          <Typography color="white">No posts found.</Typography>
        )}
      </Container>
    </>
  );
}
