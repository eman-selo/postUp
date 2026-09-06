import { useEffect, useState } from "react";
import {
  Box,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Grid,
  Paper,
  Container,
  CircularProgress,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import { useParams } from "react-router";
import axios from "axios";
import { baseUrl } from "../contexts/getPostsContext";

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ طلب البيانات داخل useEffect يمنع التكرار اللانهائي
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    axios
      .get(`${baseUrl}/users/${userId}`)
      .then((res) => {
        setUser(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  const getInitial = (name) => {
    return name?.trim() ? name.trim().charAt(0).toUpperCase() : "U";
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Paper
        elevation={4}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          background: "#ffffff",
        }}
      >
        <Box
          sx={{
            height: 140,
            background: "linear-gradient(135deg, #1976d2 0%, #004ba0 100%)",
            position: "relative",
          }}
        />

        <CardContent sx={{ pt: 0, px: 4, pb: 4, position: "relative" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "-60px",
              marginBottom: 2,
            }}
          >
            <Avatar
              sx={{
                width: 110,
                height: 110,
                bgcolor: "primary.main",
                color: "#ffffff",
                fontSize: "2.5rem",
                fontWeight: "bold",
                border: "4px solid #ffffff",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
              }}
            >
              {user?.profile_image &&
              typeof user.profile_image === "string" &&
              !user.profile_image.includes("default") ? (
                <img
                  src={user.profile_image}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                getInitial(user?.name)
              )}
            </Avatar>
          </Box>

          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              {user?.name || "Undefined"}
            </Typography>
            <Typography variant="body2" color="text.secondary" dir="ltr">
              @{user?.username || "username"}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography
            variant="h6"
            fontWeight="bold"
            color="text.primary"
            mb={2}
            sx={{ fontSize: "1.1rem" }}
          >
            Account Info
          </Typography>

          <Grid container spacing={2}>
            <Grid xs={12}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "#f8fafc",
                }}
              >
                <BadgeOutlinedIcon color="primary" />
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Name
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {user?.name || "Undefined"}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid xs={12}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "#f8fafc",
                }}
              >
                <AlternateEmailIcon color="primary" />
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    UserName
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="500"
                    dir="ltr"
                    align="right"
                  >
                    {user?.username ? `@${user.username}` : "Undefined"}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid xs={12}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "#f8fafc",
                }}
              >
                <EmailOutlinedIcon color="primary" />
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Email
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="500"
                    dir="ltr"
                    align="right"
                  >
                    {user?.email || "Undefined"}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Paper>
    </Container>
  );
};

export default Profile;
