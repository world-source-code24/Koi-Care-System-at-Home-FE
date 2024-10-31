import { Menu, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./admin.scss";
import {
  DashboardOutlined,
  LogoutOutlined,
  ProductOutlined,
  ShopOutlined,
  UserOutlined,
} from "@ant-design/icons";

import AdminRoutes from "../../../components/admin/admin/routes";
function Admin() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const getUserInfor = async () => {
    // Thêm async vào đây
    try {
      const response = await axiosInstance.get("/api/Account/Profile");
      return response.data;
    } catch (error) {
      console.error("Error fetching user info:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        navigate("/login");
      }
      throw error;
    }
  };

  const handleLogout = () => {
    // Clear token and other local storage data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("role");
    navigate("/login", { replace: true }); // Use replace to prevent going back
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect if not authenticated
      return;
    }

    getUserInfor()
      .then((res) => {
        if (res && res.role) {
          // Kiểm tra res và res.role trước khi truy cập
          setUser(res);
          if (res.role !== "admin") {
            navigate("/login");
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
        navigate("/"); // Redirect to homepage on error
      });
  }, [navigate]);

  return (
    <div className="Admin">
      <h1 className="admin__header">Admin Page</h1>
      <div className="Header">
        <br />
      </div>
      <div className="SideMenuAndContent">
        <div className="SideMenu">
          <Menu
            className="SideMenuVertical"
            mode="vertical"
            onClick={(item) => {
              navigate(item.key);
            }}
            items={[
              {
                label: "Dashboard",
                key: "/admin/dashboard",
                icon: <DashboardOutlined />,
              },
              {
                label: "User Management",
                key: "/admin/userManagement",
                icon: <UserOutlined />,
              },
              {
                label: "Shop Management",
                key: "/admin/shopManagement",
                icon: <ShopOutlined />,
              },
              {
                label: "Product Management",
                key: "/admin/productManagement",
                icon: <ProductOutlined />,
              },
              {
                label: "Logout",
                key: "/login",
                icon: <LogoutOutlined />,
                onClick: handleLogout,
              },
            ]}
          />
        </div>
        <div className="Content">
          <AdminRoutes />
        </div>
      </div>
      <div className="Footer">
        {user && (
          <Typography.Link href={`tel:${user.phone}`}>
            {user.phone}
          </Typography.Link>
        )}
        <Typography.Link href="https://www.google.com" target="_blank">
          Privacy Policy
        </Typography.Link>
        <Typography.Link href="https://www.google.com" target="_blank">
          Terms of Use
        </Typography.Link>
      </div>
    </div>
  );
}

export default Admin;
