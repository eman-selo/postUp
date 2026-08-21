import { Container } from "@mui/material";
import Post from "./Post";
import { useContext } from "react";
import { PostsContext } from "../contexts/getPostsContext.jsx";
import { Link } from "react-router";
export default function Posts() {
  const { posts } = useContext(PostsContext);
  console.log("posts in Posts Components", posts);

  return (
    <>
      <Container maxWidth="md">
        {posts.map((post) => {
          return (
            <Link
              key={post.id}
              to={`/post/${post.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Post post={post} />
            </Link>
          );
        })}
      </Container>
    </>
  );
}
