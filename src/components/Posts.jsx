import { Container } from "@mui/material";
import Post from "./Post";
import { useContext } from "react";
import { PostsContext } from "../contexts/getPostsContext.jsx";
export default function Posts() {
  const { posts } = useContext(PostsContext);
  console.log("posts in Posts Components", posts);

  return (
    <>
      <Container maxWidth="md">
        {posts.map((post) => {
          return <Post key={post.id} post={post} />;
        })}
      </Container>
    </>
  );
}
