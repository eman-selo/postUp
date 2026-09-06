import { useEffect, useRef, useContext } from "react";
import { Box, Container, CircularProgress, Typography } from "@mui/material";
import Post from "./Post";
import { PostsContext } from "../contexts/getPostsContext.jsx";

export default function Posts() {
  const { posts, loading, hasMore, setPage } = useContext(PostsContext);
  const loaderRef = useRef(null);

  useEffect(() => {
    // إنشاء المراقب لمتابعة التمرير
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        // إذا ظهر عنصر التحميل أسفل الصفحة وكانت هناك صفحات إضافية ولم نكن في حالة تحميل حالية
        if (target.isIntersecting && hasMore && !loading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, loading, setPage]);

  return (
    <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 4 }}>
      {posts.map((post) => (
        <Box key={post.id} sx={{ mb: 4 }}>
          <Post post={post} />
        </Box>
      ))}

      {/* العنصر المرجعي أسفل الصفحة لمراقبة التمرير وإظهار اللودر */}
      <Box
        ref={loaderRef}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          my: 4,
        }}
      >
        {loading && <CircularProgress size={32} />}
        {!hasMore && (
          <Typography color="text.secondary" variant="body2">
            وصلت إلى نهاية المنشورات
          </Typography>
        )}
      </Box>
    </Container>
  );
}
