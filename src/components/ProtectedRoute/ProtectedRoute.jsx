import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";

// Component bảo vệ trang
const ProtectedRoute = ({ element, requiredRole }) => {
  const { user } = useUser();

  if (!user) {
    // Nếu chưa đăng nhập, điều hướng về trang đăng nhập
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Nếu người dùng không có vai trò phù hợp, điều hướng về trang chủ
    return <Navigate to="/" replace />;
  }

  // Nếu đủ điều kiện, render trang
  return element;
};

export default ProtectedRoute;
