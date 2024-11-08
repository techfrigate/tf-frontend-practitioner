import toast from "react-hot-toast";

// Custom toast for success messages
export const showSuccessToast = (message) => {
  toast(message, {
    style: {
      borderRadius: "10px",
      background: "#e0f7fa", // Light blue background for success
      color: "#00695c", // Dark teal text for success
      fontSize: "13px",
      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
    },
  });
};

// Custom toast for error messages
export const showErrorToast = (message) => {
  toast(message, {
    icon: "❌", // Cross icon for error
    style: {
      borderRadius: "10px",
      background: "#ffebee", // Light red background for error
      color: "#b71c1c", // Dark red text for error
      fontSize: "13px",
      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
    },
  });
};
