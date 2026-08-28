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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import placeholderImg from "../assets/placeholder1.jpg";
import { ModeComment } from "@mui/icons-material";
import { Link, useNavigate, useParams } from "react-router";
import PostComments from "./PostComments";
import AddComment from "./AddComment";
import { useContext, useEffect, useState } from "react";
import { baseUrl, PostsContext } from "../contexts/getPostsContext";
import axios from "axios";
import UpdatePostDialog from "./UpdatePostDialog";

export default function Post({ post: propPost, onPostDeleted }) {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [currentPost, setCurrentPost] = useState(propPost || null);
  const [loading, setLoading] = useState(false);
  const [openUpdateDialog, setopenUpdateDialog] = useState(false);
  const { fetchPosts } = useContext(PostsContext);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // دوال فتح وإغلاق النافذة
  const handleOpenDeleteDialog = () => setOpenDeleteDialog(true);
  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);
  // 1. استخدام useState وقراءة المستخدم عند كل ريندر أو تحديث
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user")));
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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

  const isMyPost = Boolean(
    user?.id && post?.author?.id && String(user.id) === String(post.author.id),
  );
  const handleOpenUpdateDialog = () => setopenUpdateDialog(true);
  const handleCloseUpdateDialog = () => setopenUpdateDialog(false);
  const handlePostUpdated = (updatedPost) => {
    setCurrentPost((prev) => ({
      ...prev,
      ...updatedPost,
      // الحفاظ على تعليقات البوست القديمة إن لم ترجع كاملة من API التعديل
      comments: updatedPost.comments || prev?.comments,
    }));
  };
  function confirmDelete() {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
      .delete(`${baseUrl}/posts/${post.id}`, { headers })
      .then(() => {
        handleCloseDeleteDialog();

        // تحديث الواجهة محلياً
        if (onPostDeleted) {
          onPostDeleted(post.id);
        }

        // تحديث قائمة Context العامة
        if (fetchPosts) {
          fetchPosts();
        }

        // التوجيه إذا كنت داخل صفحة التفاصيل
        if (postId) {
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("Error deleting post:", err);
        handleCloseDeleteDialog();
      });
  }
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
          action={
            isMyPost && (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={(e) => {
                    e.preventDefault(); // منع سلوك الـ Link
                    e.stopPropagation(); // منع انتقال حدث الضغطة للرابط المغلف
                    handleOpenUpdateDialog();
                  }}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleOpenDeleteDialog(); // فتح النافذة
                  }}
                >
                  Delete
                </Button>
              </Box>
            )
          }
        />
        <Divider />
        <Link to={`/post/${post.id}`}>
          <CardMedia
            component="img"
            height="350"
            image={hasPostImage ? post.image : placeholderImg}
            alt={post.title || "Post image"}
            sx={{ cursor: "pointer" }}
          />
        </Link>

        <CardContent>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary" }}
            gutterBottom
          >
            {post.created_at}
          </Typography>
          <Link
            to={`/post/${post.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography variant="h5" sx={{ color: "black", cursor: "pointer" }}>
              {post.title}
            </Typography>
          </Link>
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

        {postId && (
          <Box sx={{ pb: 2 }}>
            <Divider sx={{ my: 1.5 }} />

            {(post.comments || []).map((comment) => (
              <PostComments key={comment.id} comment={comment} />
            ))}

            <Box sx={{ px: 2, pt: 1 }}>
              <AddComment postId={postId} onCommentAdded={handleCommentAdded} />
            </Box>
          </Box>
        )}
      </Card>
      {/* Update Dialog */}
      <UpdatePostDialog
        open={openUpdateDialog}
        handleClose={handleCloseUpdateDialog}
        currentPost={post}
        onPostUpdated={handlePostUpdated}
      />
      {/* Delete Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Post</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            color="inherit"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
