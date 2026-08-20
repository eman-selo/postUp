import "./App.css";
import Navbar from "./components/Navbar";
import Container from "@mui/material/Container";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./components/Theme";
import { Route, Routes } from "react-router";
import Posts from "./components/Posts";
import Profile from "./components/Profile";
import { PostsProvider } from "./contexts/getPostsContext.jsx";
import { AlertProvider } from "./contexts/AlertContext.jsx";
function App() {
  return (
    <>
      <PostsProvider>
        <AlertProvider>
          <ThemeProvider theme={theme}>
            <Container maxWidth="md" sx={{ marginBottom: "80px" }}>
              <Navbar />
            </Container>
          </ThemeProvider>
          <Routes>
            <Route path="/home" element={<Posts />} />
            <Route path="/" element={<Posts />} />
            <Route path="/profile/:userId" element={<Profile />} />
          </Routes>
        </AlertProvider>
      </PostsProvider>
    </>
  );
}

export default App;
