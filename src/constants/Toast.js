import { showMessage } from "react-native-flash-message";

const Toast = {
  success: (title, message, position = "top") => {
    showMessage({
      message: title,
      description: message,
      type: "success",
      position, // "top" | "center" | "bottom"
    });
  },

  error: (title, message, position = "top") => {
    showMessage({
      message: title,
      description: message,
      type: "danger",
      position,
    });
  }
};

export default Toast;
