import {
  Avatar,
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
import { useState } from "react";
import { baseUrl } from "../contexts/getPostsContext";
import axios from "axios";
import { useAlert } from "../contexts/AlertContext.jsx";

export default function RegisterDialog({
  open,
  handleClose,
  onRegisterSuccess,
}) {
  const { showAlert } = useAlert();
  const [userRegister, setUserRegister] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    profileImage: null,
  });

  const [previewImage, setPreviewImage] = useState("");

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setUserRegister((prev) => ({
        ...prev,
        profileImage: file,
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  function handleRegister() {
    let formData = new FormData();
    formData.append("name", userRegister.name);
    formData.append("username", userRegister.username);
    formData.append("email", userRegister.email);
    formData.append("password", userRegister.password);

    if (userRegister.profileImage) {
      formData.append("image", userRegister.profileImage);
    }

    axios
      .post(`${baseUrl}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        onRegisterSuccess();
        handleClose();
        showAlert("New User Registered Successfully", "success");
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          const errors = error.response.data.errors;
          const firstErrorMessage =
            errors.username?.[0] ||
            errors.email?.[0] ||
            errors.password?.[0] ||
            errors.name?.[0] ||
            "Validation Error";

          showAlert(firstErrorMessage, "success");
        } else {
          showAlert(
            "An unexpected error occurred. Please try again.",
            "success",
          );
        }
      });
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-Register"
        role="alertdialog"
      >
        <DialogTitle id="alert-dialog-title">
          {"Register"}
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
          <form id="Register-form" onSubmit={(e) => e.preventDefault()}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              label="Name"
              type="text"
              fullWidth
              variant="standard"
              value={userRegister.name}
              onChange={(e) =>
                setUserRegister({ ...userRegister, name: e.target.value })
              }
            />
            <TextField
              required
              margin="dense"
              id="username"
              name="username"
              label="UserName"
              type="text"
              fullWidth
              variant="standard"
              value={userRegister.username}
              onChange={(e) =>
                setUserRegister({ ...userRegister, username: e.target.value })
              }
            />
            <TextField
              required
              margin="dense"
              id="email"
              name="email"
              label="Email"
              type="email"
              fullWidth
              variant="standard"
              value={userRegister.email}
              onChange={(e) =>
                setUserRegister({ ...userRegister, email: e.target.value })
              }
            />
            <TextField
              required
              margin="dense"
              id="password"
              name="password"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
              value={userRegister.password}
              onChange={(e) =>
                setUserRegister({ ...userRegister, password: e.target.value })
              }
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 2 }}>
              <IconButton component="label" sx={{ p: 0 }}>
                <Avatar
                  src={previewImage}
                  alt="Avatar"
                  sx={{ width: 56, height: 56, border: "2px solid #ccc" }}
                />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </IconButton>
              <Typography variant="body2" color="textSecondary">
                Click avatar to change profile picture
              </Typography>
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleRegister} variant="contained">
            Register
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
