import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { useContext, useState, useEffect } from "react";
import { baseUrl, PostsContext } from "../../contexts/getPostsContext";
import axios from "axios";

export default function UpdatePostDialog({
  open,
  handleClose,
  currentPost,
  onPostUpdated,
}) {
  const [updatePost, setUpdatePost] = useState({
    title: "",
    body: "",
    image: null, // تخزين كائن الملف فقط أو null
  });

  // تحديث الحالة عند فتح النافذة أو تغيير المنشور الحالي
  useEffect(() => {
    if (currentPost) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUpdatePost({
        title: currentPost.title || "",
        body: currentPost.body || "",
        image: null, // إعادة ضبط الصورة إلى null لتجنب إرسال الرابط القديم كملف
      });
    }
  }, [currentPost, open]);

  const { fetchPosts } = useContext(PostsContext);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setUpdatePost((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  function handleUpdatePost() {
    const token = localStorage.getItem("token");
    let url = `${baseUrl}/posts/${currentPost.id}`;

    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    };

    let formData = new FormData();
    formData.append("title", updatePost.title);
    formData.append("body", updatePost.body);
    formData.append("_method", "put");

    // إرسال الصورة فقط إذا قام المستخدم باختيار ملف جديد فعلياً
    if (updatePost.image instanceof File) {
      formData.append("image", updatePost.image);
    }

    axios
      .post(url, formData, { headers })
      .then((res) => {
        const updatedData = res.data.data;

        // 1. تحديث البوست محلياً فوراً
        if (onPostUpdated) {
          onPostUpdated(updatedData);
        }

        // 2. تحديث قائمة البوستات في Context
        if (fetchPosts) {
          fetchPosts();
        }

        handleClose();
      })
      .catch((err) => {
        console.error("Validation Error Details:", err.response?.data);
      });
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        role="alertdialog"
      >
        <DialogTitle id="alert-dialog-title">
          {"Update Post"}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <form id="updatePost-form" onSubmit={(e) => e.preventDefault()}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="title"
              name="title"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
              value={updatePost.title}
              onChange={(e) =>
                setUpdatePost((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <TextField
              required
              margin="dense"
              id="body"
              name="body"
              label="Content"
              type="text"
              fullWidth
              variant="standard"
              value={updatePost.body}
              onChange={(e) =>
                setUpdatePost((prev) => ({ ...prev, body: e.target.value }))
              }
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 2 }}>
              <Button variant="outlined" component="label">
                Upload New Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              <Typography variant="body2" color="textSecondary">
                {updatePost.image
                  ? updatePost.image.name
                  : "No new image selected"}
              </Typography>
            </Box>
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUpdatePost} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
