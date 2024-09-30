import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import "./profile.scss";
import axios from "axios";
import { Button, Image, Input, Layout, Menu, message, Modal, Radio, Upload } from "antd";
import { Form, useNavigate } from "react-router-dom";

import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";

function Profile() {
  const { Sider, Content } = Layout;

  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

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

  //     <button className="avatar_upload_button" type="button">
  //       <PlusOutlined className="upload_icon" />
  //       <div className="upload_text">Upload</div>
  //     </button>
  //   );

  return (
    <>
      <div>
        <Header />
      </div>
      <div className="profile_background">
        <div className="profile_container">
          {/* Sider */}
          <Layout style={{ width: "100%", minHeight: "500px" }}>
            <Sider className="profile_sider" width={300} theme="light">
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
              <Button type="primary" onClick={showModal}>
                Membership
              </Button>

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
                  <Input placeholder="Full Name" />
                </Form>

                <Form name="phone">
                  <div className="title">Phone: </div>
                  <Input placeholder="Number Phone" />
                </Form>

                <Form name="email">
                  <div className="title">Email: </div>
                  <Input placeholder="Email" />
                </Form>

                <Form name="address">
                  <div className="title">Address: </div>
                  <Input placeholder="Address: 445/12 Tan Hoa Dong Str, ..." />
                </Form>
              </div>
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
