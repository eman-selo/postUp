import { createContext, useContext, useState } from "react";
import UpdatePostDialog from "../components/dialogs/UpdatePostDialog";

const UpdateContext = createContext();

export function UpdateProvider({ children }) {
  const [currentPost, setCurrentPost] = useState({});
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [onSuccessCallback, setOnSuccessCallback] = useState(null);

  function handleOpenUpdateDialog(post, onSuccess) {
    setCurrentPost(post);
    setOpenUpdateDialog(true);
    if (onSuccess) setOnSuccessCallback(() => onSuccess);
  }

  function handleCloseUpdateDialog() {
    setOpenUpdateDialog(false);
  }

  const handlePostUpdated = (updatedPost) => {
    if (onSuccessCallback) {
      onSuccessCallback(updatedPost);
    }
    handleCloseUpdateDialog();
  };

  return (
    <UpdateContext.Provider
      value={{ openUpdateDialog: handleOpenUpdateDialog }}
    >
      {children}
      <UpdatePostDialog
        open={openUpdateDialog}
        handleClose={handleCloseUpdateDialog}
        currentPost={currentPost}
        onPostUpdated={handlePostUpdated} // تمرير دالة التحديث لمكون الحوار
      />
    </UpdateContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUpdate = () => useContext(UpdateContext);
