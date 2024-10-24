import { Navigate } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify"; // Import toast và ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import CSS của toastify
import { useEffect } from "react";
import { useUser } from "../../UserProvider/UserProvider/UserProvider";

const ProtectedRoute = ({ element, requiredRole }) => {
  const { user } = useUser(); // Truy cập vào context user

  useEffect(() => {
    // Kiểm tra vai trò khi user truy cập trang không phải member
    if (user && requiredRole === "member" && user.role !== "member") {
      toast.error("You need to purchase a membership to access this content", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
    }
  }, [user, requiredRole]);

  if (!user) {
    // Nếu chưa đăng nhập, điều hướng đến trang login
    return <Navigate to="/" replace />;
  }

  // Kiểm tra vai trò người dùng
  if (requiredRole && user.role.toLowerCase() !== requiredRole.toLowerCase()) {
    // Nếu người dùng không phải member, điều hướng về trang chủ sau khi hiển thị thông báo
    return (
      <>
        <ToastContainer /> {/* Hiển thị container của toastify */}
        <Navigate to="/" replace />
      </>
    );
  }

  // Nếu người dùng có vai trò phù hợp, render component tương ứng
  return element;
};

export default ProtectedRoute;
