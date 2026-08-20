import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import ForumIcon from "@mui/icons-material/Forum";
import { Link } from "react-router";
import { useState } from "react";
import LoginDialog from "./LoginDialog";
import RegisterDialog from "./RegisterDialog";
import { Avatar } from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import NewPostDialog from "./NewPostDialog";
function Navbar() {
  const pages = ["home", "profile"];
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [openNewPostDialog, setOpenNewPostDialog] = useState(false);

  // 1. قراءة البيانات عند بداية التهيئة بدون useEffect
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        return null;
      }
    }
    return null;
  });

  // 2. دالة تُستدعى فقط عند نجاح التسجيل/الدخول
  const updateUserState = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.log(err);

        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  // 3. دالة تسجيل الخروج Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  const handleClickOpenLoginDialog = () => setOpenLoginDialog(true);
  const handleCloseLoginDialog = () => setOpenLoginDialog(false);

  const handleClickOpenRegisterDialog = () => setOpenRegisterDialog(true);
  const handleCloseRegisterDialog = () => setOpenRegisterDialog(false);
  const handleClickOpenNewPostDialog = () => setOpenNewPostDialog(true);
  const handleCloseNewPostDialog = () => setOpenNewPostDialog(false);

  return (
    <>
      <AppBar position="fixed" sx={{ background: "#8cadcf" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <ForumIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              PostUp
            </Typography>

            {/* QS Menu Mobile */}
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Link
                      to={`/${page}${page === "profile" ? `/${user.id}` : ""}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Typography sx={{ textAlign: "center" }}>
                        {page}
                      </Typography>
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <ForumIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              PostUp
            </Typography>

            {/* Links Desktop */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Link
                  key={page}
                  to={`/${page}${page === "profile" ? `/${user.id}` : ""}`}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page}
                  </Button>
                </Link>
              ))}
            </Box>

            {/* عرض الأزرار أو صورة واسم المستخدم مع زر الخروج */}
            {!user ? (
              <Box>
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ marginRight: "5px" }}
                  onClick={handleClickOpenLoginDialog}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleClickOpenRegisterDialog}
                >
                  Register
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar alt={user?.username} src={user?.profile_image} />
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    fontFamily: "monospace",
                    fontWeight: 700,
                    color: "inherit",
                  }}
                >
                  {user?.username}
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={handleLogout}
                  sx={{ ml: 1 }}
                >
                  Logout
                </Button>
                <AddCircleIcon
                  sx={{
                    position: "fixed",
                    bottom: "10px",
                    right: "50px",
                    fontSize: "50px",
                    color: " #8cadcf",
                  }}
                  onClick={handleClickOpenNewPostDialog}
                />
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Login Dialog */}
      <LoginDialog
        open={openLoginDialog}
        handleClose={handleCloseLoginDialog}
        onLoginSuccess={updateUserState}
      />

      {/* Register Dialog */}
      <RegisterDialog
        open={openRegisterDialog}
        handleClose={handleCloseRegisterDialog}
        onRegisterSuccess={updateUserState}
      />
      {/* New Post Dialog */}
      <NewPostDialog
        open={openNewPostDialog}
        handleClose={handleCloseNewPostDialog}
      />
    </>
  );
}

export default Navbar;
