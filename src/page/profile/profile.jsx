import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import "./profile.scss";
import axios from "axios";
import {
  Button,
  Image,
  Input,
  Layout,
  Menu,
  message,
  Modal,
  Radio,
  Upload,
} from "antd";
import { Form, useNavigate } from "react-router-dom";

import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

function Profile() {
  const { Sider, Content } = Layout;

  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token"); // Lấy Access Token từ localStorage

      if (token) {
        try {
          const response = await axios.get(
            "https://localhost:5001/api/Account/Profile",
            {
              // Gọi API để lấy thông tin người dùng
              headers: {
                Authorization: `Bearer ${token}`, // Gửi Access Token
              },
            }
          );

          setUserInfo({
            fullName: response.data.name || "",
            email: response.data.email || "",
            phone: response.data.phone || "",
            address: response.data.address || "",
          }); // Thiết lập thông tin người dùng vào trạng thái
          console.log(userInfo);
        } catch (error) {
          console.error("Error fetching user info:", error);
          if (error.response && error.response.status === 401) {
            // Nếu token không hợp lệ hoặc hết hạn
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login"); // Chuyển hướng về trang đăng nhập
          }
        }
      } else {
        navigate("/"); // Chuyển hướng về trang đăng nhập khi không có token
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleEditToggle = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("fullName", userInfo.fullName);
      formData.append("phone", userInfo.phone);
      formData.append("address", userInfo.address);
      if (image) {
        formData.append("", image); // name tên trong API
      }

      await axios.put("https://localhost:5001/api/Account/Profile", formData, {
        //API
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMessage("Update Successfully !!!");
      setIsEditing(false);
    } catch (error) {
      message.error("Failed to update information");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    message.success("You have selected: " + selectedPackage);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleImageUpload = (file) => {
    setImage(URL.createObjectURL(file));
    // setImage(file);
    return false;
  };

  const handleLogout = async () => {
    try {
      await axios.post(""); // API

      // Dùng để xóa thông tin đăng nhập
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      message.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      message.error("Failed to log out. Please try again.");
    }
  };

  return (
    <>
      <div>
        <Header />
      </div>
      <div className="profile_background">
        <div className="profile_container">
          {/* Sider */}
          <Layout style={{ width: "100%", minHeight: "500px" }}>
            <Sider className="profile_sider" width={250} theme="light">
              <Menu
                mode="vertical"
                defaultSelectedKeys={[1]}
                className="profile_menu"
                onClick={({ key }) => {
                  if (key === "4") handleLogout();
                }}
              >
                <Menu.Item key={1}>Account Settings</Menu.Item>
                <Menu.Item key={2}>Your Order</Menu.Item>
                <Menu.Item key={3}>Reset Password</Menu.Item>
                <Menu.Item key={4}>Log out</Menu.Item>
              </Menu>
            </Sider>

            <Content className="profile_content">
              <h5>Account Settings</h5>

              <p onClick={showModal} className="membership-button">
                Membership
              </p>

              {/*Divider */}
              <div className="profile_divider"></div>

              {/*Modal Membership*/}
              <Modal
                title="Membership Packages"
                visible={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                  <Button key="buy" type="primary" onClick={handleOk}>
                    Buy Now
                  </Button>,
                  <Button
                    key="cart"
                    onClick={() => message.success("Added to cart")}
                  >
                    Add to Cart
                  </Button>,
                ]}
              >
                <Radio.Group
                  onChange={(e) => setSelectedPackage(e.target.value)}
                  value={selectedPackage}
                >
                  <Radio
                    style={{ display: "block", marginBottom: "8px" }}
                    value="1-month"
                  >
                    1 Month / 109k
                  </Radio>
                  <Radio
                    style={{ display: "block", marginBottom: "8px" }}
                    value="3-months"
                  >
                    3 Months / 259k
                  </Radio>
                  <Radio
                    style={{ display: "block", marginBottom: "8px" }}
                    value="12-months"
                  >
                    12 Months / 799k
                  </Radio>
                </Radio.Group>
              </Modal>

              <div className="profile_body_form">
                <Form className="avatar">
                  <div className="title">Avatar Profile: </div>
                  <Upload beforeUpload={handleImageUpload}>
                    <Button icon={<UploadOutlined />}>Upload Image</Button>
                  </Upload>

                  {image && (
                    <div>
                      <img src={image} alt="Uploaded" width="20%" />
                    </div>
                  )}
                </Form>

                <Form name="fullName">
                  <div className="title">Full Name: </div>
                  <Input
                    name="fullName"
                    placeholder="Full Name"
                    value={userInfo.fullName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={{ backgroundColor: isEditing ? "white" : "#f0f0f0" }}
                  />
                </Form>

                <Form name="phone">
                  <div className="title">Phone: </div>
                  <Input
                    placeholder="Number Phone"
                    name="phone"
                    value={userInfo.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={{ backgroundColor: isEditing ? "white" : "#f0f0f0" }}
                  />
                </Form>

                <Form name="email">
                  <div className="title">Email: </div>
                  <Input
                    placeholder="Email"
                    name="email"
                    value={userInfo.email}
                    onChange={handleInputChange}
                    disabled // Email không cho phép chỉnh sửa
                    style={{ backgroundColor: "#f0f0f0" }}
                  />
                </Form>

                <Form name="address">
                  <div className="title">Address: </div>
                  <Input
                    placeholder="Address: 445/12 Tan Hoa Dong Str, ..."
                    name="address"
                    value={userInfo.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={{ backgroundColor: isEditing ? "white" : "#f0f0f0" }}
                  />
                </Form>
              </div>

              {/* Edit*/}
              <Button
                className="edit_button"
                onClick={handleEditToggle}
                style={{ marginBottom: "15px" }}
              >
                {isEditing ? "Save" : "Edit"}
              </Button>
              {successMessage && (
                <div className="success_message">{successMessage}</div>
              )}
            </Content>
          </Layout>
          {previewImage && (
            <Image
              wrapperStyle={{
                display: "none",
              }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Profile;
