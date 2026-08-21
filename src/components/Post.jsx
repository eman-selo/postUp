import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Divider,
  Typography,
  CircularProgress,
} from "@mui/material";
import placeholderImg from "../assets/placeholder1.jpg";
import { ModeComment } from "@mui/icons-material";
import { useParams } from "react-router";
import PostComments from "./PostComments";
import AddComment from "./AddComment";
import { useEffect, useState } from "react";
import { baseUrl } from "../contexts/getPostsContext";
import axios from "axios";

export default function Post({ post: propPost }) {
  const { postId } = useParams();

  const [currentPost, setCurrentPost] = useState(propPost || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (postId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true);
      axios
        .get(`${baseUrl}/posts/${postId}`)
        .then((res) => {
          setCurrentPost(res.data.data);
        })
        .catch((err) => console.error("Error fetching post details:", err))
        .finally(() => setLoading(false));
    } else if (propPost) {
      setCurrentPost(propPost);
    }
  }, [postId, propPost]);

  // Function to add the new comment directly to the local list
  const handleCommentAdded = (newComment) => {
    setCurrentPost((prevPost) => ({
      ...prevPost,
      comments: [...(prevPost.comments || []), newComment],
      comments_count: (prevPost.comments_count || 0) + 1,
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  const post = currentPost;
  if (!post) return null;

  const hasProfileImage =
    post.author?.profile_image &&
    typeof post.author.profile_image === "string" &&
    post.author.profile_image.trim() !== "";

  const hasPostImage =
    typeof post.image === "string" && post.image.trim() !== "";

  return (
    <Container maxWidth="md">
      <Card sx={{ width: "100%", marginTop: "40px" }}>
        <CardHeader
          sx={{ background: "rgb(148 176 203 / 23%)" }}
          avatar={
            <Avatar
              sx={{ bgcolor: "#085071" }}
              aria-label="recipe"
              src={hasProfileImage ? post.author.profile_image : undefined}
            >
              {!hasProfileImage && post.author?.name
                ? post.author.name[0].toUpperCase()
                : "U"}
            </Avatar>
          }
          title={post.author?.username || post.author?.name || "مستخدم مجهول"}
        />
        <Divider />
        <CardMedia
          component="img"
          height="350"
          image={hasPostImage ? post.image : placeholderImg}
          alt={post.title || "Post image"}
        />

        <CardContent>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary" }}
            gutterBottom
          >
            {post.created_at}
          </Typography>
          <Typography variant="h5" sx={{ color: "black" }}>
            {post.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {post.body}
          </Typography>
        </CardContent>
        <Divider />
        <CardActions disableSpacing>
          <Box
            component="button"
            type="button"
            sx={{
              display: "flex",
              border: "none",
              background: "transparent",
              alignItems: "center",
              color: "text.secondary",
              cursor: "pointer",
            }}
          >
            <ModeComment
              sx={{
                opacity: 0.6,
                fontSize: "1.125em",
                marginRight: 1,
              }}
            />
            {post.comments_count ?? 0}
          </Box>
        </CardActions>
        {/* Render comments and input field only on single post page */}
        {postId && (
          <Box sx={{ pb: 2 }}>
            <Divider sx={{ my: 1.5 }} />

            {/* Render Comments List*/}
            {(post.comments || []).map((comment) => (
              <PostComments key={comment.id} comment={comment} />
            ))}

            {/* Comment Input Field */}
            <Box sx={{ px: 2, pt: 1 }}>
              <AddComment postId={postId} onCommentAdded={handleCommentAdded} />
            </Box>
          </Box>
        )}
      </Card>
    </Container>
  );
}
