import { Image, Menu, Typography } from "antd";
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

import bg from "../../../img/news.jpg";
import AdminRoutes from "../../../components/admin/admin/routes";
import Footer from "../../../components/footer/footer";
import Header from "../../../components/header/header";
function Admin() {
  const [user, setUser] = useState(null);

  const getUserInfor = () => {
    return fetch(
      "https://koicaresystemapi.azurewebsites.net/api/Account/Profile"
    ).then((res) => res.json());
  };

  useEffect(() => {
    getUserInfor()
      .then((res) => {
        setUser(res);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
      });
  }, []);

  const navigate = useNavigate();
  return (
    <div className="Admin">
      <Header />
      <img src={bg} className="Contact__img" alt="" />
      <h1 className="admin__header">Admin Page</h1>
      <div className="Header">
        {user && <Image width={50} src={user.image} />}

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
              // {
              //   label: "Reports", // Thêm mục Reports
              //   key: "/admin/reports", // Đường dẫn đến trang báo cáo
              //   icon: <DashboardOutlined />, // Bạn có thể thay đổi icon nếu muốn
              // },
              // {
              //   label: "Logout",
              //   key: "/login",
              //   icon: <LogoutOutlined />,
              // },
            ]}
          ></Menu>
        </div>
        <div className="Content">
          <AdminRoutes />
        </div>
      </div>
      <div className="Footer">
        {user && (
          <Typography.Link href="tel:{user.phone}">
            {user.phone}
          </Typography.Link>
        )}
        <Typography.Link href="https://www.google.com" target={"_blank"}>
          Privacy Policy
        </Typography.Link>
        <Typography.Link href="https://www.google.com" target={"_blank"}>
          Terms of Use
        </Typography.Link>
      </div>
      <br />
      <br />
      <Footer />
    </div>
  );
}
export default Admin;
