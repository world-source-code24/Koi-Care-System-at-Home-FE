import "./mykoi.scss";
import Header from "../../components/header/header";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Tooltip,
  Upload
} from "antd";
import { FilterOutlined, UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";
const { Option } = Select;

function Mykoi() {
  const [form] = Form.useForm();
  const [showFilters, setShowFilters] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ponds, setPonds] = useState([]);
  const [koiData, setKoiData] = useState([]);
  const [selectedPond, setSelectedPond] = useState(null);
  const [image, setImage] = useState(null);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchPonds = async () => {
      try {
        const accId = localStorage.getItem("userId");
        const response = await axios.get(
          `https://koicaresystemapi.azurewebsites.net/api/Show-All-Ponds-UserID/${accId}`
        );
        setPonds(response.data.listPond["$values"]);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách hồ", error);
      }
    };
    fetchPonds();

    const storedKoiData = localStorage.getItem("koiData");
    if (storedKoiData) {
      setKoiData(JSON.parse(storedKoiData));
    }
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (!selectedPond) {
        console.error("Vui lòng chọn hồ trước khi thêm cá koi.");
        return;
      }

      const newKoi = {
        koiId: 0,
        name: values.name,
        image: image, 
        physique: values.physique || "string",
        age: values.age || 0,
        length: values.length || 0,
        weight: values.weight || 0,
        sex: values.sex === "male",
        breed: values.breed || "string",
        pondId: selectedPond,
        koiGrowthChartsTbls: { $values: [] }
      };

      const response = await fetch(`https://koicaresystemapi.azurewebsites.net/api/pond/${selectedPond}/Koi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newKoi),
      });

      if (response.ok) {
        console.log("Cá koi đã được thêm thành công vào hồ.");
        const data = await response.json();
        
        const updatedKoiData = [...koiData, data];
        setKoiData(updatedKoiData);
        localStorage.setItem("koiData", JSON.stringify(updatedKoiData));

        form.resetFields();
        setIsModalVisible(false);
        setFileList([]); 
        setImage(null);  
      } else {
        const errorData = await response.json();
        console.error("Lỗi khi thêm cá vào hồ:", errorData);
      }
    } catch (error) {
      console.log("Validation failed or API error:", error);
    }
  };

  const handlePondChange = (value) => {
    setSelectedPond(value);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setImage(null); 
    setFileList([]); 
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
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
      <div className="mykoi_background"></div>
      <div className="mykoi_title">
        <h1>My Koi Fish</h1>
      </div>
      <div className="mykoi_divider">
        <Divider />
      </div>

      <div className="mykoi_area">
        <Button type="primary" onClick={showModal}>
          Add new koi
        </Button>

        <Tooltip title="Filter">
          <Button
            type="default"
            shape="circle"
            icon={<FilterOutlined />}
            onClick={toggleFilters}
            style={{ marginLeft: 10 }}
          />
        </Tooltip>
      </div>

      {/* Hiển thị danh sách cá koi */}
      <div className="koi_list">
        {koiData.map((koi, index) => (
          <div key={index} className="koi_item">
            {koi.image && (
              <img
                src={koi.image}
                alt={koi.name}
                style={{ width: 100, height: 100 }}
              />
            )}
            <div className="koi_info">
              <p><strong>Name:</strong> {koi.name}</p>
              <p><strong>Age:</strong> {koi.age || "-"}</p>
              <p><strong>Variety:</strong> {koi.variety || "-"}</p>
              <p><strong>Length:</strong> {koi.length} cm</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        title="Add new koi"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Image"
                name="imageUrl"
                rules={[{ required: true, message: "Please upload an image" }]}
              >
                <Upload
                  beforeUpload={handleImageUpload}
                  listType="picture"
                  fileList={fileList} // Sử dụng fileList để quản lý file tải lên
                  onRemove={() => {
                    setFileList([]); // Xóa file khỏi fileList khi người dùng xóa
                    setImage(null); // Xóa URL tạm thời của ảnh
                  }}
                >
                  <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
              </Form.Item>
              {image && <img src={image} alt="Uploaded preview" width="100%" />}
            </Col>
            <Col span={12}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter the name" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          {/* Các trường nhập khác */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Physique" name="physique">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Age" name="age">
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Length (cm)" name="length">
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Weight (g)" name="weight">
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Sex" name="sex">
                <Select>
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="not_specified">Not specified</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Breed" name="breed">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Pond" name="pond">
                <Select onChange={handlePondChange}>
                  {ponds.map((pond) => (
                    <Option key={pond.pondId} value={pond.pondId}>
                      {pond.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default Mykoi;