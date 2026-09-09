import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { baseUrl } from "../../contexts/getPostsContext";

export default function DeletePostDialog({
  open,
  handleClose,
  currentPost,
  onPostDeleted,
}) {
  function confirmDelete() {
    if (!currentPost?.id) return;

    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
      .delete(`${baseUrl}/posts/${currentPost.id}`, { headers })
      .then(() => {
        if (onPostDeleted) {
          onPostDeleted(currentPost.id);
        } else {
          handleClose();
        }
      })
      .catch((err) => {
        console.error("Error deleting post:", err);
        handleClose();
      });
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        <Button onClick={handleClose} color="inherit" variant="outlined">
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
  );
}
