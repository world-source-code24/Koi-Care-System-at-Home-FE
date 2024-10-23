import Header from "../../components/header/header";
import "./mykoi.scss";
import koiwall from "../../img/koi2.jpg";
import {
  DownCircleOutlined,
  FilterOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  DatePicker,
  Divider,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Upload,
} from "antd";
import { useForm } from "antd/es/form/Form";

function MyKoi() {
  const { Option } = Select;
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái modal
  const [isClicked, setIsClicked] = useState(false);
  const [sortValue, setSortValue] = useState("In pond since (newest first)");
  const [pondValue, setPondValue] = useState("All");
  const [sexValue, setSexValue] = useState("All");
  const [stateValue, setStateValue] = useState("All");
  const [koiList, setKoiList] = useState([]);
  const [form] = useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  // Khi trang load, kiểm tra và lấy dữ liệu từ localStorage
  useEffect(() => {
    const storedKoiList = localStorage.getItem("koiList");
    if (storedKoiList) {
      setKoiList(JSON.parse(storedKoiList));
    }
  }, []);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  // Hàm cho Down Icon
  const scrollToContent = () => {
    const contentSection = document.getElementById("content-section");
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: "smooth" });
    }
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
  };

  // Các hàm cho Sort
  const handleSortChange = (value) => {
    setSortValue(value);
  };

  const handlePondChange = (value) => {
    setPondValue(value);
  };

  const handleSexChange = (value) => {
    setSexValue(value);
  };

  const handleStateChange = (value) => {
    setStateValue(value);
  };

  // Modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Hàm lưu dữ liệu vào localStorage sau khi submit form
  const handleOk = () => {
    form.validateFields().then((values) => {
      const newKoi = {
        ...values,
        image: fileList.length ? fileList[0].thumbUrl : null,
      };

      const updatedKoiList = [...koiList, newKoi];
      setKoiList(updatedKoiList);
      localStorage.setItem("koiList", JSON.stringify(updatedKoiList)); // Lưu vào localStorage

      form.resetFields();
      setFileList([]);
      setIsModalVisible(false);
    });
  };

  const handleCancel = () => {
    form.resetFields(); // Reset các trường trong form
    setFileList([]); // Reset fileList nếu cần
    setIsModalVisible(false); // Đóng modal
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const handleFinish = (values) => {
    console.log("Form values: ", values);
    console.log("Weight: ", values.weight); // Log ra giá trị weight
    setIsModalVisible(false); // Đóng modal sau khi hoàn thành
  };

  const koiCount = 0; // Bạn có thể cập nhật giá trị này dựa trên số lượng cá Koi hiện có
  return (
    <>
      <Header />
      {/*Phần Head */}
      <div className="my_wall">
        <img src={koiwall} alt="Royal Koi" />
        <div className="overlay">
          <h1>Royal Koi</h1>
          <p>Let us help you care for your koi fish.</p>
          <DownCircleOutlined
            className={`down-icon ${isClicked ? "clicked" : ""}`}
            onClick={scrollToContent}
          />
        </div>
      </div>

      <div className="my_title">
        <h1>My Koi </h1>
      </div>

      <div className="my_divider">
        <Divider />
      </div>

      <div className="my_sort_container">
        <div className="my_sidebar">
          <div className="my_icon_filter">
            <FilterOutlined className="filter_icon" />
          </div>
          <Divider />

          {/* Dropdown for Sort */}
          <div className="sort_dropdown">
            <label>Sort by: </label>
            <Select value={sortValue} onChange={handleSortChange}>
              <Option value="In pond since (newest first)">
                In pond since (newest first)
              </Option>
              <Option value="In pond since (oldest first)">
                In pond since (oldest first)
              </Option>
              <Option value="Name (A-Z)">Name (A-Z)</Option>
              <Option value="Name (Z-A)">Name (Z-A)</Option>
              <Option value="Length (descending)">Length (descending)</Option>
              <Option value="Length (ascending)">Length (ascending)</Option>
              <Option value="Age (descending)">Age (descending)</Option>
              <Option value="Age (ascending)">Age (ascending)</Option>
            </Select>
          </div>

          <Divider />

          {/*Pond: */}
          <div className="sort_dropdown">
            <label>Pond: </label>
            <Select value={pondValue} onChange={handlePondChange}>
              <Option>All</Option>
            </Select>
          </div>

          <Divider />

          {/*Sex: */}
          <div className="sort_dropdown">
            <label>Sex: </label>
            <Select value={sexValue} onChange={handleSexChange}>
              <Option>All</Option>
              <Option>Male</Option>
              <Option>Female</Option>
              <Option>Not specified</Option>
            </Select>
          </div>

          <Divider />

          {/*State of life: */}
          <div className="sort_dropdown">
            <label>State of life: </label>
            <Select value={stateValue} onChange={handleStateChange}>
              <Option>All</Option>
              <Option>Alive</Option>
              <Option>Dead</Option>
            </Select>
          </div>
        </div>

        {/*Content*/}
        <div className="my_content">
          {/* Kiểm tra và ẩn h1 và p trong my_content nếu koiList không trống */}
          <div className="koi_noti">
            {koiList.length === 0 && (
              <>
                <h1>No Koi Fish Added Yet</h1>
                <p>Add your first Koi fish to start.</p>
              </>
            )}
          </div>

          {/* Container chung cho các modal nhỏ và nút plus */}
          <div className="koi-content-container container">
            <div className="row koi-list">
              {koiList.map((koi, index) => (
                <div className="col-md-3 koi-card" key={index}>
                  {koi.image && (
                    <Image
                      src={koi.image}
                      alt={koi.name}
                      className="img-fluid"
                    />
                  )}
                  <div className="info_container">
                    <h3>Name: {koi.name}</h3>
                    <p>Age: {koi.age}</p>
                    <p>Variety: {koi.variety}</p>
                    <p>Length: {koi.length} cm</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Symbol and Koi */}
          <div className="add-koi-container">
            <PlusCircleOutlined className="plus-icon" onClick={showModal} />
            <span className="koi-count">Koi: {koiCount}</span>
          </div>

          {/*Modal add*/}
          <Modal
            title="Add new Koi"
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1000}
          >
            <Form layout="vertical" form={form} onFinish={handleFinish}>
              <div className="form-columns">
                <div className="form-column">
                  <Form.Item label="koi_ava" name="image" required>
                    <Upload
                      action="API/koi"
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={handlePreview}
                      onChange={handleChange}
                      maxCount={1}
                    >
                      Click here to upload
                      {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                  </Form.Item>

                  <Form.Item label="Physique: " name="physique" required>
                    <Select>
                      <Option>Slim</Option>
                      <Option>Normal</Option>
                      <Option>Corpulent</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label="Length: " name="length" required>
                    <Input
                      placeholder="Enter length of your Koi fish "
                      type="number"
                    />
                  </Form.Item>

                  <Form.Item label="Sex:" name="sex" required>
                    <Select>
                      <Option>Not specified</Option>
                      <Option>Male</Option>
                      <Option>Female</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label="Pond: " name="pond" required>
                    <Input placeholder="Enter pond" />
                  </Form.Item>

                  <Form.Item label="Breeder: " name="breeder" required>
                    <Input placeholder="Enter Breeder" />
                  </Form.Item>
                </div>

                <div className="form-column">
                  <Form.Item label="Koi fish name:" name="name" required>
                    <Input placeholder="Enter name of your Koi fish" />
                  </Form.Item>

                  <Form.Item label="Age: " name="image" required>
                    <Select>
                      <Option>Not specified</Option>
                      <Option>0 year</Option>
                      <Option>1 year</Option>
                      {/* Add more years here as needed */}
                    </Select>
                  </Form.Item>

                  <Form.Item label="Weight:" name="weight" required>
                    <Input
                      placeholder="Enter weight of your Koi fish"
                      type="number"
                    />
                  </Form.Item>

                  <Form.Item label="Variety: " name="variety">
                    <Input placeholder="Enter Notes" />
                  </Form.Item>

                  <Form.Item
                    label="In pond since: "
                    name="inPondSince"
                    required
                  >
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder="Select Date and Time"
                    />
                  </Form.Item>

                  <Form.Item label="Purchase price: ">
                    <Input placeholder="Enter Price" />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </Modal>
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
    </>
  );
}

export default MyKoi;
