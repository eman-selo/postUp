import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";

import placeholderImg from "../assets/placeholder1.jpg";
import { ModeComment } from "@mui/icons-material";
export default function Post({ post }) {
  const hasProfileImage =
    post.author?.profile_image &&
    typeof post.author.profile_image === "string" &&
    post.author.profile_image.trim() !== "";
  const hasPostImage =
    typeof post.image === "string" && post.image.trim() !== "";
  return (
    <Card sx={{ width: "100%", marginTop: "40px" }}>
      <CardHeader
        sx={{ background: "rgb(148 176 203 / 23%)" }}
        avatar={
          <Avatar
            sx={{ bgcolor: red[500] }}
            aria-label="recipe"
            src={hasProfileImage ? post.author.profile_image : undefined}
          >
            {!hasProfileImage && post.author?.name
              ? post.author.name[0].toUpperCase()
              : null}
          </Avatar>
        }
        title={post.author.username}
      />
      <Divider />
      <CardMedia
        component="img"
        height="350"
        image={hasPostImage ? post.image : placeholderImg}
        alt={post.title || "Post image"}
      />

      <CardContent>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary" }}
          gutterBottom
        >
          {post.created_at}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {post.body}
        </Typography>
      </CardContent>
      <Divider />
      <CardActions disableSpacing>
        <Box
          component="button"
          type="button"
          sx={{
            display: "flex",
            border: "none",
            background: "transparent",
            alignItems: "center",
            color: "text.secondary",
            "@media (hover: hover)": {
              "&:hover, &:focus": {
                color: "primary.main",
                "& svg": {
                  opacity: 1,
                },
              },
            },
          }}
        >
          <ModeComment
            sx={{
              opacity: 0.6,
              fontSize: "1.125em",
              verticalAlign: "middle",
              "&:first-of-type": {
                marginRight: 1,
              },
              "&:last-of-type": {
                marginLeft: 1,
              },
            }}
          />{" "}
          {post.comments_count}
        </Box>
      </CardActions>
    </Card>
  );
}
