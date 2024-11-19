import "./mykoi.scss";
import dayjs from "dayjs"; // Import dayjs at the top
import Header from "../../components/header/header";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Select,
  Tooltip,
  Upload,
} from "antd";
import {
  FilterOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer/footer";
import { handleImageUpload } from "../../config/upload";
const { Option } = Select;

function Mykoi() {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ponds, setPonds] = useState([]);
  const [koiData, setKoiData] = useState([]);
  const [selectedPond, setSelectedPond] = useState(null);
  const [image, setImage] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filteredKoiData, setFilteredKoiData] = useState([]);
  const [sortOption, setSortOption] = useState("newest");
  const [filterPond, setFilterPond] = useState("All");
  const [filterSex, setFilterSex] = useState("All");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedKoi, setSelectedKoi] = useState(null);
  const navigate = useNavigate();

  const fetchKoiData = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const accId = localStorage.getItem("userId");

    if (!user || !accId) {
      alert("Vui lòng đăng nhập trước khi truy cập trang này.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        `https://koicaresystemapi.azurewebsites.net/api/user/${accId}/Koi?accId=${accId}`
      );

      const koiList = response.data.$values.map((koi) => ({
        koiId: koi.koiId,
        name: koi.name,
        // Tính toán tuổi từ ngày sinh (koi.age là datetime)
        age: koi.age
          ? Math.floor(
              (new Date() - new Date(koi.age)) / (365.25 * 24 * 60 * 60 * 1000) // Số ngày trong một năm
            )
          : "-", // Trường hợp không có giá trị age
        breed: koi.breed,
        image: koi.image,
        length: koi.length,
        weight: koi.weight,
        pondId: koi.pondId,
        physique: koi.physique || "normal",
        sex: koi.sex ? "male" : "female",
      }));
      setKoiData(koiList);
      setFilteredKoiData(koiList);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách cá Koi:", error);
    }
  };

  const fetchPonds = async () => {
    try {
      const accId = localStorage.getItem("userId");
      const response = await axios.get(
        `https://koicaresystemapi.azurewebsites.net/api/Show-All-Ponds-UserID/${accId}`
      );
      const pondList = response.data.listPond["$values"];
      setPonds(pondList);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách hồ", error);
    }
  };

  useEffect(() => {
    fetchKoiData();
    fetchPonds();
  }, [navigate]);

  const handleEditClick = (koi) => {
    setSelectedKoi(koi);
  
    // Chuyển đổi age thành đối tượng dayjs (nếu age tồn tại)
    const ageAsDate = koi.age ? dayjs(koi.age) : null;
  
    form.setFieldsValue({
      name: koi.name,
      pond: koi.pondId,
      physique: koi.physique,
      age: ageAsDate, // Gán age dưới dạng đối tượng dayjs
      length: koi.length,
      weight: koi.weight,
      sex: koi.sex,
      breed: koi.breed,
    });
  
    setIsEditModalVisible(true);
  };
  

  const applyFilters = () => {
    let filteredData = [...koiData];

    // Filter by pond
    if (filterPond !== "All") {
      filteredData = filteredData.filter((koi) => koi.pondId === filterPond);
    }

    // Filter by sex
    if (filterSex !== "All") {
      filteredData = filteredData.filter((koi) => koi.sex === filterSex);
    }

    // Sort data
    switch (sortOption) {
      case "newest":
        filteredData.sort((a, b) => b.koiId - a.koiId);
        break;
      case "oldest":
        filteredData.sort((a, b) => a.koiId - b.koiId);
        break;
      case "name-asc":
        filteredData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filteredData.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "length-desc":
        filteredData.sort((a, b) => b.length - a.length);
        break;
      case "length-asc":
        filteredData.sort((a, b) => a.length - b.length);
        break;
      case "age-desc":
        filteredData.sort((a, b) => b.age - a.age);
        break;
      case "age-asc":
        filteredData.sort((a, b) => a.age - b.age);
        break;
      default:
        break;
    }

    setFilteredKoiData(filteredData);
    setIsFilterModalVisible(false);
  };

  const showFilterModal = () => {
    setIsFilterModalVisible(true);
  };

  const handleFilterCancel = () => {
    setIsFilterModalVisible(false);
  };

  const checkDuplicateName = (name) => {
    return koiData.some((koi) => koi.name.toLowerCase() === name.toLowerCase());
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (!selectedPond) {
        notification.error({
          message: "Error",
          description: "Please select a pond before adding Koi.",
        });
        return;
      }

      let downloadURL = image;
      if (!image || typeof image !== "string") {
        notification.error({
          message: "Error",
          description: "Please upload an image before submitting.",
        });
        return;
      }

      const newKoi = {
        koiId: 0,
        name: values.name,
        image: downloadURL,
        physique: values.physique || "normal",
        age: values.age ? values.age.toISOString() : null,
        length: values.length || 0,
        weight: values.weight || 0,
        sex: values.sex === "male",
        breed: values.breed || "string",
        pondId: selectedPond,
      };

      const response = await fetch(
        `https://koicaresystemapi.azurewebsites.net/api/pond/${selectedPond}/Koi`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newKoi),
        }
      );

      if (response.ok) {
        fetchKoiData();
        form.resetFields();
        setIsModalVisible(false);
        setImage(null);
        notification.success({
          message: "Success",
          description: "The Koi fish has been added successfully!",
        });
      } else {
        const errorData = await response.json();
        notification.error({
          message: "Error",
          description: errorData.message || "Failed to add the Koi fish.",
        });
      }
    } catch (error) {
      console.error("Error adding Koi:", error);
      notification.error({
        message: "Error",
        description: "Failed to add the Koi fish. Please try again.",
      });
    }
  };

  const handlePondChange = (value) => {
    setSelectedPond(value);
    console.log(value);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setImage(null);
    setFileList([]);
  };

  const handleNavigateToKoiDetail = (koi) => {
    if (koi.koiId) {
      navigate(`/koidetail/${koi.koiId}`, {
        state: {
          pondId: koi.pondId,
          image: koi.image,
          age: koi.age, // Truyền ngày sinh của cá Koi
        },
      });
    } else {
      console.error("Pond ID is undefined for this koi.");
    }
  };
  

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Sử dụng URL từ ảnh đã upload hoặc giữ lại ảnh gốc
      let downloadURL = image || selectedKoi.image;

      // Nếu ảnh mới được chọn (image là File), tải ảnh lên
      if (fileList.length > 0) {
        const file = fileList[0].originFileObj || fileList[0];
        try {
          downloadURL = await handleImageUpload(file); // Hàm tải ảnh lên
        } catch (error) {
          notification.error({
            message: "Error Uploading Image",
            description:
              "There was an issue uploading the image. Please try again.",
          });
          return;
        }
      }

      const updatedKoi = {
        ...selectedKoi,
        name: values.name,
        pondId: values.pond,
        physique: values.physique,
        age: values.age ? values.age.toISOString() : null, // Chuyển đổi dayjs thành ISO string
        length: values.length,
        weight: values.weight,
        sex: values.sex === "male",
        breed: values.breed,
        image: downloadURL, // Cập nhật ảnh
      };

      const response = await axios.put(
        `https://koicaresystemapi.azurewebsites.net/api/edit/pond/${updatedKoi.pondId}/Koi/${updatedKoi.koiId}`,
        updatedKoi,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        fetchKoiData(); // Tải lại danh sách cá Koi
        setFileList([]); // Reset fileList
        setImage(null); // Reset image
        setIsEditModalVisible(false);
        notification.success({
          message: "Success",
          description: "The Koi fish has been updated successfully!",
        });
      } else {
        throw new Error("Failed to update the Koi fish");
      }
    } catch (error) {
      console.error("Error updating Koi:", error);
      notification.error({
        message: "Error",
        description: "Failed to update the Koi fish. Please try again.",
      });
    }
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
            onClick={showFilterModal}
            style={{ marginLeft: 10 }}
          />
        </Tooltip>
      </div>

      <div className="koi_list">
        {filteredKoiData.length === 0 ? (
          <div className="empty_message">
            <p>
              Oops :(( You don't add any koi yet. Press "Add new koi" button to
              add the new one !!!
            </p>
          </div>
        ) : (
          filteredKoiData.map((koi, index) => (
            <div
              key={koi.koiId}
              className="koi_item"
              onClick={() => handleNavigateToKoiDetail(koi)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={koi.image || "https://via.placeholder.com/200"} // Hiển thị ảnh mặc định nếu thiếu
                alt={koi.name || "Koi Fish"}
                style={{ width: 200, height: 100, objectFit: "cover" }}
              />
              <div className="koi_info">
                <p>
                  <strong>Name:</strong> {koi.name}
                </p>
                <p>
                  <strong>Age:</strong>{" "}
                  {koi.age !== "-" ? `${koi.age} years` : "Unknown"}
                </p>
                <p>
                  <strong>Variety:</strong> {koi.breed || "-"}
                </p>
                <p>
                  <strong>Length:</strong> {koi.length} cm
                </p>
                <Button
                  className="button_ed"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(koi);
                  }}
                >
                  Edit
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Edit */}
      <Modal
        title="Edit Koi Information"
        visible={isEditModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setIsEditModalVisible(false)}
        className="mykoi_modal"
      >
        <Divider />

        <Form form={form} layout="vertical">
          <div className="add_image">
            {/* <img src={ca} style={{ width: 200, height: 100 }} /> */}
          </div>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Upload Image">
                <Upload
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={() => false} // Không upload trực tiếp
                  onChange={async ({ file }) => {
                    const fileObj = file.originFileObj || file; // Lấy file gốc
                    try {
                      const downloadURL = await handleImageUpload(fileObj); // Upload ảnh và lấy URL
                      setImage(downloadURL); // Lưu URL vào state
                      notification.success({
                        message: "Image Uploaded",
                        description:
                          "The image has been uploaded successfully!",
                      });
                    } catch (error) {
                      console.error("Error uploading image:", error);
                      notification.error({
                        message: "Error Uploading Image",
                        description:
                          "There was an issue uploading the image. Please try again.",
                      });
                    }
                  }}
                >
                  {image ? (
                    <img src={image} alt="Koi Fish" style={{ width: "100%" }} />
                  ) : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              <Form.Item
                label="Name:"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please enter your Koi fish name!",
                  },
                  // ({ getFieldValue }) => ({
                  //   validator(_, value) {
                  //     if (!value || !checkDuplicateName(value)) {
                  //       return Promise.resolve();
                  //     }
                  //     return Promise.reject(
                  //       new Error(
                  //         "The name of the fish already exists, please change the name !"
                  //       )
                  //     );
                  //   },
                  // }),
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Pond:"
                name="pond"
                rules={[
                  { required: true, message: "Please choose your pond !" },
                ]}
              >
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

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    Physique:{" "}
                    <Tooltip title="Suggested options: slim, normal, corpulent">
                      <InfoCircleOutlined style={{ color: "black" }} />
                    </Tooltip>
                  </span>
                }
                name="physique"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Date of Birth:"
                name="age"
                rules={[
                  {
                    required: true,
                    message:
                      "Please select the date of birth for the Koi fish!",
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    Length (cm):{" "}
                    <Tooltip title="Length must be a positive number !">
                      <InfoCircleOutlined style={{ color: "black" }} />
                    </Tooltip>
                  </span>
                }
                name="length"
                rules={[
                  { required: true, message: "Please enter the length !" },
                  {
                    type: "number",
                    min: 0.01,
                    transform: (value) => Number(value),
                  },
                ]}
              >
                <Input type="number" min={0.01} step={0.01} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    Weight (g):{" "}
                    <Tooltip title="Weight must be a positive number !">
                      <InfoCircleOutlined style={{ color: "black" }} />
                    </Tooltip>
                  </span>
                }
                name="weight"
                rules={[
                  { required: true, message: "Please enter the weight !" },
                  {
                    type: "number",
                    min: 0.01,
                    transform: (value) => Number(value),
                  },
                ]}
              >
                <Input type="number" min={0.01} step={0.01} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Sex:"
                name="sex"
                rules={[
                  {
                    required: true,
                    message: "Please select the sex of the Koi fish!",
                  },
                ]}
              >
                <Select>
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="not_specified">Not specified</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Breed:" name="breed">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Filter Modal */}
      <Modal
        title="Filter Options"
        visible={isFilterModalVisible}
        onCancel={handleFilterCancel}
        onOk={applyFilters}
        className="mykoi_filter_modal"
      >
        {/* Sort Option */}
        <div>
          <label
            style={{
              fontSize: "19px",
              fontWeight: "bold",
              fontFamily: "'Gowun Batang",
              color: "#333",
            }}
          >
            Sort by:
          </label>
          <Select
            value={sortOption}
            onChange={setSortOption}
            style={{ width: "100%" }}
          >
            <Option value="newest">In pond since (newest first)</Option>
            <Option value="oldest">In pond since (oldest first)</Option>
            <Option value="name-asc">Name (A-Z)</Option>
            <Option value="name-desc">Name (Z-A)</Option>
            <Option value="length-desc">Length (descending)</Option>
            <Option value="length-asc">Length (ascending)</Option>
            <Option value="age-desc">Age (descending)</Option>
            <Option value="age-asc">Age (ascending)</Option>
          </Select>
        </div>

        {/* Pond Filter */}
        <div style={{ marginTop: "16px" }}>
          <label
            style={{
              fontSize: "19px",
              fontWeight: "bold",
              fontFamily: "'Gowun Batang'",
              color: "#333",
            }}
          >
            Pond:
          </label>
          <Select
            value={filterPond}
            onChange={setFilterPond}
            style={{ width: "100%" }}
          >
            <Option value="All">All</Option>
            {ponds.map((pond) => (
              <Option key={pond.pondId} value={pond.pondId}>
                {pond.name}
              </Option>
            ))}
          </Select>
        </div>

        {/* Sex Filter */}
        <div style={{ marginTop: "16px" }}>
          <label
            style={{
              fontSize: "19px",
              fontWeight: "bold",
              fontFamily: "'Gowun Batang'",
              color: "#333",
            }}
          >
            Sex:
          </label>
          <Select
            value={filterSex}
            onChange={setFilterSex}
            style={{ width: "100%" }}
          >
            <Option value="All">All</Option>
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
          </Select>
        </div>
      </Modal>

      {/* Modal add */}
      <Modal
        title="Add new koi"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        className="mykoi_modal"
      >
        <Divider />

        <Form form={form} layout="vertical">
          <div className="add_image">
            {/* <img src={ca} style={{ width: 200, height: 100 }} /> */}
          </div>
          <Form.Item label="Upload Image">
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={() => false} // Không upload trực tiếp
              onChange={async ({ file }) => {
                const fileObj = file.originFileObj || file; // Lấy `originFileObj` nếu có
                try {
                  const downloadURL = await handleImageUpload(fileObj); // Upload ảnh và lấy URL
                  setImage(downloadURL); // Lưu URL đã upload vào state
                  notification.success({
                    message: "Image Uploaded",
                    description: "The image has been uploaded successfully!",
                  });
                } catch (error) {
                  console.error("Error uploading image:", error);
                  notification.error({
                    message: "Error Uploading Image",
                    description:
                      "There was an issue uploading the image. Please try again.",
                  });
                }
              }}
            >
              {image ? (
                <img src={image} alt="Koi" style={{ width: "100%" }} />
              ) : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Name:"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please enter your Koi fish name!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || !checkDuplicateName(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "The name of the fish already exists, please change the name !"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Pond:"
                name="pond"
                rules={[
                  { required: true, message: "Please choose your pond !" },
                ]}
              >
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

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    Physique:{" "}
                    <Tooltip title="Suggested options: slim, normal, corpulent">
                      <InfoCircleOutlined style={{ color: "black" }} />
                    </Tooltip>
                  </span>
                }
                name="physique"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Date of Birth:"
                name="age"
                rules={[
                  {
                    required: true,
                    message:
                      "Please select the date of birth for the Koi fish!",
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    Length (cm):{" "}
                    <Tooltip title="Length must be a positive number !">
                      <InfoCircleOutlined style={{ color: "black" }} />
                    </Tooltip>
                  </span>
                }
                name="length"
                rules={[
                  { required: true, message: "Please enter the length !" },
                  {
                    type: "number",
                    min: 0.01,
                    transform: (value) => Number(value),
                  },
                ]}
              >
                <Input type="number" min={0.01} step={0.01} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    Weight (g):{" "}
                    <Tooltip title="Weight must be a positive number !">
                      <InfoCircleOutlined style={{ color: "black" }} />
                    </Tooltip>
                  </span>
                }
                name="weight"
                rules={[
                  { required: true, message: "Please enter the weight !" },
                  {
                    type: "number",
                    min: 0.01,
                    transform: (value) => Number(value),
                  },
                ]}
              >
                <Input type="number" min={0.01} step={0.01} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Sex:"
                name="sex"
                rules={[
                  {
                    required: true,
                    message: "Please select the sex of the Koi fish!",
                  },
                ]}
              >
                <Select>
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="not_specified">Not specified</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Breed:" name="breed">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <br />
      <Footer />
    </>
  );
}

export default Mykoi;
