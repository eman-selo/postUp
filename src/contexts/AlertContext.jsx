import { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    open: false,
    type: "info", // 'error' | 'warning' | 'info' | 'success'
    message: "",
  });

  const showAlert = (message, type = "info") => {
    setAlert({
      open: true,
      type,
      message,
    });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setAlert((prev) => ({ ...prev, open: false }));
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      {/* التنبيه العالمي المنبثق (Toast / Snackbar) */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000} // يختفي تلقائياً بعد 4 ثوانٍ
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // موقعه أعلى الشاشة
      >
        <Alert
          onClose={handleClose}
          severity={alert.type}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
};

// Hook مخصص لسهولة الاستخدام
// eslint-disable-next-line react-refresh/only-export-components
export const useAlert = () => useContext(AlertContext);
