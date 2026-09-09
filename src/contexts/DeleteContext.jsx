import { createContext, useContext, useState } from "react";
import DeletePostDialog from "../components/dialogs/DeletePostDialog";

const DeleteContext = createContext();

export function DeleteProvider({ children }) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentPost, setCurrentPost] = useState({});
  const [onSuccessCallback, setOnSuccessCallback] = useState(null);

  function handleOpenDeleteDialog(post, onSuccess) {
    setCurrentPost(post);
    setOpenDeleteDialog(true);
    if (onSuccess) setOnSuccessCallback(() => onSuccess);
  }

  function handleCloseDeleteDialog() {
    setOpenDeleteDialog(false);
  }

  const handlePostDeleted = (deletedPostId) => {
    if (onSuccessCallback) {
      onSuccessCallback(deletedPostId);
    }
    handleCloseDeleteDialog();
  };

  return (
    <DeleteContext.Provider
      value={{ openDeleteDialog: handleOpenDeleteDialog }}
    >
      {children}
      <DeletePostDialog
        open={openDeleteDialog}
        handleClose={handleCloseDeleteDialog}
        currentPost={currentPost}
        onPostDeleted={handlePostDeleted}
      />
    </DeleteContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDelete = () => {
  return useContext(DeleteContext);
};
