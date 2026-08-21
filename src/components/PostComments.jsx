import { Avatar, Box, Card, Typography } from "@mui/material";

export default function PostComments({ comment }) {
  if (!comment) return null;

  const author = comment.author;

  // Verify valid and non-empty image URL
  const hasProfileImage =
    author?.profile_image &&
    typeof author.profile_image === "string" &&
    author.profile_image.trim() !== "" &&
    author.profile_image !== "null";

  //  Get the first letter of the username or display name
  const displayName = author?.username || author?.name || "User";
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <Card sx={{ width: "100%", mb: 1.5, p: 1.5, boxShadow: "none" }}>
      <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
        <Avatar
          src={hasProfileImage ? author.profile_image : undefined}
          sx={{ bgcolor: "#085071", width: 40, height: 40 }}
        >
          {!hasProfileImage && firstLetter}
        </Avatar>

        <Box
          sx={{
            backgroundColor: "#f0f2f5",
            borderRadius: "12px",
            p: 1.5,
            flexGrow: 1,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: "bold", color: "#1c1e21", mb: 0.5 }}
          >
            {displayName}
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "#050505", lineHeight: 1.5 }}
          >
            {comment.body}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
