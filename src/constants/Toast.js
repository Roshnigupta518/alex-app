import { showMessage } from "react-native-flash-message";

const Toast = {
    success: (title, message) => {
        showMessage({
            message:title,
            description:message,
            type: "success",
        })
    },

    error: (title, message) => {
        showMessage({
            message: title,
            description: message,
            type: "danger",
        })
    }
};

export default Toast;