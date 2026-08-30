import {
  Avatar,
  Box,
  Card,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
// import PersonOutlineIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useParams } from "react-router";
import { baseUrl } from "../contexts/getPostsContext";
import axios from "axios";
import { useEffect, useState } from "react";
import Post from "./Post";

export default function MyPosts() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true);

      // إنشاء طلب جلب بيانات المستخدم
      const fetchUserData = axios.get(`${baseUrl}/users/${userId}`);
      // إنشاء طلب جلب منشورات المستخدم
      const fetchUserPosts = axios.get(`${baseUrl}/users/${userId}/posts`);

      // تنفيذ الطلبين معاً في نفس الوقت
      Promise.all([fetchUserData, fetchUserPosts])
        .then(([userRes, postsRes]) => {
          // حفظ بيانات المستخدم
          setUser(userRes.data.data);
          // حفظ المنشورات
          setPosts(postsRes.data.data || []);
        })
        .catch((err) => {
          console.error("Error fetching profile data:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId]);

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
                  // إخفاء الـ img في حال كان الرابط تالفاً لإظهار الحرف الافتراضي
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
            <Typography variant="h5" component="span" sx={{ fontWeight: 300 }}>
              {user?.posts_count ?? 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Posts
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
            <Typography variant="h5" component="span" sx={{ fontWeight: 300 }}>
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
  );
}
