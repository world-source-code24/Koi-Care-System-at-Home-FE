import "./login.scss";
import koi from "../../img/koi.jpg";
import logo from "../../img/logo.png.jpg";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";

import axios from "axios";
import { useState } from "react";
import api from "../../config/axios";

function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [error, setError] = useState("");

  const handleLogin = async (values) => {
    const { email, password } = values;
  
    try {
      const response = await api.post("/", { email, password });
      console.log(response);  // Kiểm tra dữ liệu trả về từ API
  
      if (response.data.success) {

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Giả sử thông tin user nằm trong response.data.user

        navigate("/"); 
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || "Email or password is incorrect");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };
  
  const handleLoginGoogle = async () => {
    window.location.href = "https://localhost:5001/api/Login/signin-google";
  };

  return (
    <div className="container__login">
      <div className="row login__page">
        <div className="col-md-6 left">
          <img className="koi" src={koi} alt="Koi" width="59%" />
        </div>
        <div className="col-md-6 right">
          <div className="login">
            <img className="login__logo" src={logo} alt="" width="30%" />
            <p>Royal Koi</p>
            <h2>Login into your account</h2>

            <Form className="login__form" onFinish={handleLogin} form={form}>
              <Form.Item
                name="email"
                rules={[
                  {
                    type: "email",
                    required: true,
                    message: "Please enter your email",
                  },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>
              {error && (
                <Form.Item>
                  <div style={{ color: "red" }}>{error}</div>
                </Form.Item>
              )}
              <Form.Item>
                <Button
                  type="secondary"
                  htmlType="submit"
                  className="login__but1"
                  block
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
            <b>Forgot password?</b>
            <div className="signup">
              <h3>New member?</h3>
              <Link to={"/register"}>Sign Up Now!</Link>
            </div>
            <div className="divider"></div>
            <button className="login__google" onClick={handleLoginGoogle}>
              <img
                className="google"
                src="https://tse2.mm.bing.net/th?id=OIP.DdVPhTob_7Dpl5-BRiaK8wHaHa&pid=Api&P=0&h=220"
                width={20}
                alt="Google Logo"
              />
              <span>Sign in with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;