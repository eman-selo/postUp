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
import { useContext, useState } from "react";
import { baseUrl, PostsContext } from "../../contexts/getPostsContext";
import axios from "axios";

export default function NewPostDialog({ open, handleClose }) {
  const [newPost, setNewPost] = useState({ title: "", body: "", image: null });

  // استدعاء addNewPost بدلاً من refreshPosts
  const { addNewPost } = useContext(PostsContext);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewPost((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  function handleNewPost() {
    const token = localStorage.getItem("token");
    let url = `${baseUrl}/posts`;

    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    };

    let formData = new FormData();
    formData.append("title", newPost.title);
    formData.append("body", newPost.body);

    if (newPost.image) {
      formData.append("image", newPost.image);
    }

    axios
      .post(url, formData, { headers })
      .then((res) => {
        console.log("post created", res);

        // إدخال البوست القادم من السيرفر فوراً لقمة الـ State
        if (res.data?.data) {
          if (typeof addNewPost === "function") {
            addNewPost(res.data.data);
          }

          // 2. إطلاق حدث مخصص ليستمع له MyPosts
          window.dispatchEvent(
            new CustomEvent("postCreated", { detail: res.data.data }),
          );
        }

        setNewPost({ title: "", body: "", image: null });
        handleClose();
      })
      .catch((err) => {
        console.error(
          "Error creating post:",
          err?.response?.data || err?.message || err,
        );
      });
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-Register"
      role="alertdialog"
    >
      <DialogTitle id="alert-dialog-title">
        {"Create A New Post"}
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
        <form id="NewPost-form" onSubmit={(e) => e.preventDefault()}>
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
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
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
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 2 }}>
            <Button variant="outlined" component="label">
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            <Typography variant="body2" color="textSecondary">
              {newPost.image ? newPost.image.name : "No image selected"}
            </Typography>
          </Box>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={handleNewPost} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
