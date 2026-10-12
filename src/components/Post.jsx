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
  Skeleton,
  IconButton as MuiIconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ModeComment } from "@mui/icons-material";
import { Link, useNavigate, useParams } from "react-router";
import PostComments from "./PostComments";
import AddComment from "./AddComment";
import { useEffect, useState } from "react";
import { baseUrl } from "../contexts/getPostsContext";
import axios from "axios";
import NoImage from "../assets/NoImage.jpg";
import { useUpdate } from "../contexts/UpdateContext";
import { useDelete } from "../contexts/DeleteContext";

export default function Post({ post: propPost }) {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [currentPost, setCurrentPost] = useState(propPost || null);
  const [loading, setLoading] = useState(false);

  const { openUpdateDialog } = useUpdate();
  const { openDeleteDialog } = useDelete();

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

  const getImageUrl = (imageProp) => {
    if (typeof imageProp === "string") return imageProp;
    if (imageProp && typeof imageProp === "object" && imageProp.url) {
      return imageProp.url;
    }
    return null;
  };

  const imageUrl = getImageUrl(post.image);

  const hasProfileImage =
    post.author?.profile_image &&
    typeof post.author.profile_image === "string" &&
    post.author.profile_image.trim() !== "";

  const hasPostImage =
    Boolean(imageUrl) &&
    typeof imageUrl === "string" &&
    imageUrl.trim() !== "" &&
    !imageUrl.includes("[object Object]");

  const isMyPost = Boolean(
    user?.id && post?.author?.id && String(user.id) === String(post.author.id),
  );

  const handlePostUpdated = (updatedPost) => {
    setCurrentPost((prev) => ({
      ...prev,
      ...updatedPost,
      comments: updatedPost.comments || prev?.comments,
    }));
  };

  const handlePostDeleted = () => {
    if (postId) {
      navigate("/", { replace: true });
    } else {
      setCurrentPost(null);
    }
  };

  return (
    <Container maxWidth="md">
      <Card sx={{ width: "100%", marginTop: "40px" }}>
        <Link
          to={`/profile/${post.author?.id}`}
          style={{ textDecoration: "none", color: "#085071" }}
        >
          <CardHeader
            // تم إضافة alignItems: "center" لضبط محاذاة الأزرار مع الصورة والاسم تماماً
            sx={{
              background: "rgb(148 176 203 / 23%)",
              py: 1.5,
              // إجبار محتوى الـ Header والـ Action على التمركز في المنتصف عمودياً
              alignItems: "center",
              "& .MuiCardHeader-action": {
                alignSelf: "center",
                margin: 0, // إزالة الـ margins الافتراضية التي تسبب الرفع للأعلى
              },
            }}
            avatar={
              <Avatar
                sx={{ bgcolor: "#085071", width: 42, height: 42 }}
                aria-label="recipe"
                src={hasProfileImage ? post.author.profile_image : undefined}
              >
                {!hasProfileImage && post.author?.name
                  ? post.author.name[0].toUpperCase()
                  : "U"}
              </Avatar>
            }
            title={
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: "#085071" }}
              >
                {post.author?.username || post.author?.name || "مستخدم مجهول"}
              </Typography>
            }
            action={
              isMyPost && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {/* للشاشات الكبيرة (Desktop): تظهر الأزرار بالنص والأيقونة */}
                  <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openUpdateDialog(post, handlePostUpdated);
                      }}
                    >
                      Update
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openDeleteDialog(post, handlePostDeleted);
                      }}
                    >
                      Delete
                    </Button>
                  </Box>

                  {/* لشاشات الهواتف (Mobile): تظهر الأيقونات فقط */}
                  <Box sx={{ display: { xs: "flex", sm: "none" }, gap: 0.5 }}>
                    <Tooltip title="Update">
                      <MuiIconButton
                        color="primary"
                        size="small"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openUpdateDialog(post, handlePostUpdated);
                        }}
                        sx={{
                          bgcolor: "primary.main",
                          color: "white",
                          p: "6px",
                          "&:hover": { bgcolor: "primary.dark" },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </MuiIconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <MuiIconButton
                        color="error"
                        size="small"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openDeleteDialog(post, handlePostDeleted);
                        }}
                        sx={{
                          bgcolor: "error.main",
                          color: "white",
                          p: "6px",
                          "&:hover": { bgcolor: "error.dark" },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </MuiIconButton>
                    </Tooltip>
                  </Box>
                </Box>
              )
            }
          />
        </Link>
        <Divider />

        <Link to={`/post/${post.id}`}>
          {loading ? (
            <Skeleton
              animation="wave"
              variant="rectangular"
              sx={{ height: { xs: 200, sm: 350 }, width: "100%" }}
            />
          ) : (
            <CardMedia
              component="img"
              sx={{
                height: { xs: 220, sm: 350 },
                cursor: "pointer",
                objectFit: "cover",
                width: "100%",
              }}
              image={hasPostImage ? imageUrl : NoImage}
              alt={post?.title || "Post image"}
              onError={(e) => {
                e.currentTarget.src = NoImage;
              }}
            />
          )}
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
            <Typography
              variant="h5"
              sx={{
                color: "black",
                cursor: "pointer",
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
              }}
            >
              {post.title}
            </Typography>
          </Link>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
            {post.body}
          </Typography>
        </CardContent>
        <Divider />
        <CardActions disableSpacing>
          <Link to={`/post/${post.id}`} style={{ textDecoration: "none" }}>
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
          </Link>
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
    </Container>
  );
}
