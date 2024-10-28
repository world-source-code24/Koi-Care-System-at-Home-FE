import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./koidetail.scss";
import Header from "../../components/header/header";
import { Divider, Form, Input, Button, Upload, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";

function KoiDetail() {
  const { koiId } = useParams();
  const location = useLocation();
  const pondId = location.state?.pondId;
  const [koiDetails, setKoiDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [image, setImage] = useState(null);

  const fetchKoiDetails = async () => {
    if (!koiId) {
      console.error("Pond ID hoặc Koi ID không hợp lệ.");
      return;
    }

    try {
      const response = await axios.get(
        `https://koicaresystemapi.azurewebsites.net/api/Koi/${koiId}`
      );
      setKoiDetails(response.data);
      form.setFieldsValue(response.data);
      setImage(response.data.image);
      console.log(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết cá Koi:", error);
    }
  };

  useEffect(() => {
    fetchKoiDetails();
  }, [pondId, koiId, form, navigate]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const updatedData = {
        koiId: koiDetails.koiId || 0,
        name: values.name || "string",
        image: image || "string",
        physique: values.physique || "string",
        age: values.age || 0,
        length: values.length || 0,
        weight: values.weight || 0,
        sex: values.sex === "male" ? true : false,
        breed: values.breed || "string",
        pondId: values.pondId,
      };

      console.log("Dữ liệu gửi đến API:", updatedData);

      const response = await axios.put(
        `https://koicaresystemapi.azurewebsites.net/api/pond/${pondId}/Koi/${koiId}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Cập nhật thành công");
        setIsEditing(false);
        setKoiDetails(updatedData);
        console.log(koiDetails);
      }
    } catch (error) {
      if (error.response) {
        console.error("Lỗi khi lưu dữ liệu:", error.response.data);
        console.error("Trạng thái lỗi:", error.response.status);
      } else if (error.request) {
        console.error("Không nhận được phản hồi từ máy chủ:", error.request);
      } else {
        console.error("Lỗi khác:", error.message);
      }
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Xác nhận xoá",
      content: "Bạn có chắc chắn muốn xoá Cá Koi này không?",
      okText: "Xoá",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const response = await axios.delete(
            `https://koicaresystemapi.azurewebsites.net/api/Koi/${koiId}`
          );

          if (response.status === 200) {
            console.log("Xóa thành công");
            navigate("/mykoi");
          } else {
            console.error("Lỗi khi xóa cá Koi:", response.data);
          }
        } catch (error) {
          console.error("Lỗi khi xoá Cá Koi:", error);
        }
      },
      onCancel() {
        console.log("Hủy xóa cá Koi");
      },
    });
  };

  const handleImageUpload = (file) => {
    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
    setFileList([file]);
    return false;
  };

  return (
    <>
      <Header />
      <div className="koide_background"></div>
      <div className="koide_header">
        <button className="koide_button" onClick={() => navigate("/mykoi")}>
          <span className="koide_back">← Quay lại</span>
        </button>
        <div className="koide_title">Chi tiết Cá Koi</div>
      </div>
      <div className="koide_divider">
        <Divider />
      </div>

      <div className="koide_form_wrapper">
        <Form form={form} layout="vertical">
          <Form.Item label="Ảnh">
            {isEditing ? (
              <Upload
                beforeUpload={handleImageUpload}
                listType="picture"
                fileList={fileList}
                onRemove={() => {
                  setFileList([]);
                  setImage(null);
                }}
              >
                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
              </Upload>
            ) : (
              image && (
                <img
                  src={image}
                  alt="Koi Image"
                  style={{ width: "100%", maxWidth: "300px" }}
                />
              )
            )}
          </Form.Item>

          <Form.Item label="Tên" name="name">
            <Input disabled={!isEditing} />
          </Form.Item>

          <Form.Item label="Age" name="age">
            <Input type="number" disabled={!isEditing} />
          </Form.Item>

          <Form.Item label="Length (cm)" name="length">
            <Input type="number" disabled={!isEditing} />
          </Form.Item>

          <Form.Item label="Physique" name="physique">
            <Input disabled={!isEditing} />
          </Form.Item>

          <Form.Item label="Weight (g)" name="weight">
            <Input type="number" disabled={!isEditing} />
          </Form.Item>

          <Form.Item>
            {isEditing ? (
              <Button type="primary" onClick={handleSave}>
                Save
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            )}
            <Button
              type="danger"
              onClick={handleDelete}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

export default KoiDetail;
