import "./login.scss";
import koi from "../../img/koi.jpg";
import logo from "../../img/logo.png.jpg";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Modal } from "antd";
import { useState } from "react";
import api from "../../config/axios";
import { useUser } from "../../components/UserProvider/UserProvider/UserProvider";
import axiosInstance from "../../components/api/axiosInstance";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [error, setError] = useState("");
  const { setUser } = useUser();
  const [showShopCodeModal, setShowShopCodeModal] = useState(false); // Trạng thái để hiển thị modal nhập mã shop
  const [shopCode, setShopCode] = useState(""); // Biến lưu trữ mã shop nhập vào

  const handleLogin = async (values) => {
    const { email, password } = values;

    try {
      localStorage.clear();
      const response = await api.post("User/Login", { email, password });
      console.log(response);

      if (response.data.success) {
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);
        const token = localStorage.getItem("accessToken");

        if (token) {
          const userResponse = await axiosInstance.get("Account/Profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const user = userResponse.data;
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("userId", user.accId);
          setUser(user);

          if (user.role === "admin") {
            navigate("/admin/dashboard");
          } else if (user.role === "shop") {
            // Hiển thị modal yêu cầu nhập shopCode
            setShowShopCodeModal(true);
          } else {
            navigate("/");
          }
        }
      }
    } catch (error) {
      console.log(error.toString());
      if (error.response && error.response.data) {
        setError(
          error.response.data.message || "Email or password is incorrect"
        );
      } else {
        setError("An error occurred. Please try again.");
        localStorage.clear();
      }
    }
  };

  const handleShopCodeSubmit = async () => {
    try {
      if (!shopCode) {
        setError("Please enter a valid shop code.");
        return;
      }

      const shopVerifyResponse = await axios.get(
        `https://localhost:5001/api/Shop/verifyShop?shopCode=${shopCode}`
      );

      // Fix the check for the success field, it's a boolean now
      if (shopVerifyResponse.data.success) {
        localStorage.setItem("shopId", shopVerifyResponse.data.id); // Save the shopId
        navigate("/shop/orderList"); // Redirect to shop order list
      } else {
        setError("Shop verification failed. Access denied.");
      }

      setShowShopCodeModal(false); // Close the modal after processing
    } catch (error) {
      console.error("Shop verification error:", error);
      setError("Unable to verify shop access. Please try again later.");
    }
  };

  const handleShopCodeCancel = () => {
    setShowShopCodeModal(false); // Đóng modal nếu người dùng không nhập mã
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

      {/* Modal nhập mã Shop */}
      <Modal
        title="Enter Shop Code"
        visible={showShopCodeModal}
        onOk={handleShopCodeSubmit}
        onCancel={handleShopCodeCancel}
        okText="Verify"
        cancelText="Cancel"
      >
        <Input
          placeholder="Enter your shop code"
          value={shopCode}
          onChange={(e) => setShopCode(e.target.value)}
        />
        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
        )}
      </Modal>
    </div>
  );
}

export default Login;
