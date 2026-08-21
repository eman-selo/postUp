import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { red } from "@mui/material/colors";

export default function PostComments() {
  return (
    <>
      <Card sx={{ width: "100%", mb: 2, p: 2, boxShadow: "none" }}>
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
          <Avatar sx={{ bgcolor: red[500], width: 40, height: 40 }}>R</Avatar>

          <Box
            sx={{
              backgroundColor: "#f0f2f5", // خلفية مميزة للتعليق
              borderRadius: "12px",
              p: 1.5,
              flexGrow: 1, // يأخذ باقي المساحة المتبقية
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: "bold", color: "#1c1e21", mb: 0.5 }}
            >
              Shrimp and Chorizo Paella
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "#050505", lineHeight: 1.5 }}
            >
              this is comment
            </Typography>
          </Box>
        </Box>

        <CardActions
          disableSpacing
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            width: "100%",
            mt: 2,
            p: 0,
          }}
        >
          <TextField
            id="outlined-basic"
            label="Add Comment"
            variant="outlined"
            fullWidth
            size="small"
          />
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            sx={{ height: "40px", whiteSpace: "nowrap" }}
          >
            Send
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
