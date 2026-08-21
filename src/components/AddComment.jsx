import { Box, Button, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import { useParams } from "react-router";
import { baseUrl } from "../contexts/getPostsContext";
import axios from "axios";

export default function AddComment({ onCommentAdded }) {
  const [comment, setComment] = useState("");
  const { postId } = useParams();

  function handleSendComment() {
    if (!comment.trim()) return;

    const token = localStorage.getItem("token");

    axios
      .post(
        `${baseUrl}/posts/${postId}/comments`,
        { body: comment },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        let newComment = res.data.data;

        if (!newComment.author || !newComment.author.username) {
          const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
          newComment = {
            ...newComment,
            author: {
              username: storedUser.username || "You",
              profile_image: storedUser.profile_image || null,
            },
          };
        }

        if (onCommentAdded) {
          onCommentAdded(newComment);
        }

        setComment("");
      })
      .catch((err) => console.error("Error adding comment:", err));
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        alignItems: "center",
        width: "100%",
        mt: 2,
      }}
    >
      <TextField
        label="Add Comment"
        variant="outlined"
        fullWidth
        size="small"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button
        variant="contained"
        endIcon={<SendIcon />}
        sx={{ height: "40px", whiteSpace: "nowrap" }}
        onClick={handleSendComment}
      >
        Send
      </Button>
    </Box>
  );
}
