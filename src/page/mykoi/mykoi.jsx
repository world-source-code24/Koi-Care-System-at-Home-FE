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
  Upload,
} from "antd";
import { FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";
const { Option } = Select;
function Mykoi() {
  const [showFilters, setShowFilters] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ponds, setPonds] = useState([]);

  useEffect(() => {
    const fetchPonds = async () => {
      try {
        const accId = localStorage.getItem("userId");
        const response = await axios.get(
          `https://koicaresystemapi.azurewebsites.net/api/Show-All-Ponds-UserID/${accId}`
        );
        setPonds(response.data.listPond["$values"]);
        console.log(response.data.listPond["$values"]);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách hồ", error);
      }
    };
    fetchPonds();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSortChange = (value) => {
    console.log("Sort by:", value);
  };

  const handlePondChange = (value) => {
    console.log("Pond:", value);
  };

  const handleSexChange = (value) => {
    console.log("Sex:", value);
  };

  const handleStateChange = (value) => {
    console.log("State of life:", value);
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

      {showFilters && (
        <div className="filter_area">
          <label>Sort by:</label>
          <Select
            defaultValue="In pond since (newest first)"
            style={{ width: 200, marginTop: 10 }}
            onChange={handleSortChange}
          >
            <Option value="name_asc">Name (A-Z)</Option>
            <Option value="name_desc">Name (Z-A)</Option>
            <Option value="leng_des">Length (Descending)</Option>
            <Option value="leng_asc">Length (Ascending)</Option>
          </Select>

          <label>Pond:</label>
          <Select
            defaultValue="All"
            style={{ width: 120, marginTop: 10 }}
            onChange={handlePondChange}
          >
            <Option value="all">All</Option>
            <Option value="pond1">Pond 1</Option>
            <Option value="pond2">Pond 2</Option>
          </Select>

          <label>Sex:</label>
          <Select
            defaultValue="All"
            style={{ width: 120, marginTop: 10 }}
            onChange={handleSexChange}
          >
            <Option value="all">All</Option>
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="not_specified">Not specified</Option>
          </Select>

          <label>State of life:</label>
          <Select
            defaultValue="Alive"
            style={{ width: 120, marginTop: 10 }}
            onChange={handleStateChange}
          >
            <Option value="alive">Alive</Option>
            <Option value="all">All</Option>
            <Option value="dead">Dead</Option>
          </Select>
        </div>
      )}

      {/*Modal*/}
      <Modal
        title="Add new koi"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Image">
                <Upload listType="picture-card">
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
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
                <Select>
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
