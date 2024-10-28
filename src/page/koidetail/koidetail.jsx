import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import './koidetail.scss'; 
import Header from "../../components/header/header";
import { Divider, Form, Input, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ca from "../../img/ca11.jpg";
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

  useEffect(() => {
    const fetchKoiDetails = async () => {
      if (!pondId || !koiId) {
        console.error("Pond ID hoặc Koi ID không hợp lệ.");
        return;
      }

      try {
        const response = await axios.get(`https://koicaresystemapi.azurewebsites.net/api/Koi/${koiId}`);
        setKoiDetails(response.data);
        form.setFieldsValue(response.data);
        setImage(response.data.image);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết cá Koi:", error);
      }
    };

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
        pondId: pondId || 0
      };
    
      console.log("Dữ liệu gửi đến API:", updatedData);
    
      const response = await axios.put(
        `https://koicaresystemapi.azurewebsites.net/api/pond/${pondId}/Koi/${koiId}`,
        updatedData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    
      if (response.status === 200) {
        console.log("Cập nhật thành công");
        setIsEditing(false);
        setKoiDetails(updatedData);
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
      <div className="koide_divider"><Divider/></div>
      
      <div className="koide_form_wrapper">
        <Form form={form} layout="vertical">
        <Form.Item label="Ảnh">
            {/* {isEditing ? (
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
              image && <img src={image} alt="Koi Image" style={{ width: "100%", maxWidth: "300px" }} />
            )} */}
            <img src={ca} alt="" />
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
              <Button type="primary" onClick={handleSave}>Save</Button>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            )}
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

export default KoiDetail;
