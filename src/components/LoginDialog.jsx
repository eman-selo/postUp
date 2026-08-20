import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { baseUrl } from "../contexts/getPostsContext";
import { useState } from "react";
import axios from "axios";
import { useAlert } from "../contexts/AlertContext";
export default function LoginDialog({ open, handleClose, onLoginSuccess }) {
  const [userLogin, setUserLogin] = useState({ username: "", password: "" });
  const { showAlert } = useAlert();
  function handleLogin() {
    axios
      .post(`${baseUrl}/login`, {
        username: userLogin.username,
        password: userLogin.password,
      })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        onLoginSuccess();
        handleClose();
        showAlert("User Logged In Successfully", "success");
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || "An error occurred";
        showAlert(errorMessage, "error");
      });
  }
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-login"
        role="alertdialog"
      >
        <DialogTitle id="alert-dialog-title">
          {"Login"}
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
          <form id="login-form">
            <TextField
              autoFocus
              required
              margin="dense"
              id="username"
              name="username"
              label="UserName"
              type="text"
              fullWidth
              variant="standard"
              value={userLogin.username}
              onChange={(e) =>
                setUserLogin({ ...userLogin, username: e.target.value })
              }
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="password"
              name="password"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
              value={userLogin.password}
              onChange={(e) =>
                setUserLogin({ ...userLogin, password: e.target.value })
              }
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
          <Button onClick={handleLogin}>Login</Button>
        </DialogActions>
      </Dialog>
      ;
    </>
  );
}
