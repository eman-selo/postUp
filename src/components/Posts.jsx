import { Box, Container } from "@mui/material";
import Post from "./Post";
import { useContext } from "react";
import { PostsContext } from "../contexts/getPostsContext.jsx";

export default function Posts() {
  const { posts } = useContext(PostsContext);
  console.log("posts in Posts Components", posts);
  return (
    <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
      {posts.map((post) => (
        <Box key={post.id} sx={{ mb: 4 }}>
          <Post post={post} />
        </Box>
      ))}
    </Container>
  );
}
