import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./koidetail.scss";
import Header from "../../components/header/header";
import {
  Divider,
  Form,
  Input,
  Button,
  Upload,
  Modal,
  Space,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

function KoiDetail() {
  const { koiId } = useParams();
  const location = useLocation();
  const pondId = location.state?.pondId; // current pondId
  const [koiDetails, setKoiDetails] = useState(null);
  const [ponds, setPonds] = useState([]); // list of ponds for the user
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [image, setImage] = useState(null);

  // Fetch koi details and ponds list on component mount
  useEffect(() => {
    fetchKoiDetails();
    fetchPondsList();
  }, [pondId, koiId, form, navigate]);

  // Fetch koi details
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

  // Fetch user's ponds
  const fetchPondsList = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID không tồn tại trong localStorage.");
      return;
    }

    try {
      const response = await axios.get(
        `https://koicaresystemapi.azurewebsites.net/api/Show-All-Ponds-UserID/${userId}`
      );
      setPonds(response.data.listPond["$values"]);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách hồ:", error);
    }
  };

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
        pondId: values.pondId, // updated pondId from select field
      };

      console.log("Dữ liệu gửi đến API:", updatedData);

      const response = await axios.put(
        `https://koicaresystemapi.azurewebsites.net/api/pond/${updatedData.pondId}/Koi/${koiId}`,
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
      }
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
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

  const handleCancel = () => {
    setIsEditing(false);
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
          <Form.Item label="Ảnh" style={{ width: "400px" }}>
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

          <Form.Item label="Pond" name="pondId" initialValue={pondId}>
            <Select disabled={!isEditing}>
              {ponds.map((pond) => (
                <Option key={pond.pondId} value={pond.pondId}>
                  {pond.name}
                </Option>
              ))}
            </Select>
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
            <Space direction="horizontal">
              {isEditing ? (
                <>
                  <Button
                    style={{ width: "100px" }}
                    type="primary"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button
                    style={{ width: "100px", marginLeft: "10px" }}
                    type="primary"
                    onClick={handleCancel}
                    danger
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    style={{ width: "100px" }}
                    type="primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="primary"
                    danger
                    onClick={handleDelete}
                    style={{ marginLeft: "10px", width: "100px" }}
                  >
                    Delete
                  </Button>
                </>
              )}
            </Space>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

export default KoiDetail;