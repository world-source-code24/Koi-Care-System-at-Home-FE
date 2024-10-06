import "./header.scss";
import { Link } from "react-router-dom";
import koi from "../../img/logo.png.jpg";
import { useState } from "react";
import { Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";

function Header() {
  const [visible, setVisible] = useState(false);

  const handleMenu = () => {
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <>
      <div className="header">
        <div className="header__logo">
          <img className="" src={koi} alt="Koi" width={80} />
          <h2>Royal Koi</h2>
        </div>

        <div className="header__nav">
          <Link to="/" className="nav__news">
            Home
          </Link>
          <Link to="/login" className="nav__login">
            Login
          </Link>
          <Link to="/profile" className="nav__profile">
            Profile
          </Link>
          <Link
            to="https://www.usnews.com/news/business/articles/2023-11-10/koi-emerges-as-new-source-of-souring-relations-between-japan-and-china"
            className="nav__news"
          >
            Blog and News
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
        <a href="/add">Add New Koi</a>
        <a href="/mykoi">My Koi Fish</a>
        <a href="/list">List of Koi</a>
        <a href="/environment">Environment Monitor</a>
        <a href="#">Statistics Table</a>
        <a href="#">Recommendations</a>
        <a href="#">Advice</a>
        <a href="#">Blogs and News</a>
        <a href="/cart">Cart</a>
        <a href="#">Logout</a>
      </div>
    </>
  );
}

export default Header;
