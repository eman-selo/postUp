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

  // const { fetchPosts } = useContext(PostsContext);
  const { openUpdateDialog } = useUpdate();
  const { openDeleteDialog } = useDelete();
  // دوال فتح وإغلاق النافذة

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

  // --- استخراج ومعالجة رابط الصورة ---
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

  // فحص ما إذا كان هناك رابط صورة صالح
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
      // إذا كنا في صفحة المنشور المنفردة نرجع للصفحة الرئيسية
      navigate("/", { replace: true });
    } else {
      // إذا كنا في قائمة المنشورات يمكنك إما إخفاء البوست محلياً أو إعادة جلب البيانات
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
                      e.preventDefault();
                      e.stopPropagation();
                      openUpdateDialog(post, handlePostUpdated);
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
                      openDeleteDialog(post, handlePostDeleted);
                    }}
                  >
                    Delete
                  </Button>
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
              height={350}
              width="100%"
            />
          ) : (
            <CardMedia
              component="img"
              height="350"
              // استخدام الصورة الأصلية إن وجدت وإلا استخدام الصورة الافتراضية
              image={hasPostImage ? imageUrl : NoImage}
              alt={post?.title || "Post image"}
              sx={{ cursor: "pointer", objectFit: "cover" }}
              onError={(e) => {
                // إذا فشل تحميل رابط الصورة من السيرفر، يتم استبداله بالصورة الافتراضية فوراً
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
