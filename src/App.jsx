import "./App.css";
import Navbar from "./components/Navbar";
import Container from "@mui/material/Container";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./components/Theme";
import { Route, Routes } from "react-router";
import Posts from "./components/Posts";

import { PostsProvider } from "./contexts/getPostsContext.jsx";
import { AlertProvider } from "./contexts/AlertContext.jsx";
import Post from "./components/Post.jsx";
import MyPosts from "./components/MyPosts.jsx";
import Profile from "./components/Profile.jsx";
import { UpdateProvider } from "./contexts/UpdateContext.jsx";
import { DeleteProvider } from "./contexts/DeleteContext.jsx";

function App() {
  return (
    <>
      <PostsProvider>
        <AlertProvider>
          <UpdateProvider>
            <DeleteProvider>
              <ThemeProvider theme={theme}>
                <Container
                  maxWidth="md"
                  sx={{
                    marginBottom: { xs: "30px", sm: "80px" },
                    px: { xs: 1, sm: 2, md: 3 },
                  }}
                >
                  <Navbar />
                </Container>
              </ThemeProvider>

              <Routes>
                <Route path="/home" element={<Posts />} />
                <Route path="/" element={<Posts />} />
                <Route path="/profile/:userId" element={<Profile />} />

                <Route path="/post/:postId" element={<Post />} />
                <Route path="/myPosts/:userId" element={<MyPosts />} />
              </Routes>
            </DeleteProvider>
          </UpdateProvider>
        </AlertProvider>
      </PostsProvider>
    </>
  );
}

export default App;
