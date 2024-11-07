import "./header.scss";
import { Link, useNavigate } from "react-router-dom";
import koi from "../../img/logo.png.jpg";
import { useState, useEffect } from "react";
import { Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import axiosInstance from "../api/axiosInstance";

function Header() {
  const [visible, setVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const response = await axiosInstance.get("Account/Profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const user = response.data;

          if (user && user.accId) {
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("userId", user.accId);
            setIsLoggedIn(true);
          } else {
            console.warn("User data or accId is missing");
            setIsLoggedIn(false);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setIsLoggedIn(false);
      }
    };

    fetchProfile();
  }, []);

  const handleMenu = () => {
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <>
      <div className="header">
        <div className="header__logo">
          <Link to="/">
            <img src={koi} alt="Koi" width={80} />
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
          <Link to="/cart" className="nav__news">
            Cart
          </Link>
          {isLoggedIn ? (
            <Link to="/profile" className="nav__profile">
              Profile
            </Link>
          ) : (
            <Link to="/login" className="nav__login">
              Login
            </Link>
          )}
          <span className="nav__menu">
            <Button onClick={handleMenu}>
              <MenuOutlined />
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
        {isLoggedIn && (
          <Link onClick={handleLogout} className="nav__logout">
            Logout
          </Link>
        )}
      </div>
    </>
  );
}

export default Header;
