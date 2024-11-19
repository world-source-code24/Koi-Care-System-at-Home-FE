import "./register.scss";
import koi from "../../../img/koi.jpg";
import logo from "../../../img/logo.png.jpg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Button, notification } from "antd";
import { useState, useEffect } from "react";
import api from "../../../config/axios";

function Register() {
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation to access location.search
  const [form] = Form.useForm();
  const [error, setError] = useState("");
  const [isVerify, setIsVerify] = useState(false); // Add this state for verification

  useEffect(() => {
    if (localStorage.getItem("isVerify") === "false") {
      navigate("/login");
      localStorage.removeItem("isVerify");
    }
  });

  useEffect(() => {
    // Check for the query parameter in the URL
    const queryParams = new URLSearchParams(location.search);
    const verificationStatus = queryParams.get("verification-success");

    if (verificationStatus === "true") {
      notification.success({
        description: "The account is registered successfully!!",
        placement: "topRight",
        duration: 2,
      });
      localStorage.setItem("isVerify", "false");
      navigate("/login");
    }
  }, [location, navigate]);

  const handleRegister = async (values) => {
    const { name, phone, email, password, confirmedPassword } = values;

    try {
      const response = await api.post(
        `User/Register?name=${name}&phone=${phone}&email=${email}&password=${password}&confirmedPassword=${confirmedPassword}`
      );

      if (response.status === 200) {
        const sendEmailresponse = await api.post(
          `https://koicaresystemapi.azurewebsites.net/api/User/verficode?receiveEmail=${email}`
        );
        if (sendEmailresponse.status === 200) {
          notification.success({
            description: "Check your email to verify your account.",
            placement: "topRight",
          });
        } else {
          notification.error({
            description:
              "There was an issue while processing. Please try again later.",
            placement: "topRight",
          });
        }
      }
    } catch (error) {
      let message = "An error occurred. Please try again.";
      if (error.response && error.response.data) {
        message = error.response.data.message;
      }
      setError(message); // Set the error state to display it on the form
      notification.error({
        description: message,
        placement: "topRight",
      });
    }
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
            <h2>Register</h2>

            <Form className="login__form" onFinish={handleRegister} form={form}>
              <Form.Item
                name="email"
                rules={[
                  {
                    type: "email",
                    required: true,
                    message:
                      "Please enter a valid email! For example: abc@gmail.com",
                  },
                ]}
              >
                <Input placeholder="Enter your email" />
              </Form.Item>
              <Form.Item
                name="name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input placeholder="Enter your full name" />
              </Form.Item>
              <Form.Item
                name="phone"
                rules={[{ required: true, message: "Please enter your phone" }]}
                tooltip="Ensure typing correct phone"
              >
                <Input placeholder="Enter your phone" />
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
              <Form.Item
                name="confirmedPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The passwords do not match")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm Password" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary" // Changed to "primary" for better style
                  htmlType="submit"
                  className="login__but1"
                  block
                >
                  Register
                </Button>
              </Form.Item>
            </Form>
            <div className="signup">
              <h3>Already signed up?</h3>
              <Link to="/login">Sign In Now!</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
