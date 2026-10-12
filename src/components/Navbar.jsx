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
import LoginDialog from "./dialogs/LoginDialog";
import RegisterDialog from "./dialogs/RegisterDialog";
import { Avatar } from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import NewPostDialog from "./dialogs/NewPostDialog";

function Navbar() {
  const pages = ["home", "myPosts"];
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [openNewPostDialog, setOpenNewPostDialog] = useState(false);

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
  const handleOpenNewPostDialog = () => setOpenNewPostDialog(true);
  const handleCloseNewPostDialog = () => setOpenNewPostDialog(false);

  const hasProfileImage =
    user?.profile_image &&
    typeof user.profile_image === "string" &&
    user.profile_image.trim() !== "" &&
    user.profile_image !== "null";
  const displayName = user?.username || user?.name || "User";
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <>
      <AppBar position="fixed" sx={{ background: "#8cadcf" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* عرض الأيقونة واسم الموقع للشاشات الكبيرة Desktop */}
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

            {/* القائمة المنسدلة للموبايل */}
            <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
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
                      to={`/${page}${page === "myPosts" ? `/${user?.id || ""}` : ""}`}
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

            {/* أخذنا الأيقونة واسم الموقع للموبايل وضعناهما معاً بجانب زر القائمة وبخط أصغر */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                flexGrow: 1,
                gap: 1,
              }}
            >
              <ForumIcon sx={{ fontSize: "20px" }} />
              <Typography
                variant="subtitle1"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                  fontFamily: "monospace",
                  fontWeight: 700,
                  fontSize: "1rem", // حجم خط أصغر ومناسب لشاشات الموبايل
                  letterSpacing: ".1rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                PostUp
              </Typography>
            </Box>

            {/* روابط سطح المكتب (Desktop) */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Link
                  key={page}
                  to={`/${page}${page === "myPosts" ? `/${user?.id || ""}` : ""}`}
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

            {/* أزرار المصادقة أو صورة المستخدم وزر الخروج */}
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
                <Link
                  to={`/profile/${user.id}`}
                  style={{
                    textDecoration: "none",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  <Avatar
                    src={hasProfileImage ? user.profile_image : undefined}
                    sx={{ bgcolor: "#085071", width: 40, height: 40 }}
                  >
                    {!hasProfileImage && firstLetter}
                  </Avatar>
                  <Typography
                    variant="h6"
                    noWrap
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: 700,
                      color: "inherit",
                      display: { xs: "none", sm: "block" },
                    }}
                  >
                    {user?.username}
                  </Typography>
                </Link>
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
                    bottom: { xs: "20px", sm: "30px", md: "40px" },
                    right: {
                      xs: "-2px",
                      sm: "-1px",
                      md: "40px",
                    },
                    fontSize: { xs: "45px", sm: "55px", md: "60px" },
                    color: "#8cadcf",
                    cursor: "pointer",
                    zIndex: 1000,
                    transition: "all 0.2s ease-in-out",
                  }}
                  onClick={handleOpenNewPostDialog}
                />
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <LoginDialog
        open={openLoginDialog}
        handleClose={handleCloseLoginDialog}
        onLoginSuccess={updateUserState}
      />

      <RegisterDialog
        open={openRegisterDialog}
        handleClose={handleCloseRegisterDialog}
        onRegisterSuccess={updateUserState}
      />

      <NewPostDialog
        open={openNewPostDialog}
        handleClose={handleCloseNewPostDialog}
      />
    </>
  );
}

export default Navbar;
