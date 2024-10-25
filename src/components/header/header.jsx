import "./header.scss";
import { Link, useNavigate } from "react-router-dom";
import koi from "../../img/logo.png.jpg";
import { useState, useEffect } from "react";
import { Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";

function Header() {
  const [visible, setVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false); // Trạng thái để kiểm tra Admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token || localStorage.getItem("accId")) {
      setIsLoggedIn(true); // Đã đăng nhập
    } else {
      setIsLoggedIn(false); // Chưa đăng nhập
    }
  }, []);

  const handleMenu = () => {
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleLogout = () => {
    // Xóa token và thông tin người dùng khỏi localStorage khi logout
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setIsAdmin(false); // Reset trạng thái Admin
    navigate("/login");
  };

  return (
    <>
      <div className="header">
        <div className="header__logo">
          <Link to="/">
            <img className="" src={koi} alt="Koi" width={80} />
          </Link>
          <h2>Royal Koi</h2>
        </div>

        <div className="header__nav">
          <Link to="/" className="nav__news">
            Home
          </Link>

          <Link to="/news" className="nav__news">
            Blog and News
          </Link>

          {isLoggedIn ? (
            <>
              <Link to="/profile" className="nav__profile">
                Profile
              </Link>
              {isAdmin && ( // Nếu người dùng là Admin, hiển thị nút Manager
                <Link to="/admin/dashboard" className="nav__manager">
                  Manager
                </Link>
              )}
              <Link onClick={handleLogout} className="nav__logout">
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="nav__login">
                Login
              </Link>
            </>
          )}
          <Link to="/cart" className="nav__news">
            Cart
          </Link>

          <span className="nav__menu">
            <Button onClick={handleMenu}>
              <MenuOutlined className="" />
            </Button>
          </span>
        </div>
      </div>

      {visible && <div className="overlay" onClick={handleClose}></div>}

      <div className={`sidebar ${visible ? "active" : ""}`}>
        <a href="#" className="closebtn" onClick={handleClose}>
          ×
        </a>
        <Link to="/" className="nav__news">
          Home Page
        </Link>
        <Link to="/mykoi" className="nav__news">
          My Koi Fish
        </Link>
        <Link to="/environment" className="nav__news">
          Environment Monitor
        </Link>
        <Link to="/food" className="nav__news">
          Food Calculator
        </Link>
        <Link to="/salt" className="nav__news">
          Salt Calculator
        </Link>
        <Link to="/contact" className="nav__news">
          Contact Us
        </Link>
      </div>
    </>
  );
}

export default Header;
