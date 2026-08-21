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
import { red } from "@mui/material/colors";
import placeholderImg from "../assets/placeholder1.jpg";
import { ModeComment } from "@mui/icons-material";
import { useParams } from "react-router";
import PostComments from "./PostComments";
import { useContext, useEffect, useState } from "react";
import { PostsContext, baseUrl } from "../contexts/getPostsContext";
import axios from "axios";

export default function Post({ post: propPost }) {
  const { postId } = useParams();
  const { posts } = useContext(PostsContext);

  const [currentPost, setCurrentPost] = useState(propPost || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (propPost) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentPost(propPost);
      return;
    }

    if (postId) {
      const foundInContext = posts?.find(
        (p) => String(p.id) === String(postId),
      );

      if (foundInContext) {
        setCurrentPost(foundInContext);
      } else {
        setLoading(true);
        axios
          .get(`${baseUrl}/posts/${postId}`)
          .then((res) => {
            setCurrentPost(res.data.data);
          })
          .catch((err) => console.error("Error fetching post details:", err))
          .finally(() => setLoading(false));
      }
    }
  }, [propPost, postId, posts]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  const post = currentPost;

  if (!post) {
    return null;
  }

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
              sx={{ bgcolor: red[500] }}
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
              "@media (hover: hover)": {
                "&:hover, &:focus": {
                  color: "primary.main",
                  "& svg": {
                    opacity: 1,
                  },
                },
              },
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

        {postId && (
          <Divider
            sx={{
              my: 1.5,
              borderColor: "rgba(0, 0, 0, 0.08)",
              borderStyle: "solid",
            }}
          />
        )}

        {postId && <PostComments />}
      </Card>
    </Container>
  );
}
