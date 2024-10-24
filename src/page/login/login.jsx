import "./login.scss";
import koi from "../../img/koi.jpg";
import logo from "../../img/logo.png.jpg";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";

import axios from "axios";
import { useState } from "react";
import api from "../../config/axios";
import { useUser } from "../../components/UserProvider/UserProvider/UserProvider";

function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [error, setError] = useState("");
  const { setUser } = useUser(); // Lấy hàm setUser từ context để cập nhật người dùng
  const handleLogin = async (values) => {
    const { email, password } = values;

    try {
      const response = await api.post("User/Login", { email, password });

      if (response.data.success) {
        const token = response.data.data.accessToken;
        localStorage.setItem("token", token);

        if (token) {
          const userResponse = await api.get("Account/Profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const user = userResponse.data;
          setUser(user);

          if (user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLoginGoogle = async () => {
    window.location.href =
      "https://koicaresystemapi.azurewebsites.net/index.html?fbclid=IwY2xjawFxyedleHRuA2FlbQIxMAABHbwVrU1l3r4bIwj-2uamfChUuab0U2bD6fiUhK_bGYhemCyBNcWS9GvHdQ_aem_Y4Bg8BPTdJB_GOpMGFc1zg";
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
