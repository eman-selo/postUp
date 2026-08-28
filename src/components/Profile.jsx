import { Avatar, Box, Card, Container, Typography } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useParams } from "react-router";
import { baseUrl } from "../contexts/getPostsContext";
import axios from "axios";
import { useEffect, useState } from "react";
import Post from "./Post";

export default function Profile() {
  const { userId } = useParams();
  console.log(userId);
  const [posts, setPosts] = useState();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  // 3. وضع طلب API داخل useEffect ليتم استدعاؤه مرة واحدة فقط عند تغيير userId
  useEffect(() => {
    if (userId) {
      axios
        .get(`${baseUrl}/users/${userId}/posts`)
        .then((res) => {
          setPosts(res.data.data);
        })
        .catch((err) => {
          console.error("Error fetching posts:", err);
        });
    }
  }, [userId]);
  const handlePostDeleted = (deletedPostId) => {
    setPosts((prevPosts) => prevPosts.filter((p) => p.id !== deletedPostId));
  };
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
                bgcolor: "transparent",
                color: "text.primary",
              }}
            >
              <PersonOutlineIcon sx={{ fontSize: 48 }} />
            </Avatar>

            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {user.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.username}
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
                {user.posts_count}
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
                {user.comments_count}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Comments
              </Typography>
            </Box>
          </Box>
        </Card>
        <Typography variant="h2" sx={{ color: "white" }}>
          Eman's Posts
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
