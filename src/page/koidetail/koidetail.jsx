import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./koidetail.scss";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import {
  Divider,
  Form,
  Input,
  Button,
  Modal,
  Select,
  Table,
} from "antd";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function KoiDetail() {
  const { koiId } = useParams();
  const location = useLocation();
  const pondId = location.state?.pondId;
  const [selectedPond, setSelectedPond] = useState(null);
  const [koiDetails, setKoiDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [ponds, setPonds] = useState([]);
  const [isDelete, setIsDelete] = useState(false);
  const { Option } = Select;
  const [originalChartData, setOriginalChartData] = useState([]);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const convertToCurrentTime = (gmtDateString) => {
    const gmtDate = new Date(gmtDateString); // Chuyển chuỗi GMT thành đối tượng Date
    const gmt7Date = new Date(gmtDate.getTime() + 7 * 60 * 60 * 1000); // Chuyển sang GMT+7
  
    // Đặt giờ hiện tại
    const currentDate = new Date();
    gmt7Date.setHours(currentDate.getHours());
    gmt7Date.setMinutes(currentDate.getMinutes());
  
    return gmt7Date.toLocaleString(); // Trả về chuỗi thời gian với giờ hiện tại
  };
  
  
  // Cập nhật chartData mỗi khi originalChartData thay đổi
  useEffect(() => {
    setChartData({
      labels: originalChartData.map((data) => data.date), // Sử dụng dữ liệu đã chỉnh sửa giờ
      datasets: [
        {
          label: "Length (cm)",
          data: originalChartData.map((data) => data.length),
          borderColor: "orange",
          yAxisID: "y1",
        },
        {
          label: "Weight (g)",
          data: originalChartData.map((data) => data.weight),
          borderColor: "blue",
          yAxisID: "y2",
        },
      ],
    });
  }, [originalChartData]);
  

  const handleReport = () => {
    setIsReportVisible(true);
  };

  const closeReport = () => {
    setIsReportVisible(false);
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return "Unknown"; // Kiểm tra nếu không có giá trị
    const now = new Date();
    const birth = new Date(birthDate);
    const ageInYears = Math.floor(
      (now - birth) / (365.25 * 24 * 60 * 60 * 1000)
    );
    return ageInYears;
  };

  useEffect(() => {
    if (location.state?.age) {
      const ageInYears = calculateAge(location.state.age);
      form.setFieldsValue({
        ...form.getFieldsValue(),
        age: ageInYears, // Đặt giá trị tuổi
      });
    }
  }, [location.state, form]);

  // Tính Health Status
  const dataWithHealthStatus = originalChartData.map((data, index, arr) => {
    if (index === 0) {
      return { ...data, healthStatus: "Good" };
    }

    const prevData = arr[index - 1];
    const weightChange =
      ((data.weight - prevData.weight) / prevData.weight) * 100;

    let healthStatus = "Good"; // Mặc định là "Good"
    if (weightChange > 15 || weightChange < -15) {
      healthStatus = "Warning";
    }

    return { ...data, healthStatus };
  });

  const reportColumns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Length (cm)",
      dataIndex: "length",
      key: "length",
    },
    {
      title: "Weight (g)",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "Health Status",
      dataIndex: "healthStatus",
      key: "healthStatus",
      render: (text) => (
        <span style={{ color: text === "Warning" ? "red" : "green" }}>
          {text}
        </span>
      ),
    },
  ];

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

  const handlePondChange = (value) => {
    setSelectedPond(value);
    console.log(value);
  };

  const fetchKoiDetails = async () => {
    if (!koiId) {
      console.error("Koi ID is invalid.");
      return;
    }
  
    try {
      const response = await axios.get(
        `https://koicaresystemapi.azurewebsites.net/api/Koi/${koiId}`
      );
      const koi = response.data;
      setKoiDetails(koi); // Lưu dữ liệu đầy đủ vào koiDetails
      form.setFieldsValue({
        ...koi,
        age: calculateAge(koi.age), // Hiển thị tuổi từ dữ liệu
        pond: koi.pondId,
      });
      setImage(koi.image);
    } catch (error) {
      console.error("Error fetching Koi details:", error);
    }
  };
  

  useEffect(() => {
    console.log("Location state:", location.state); // Kiểm tra dữ liệu
  }, [location.state]);

  const fetchChartData = async () => {
    try {
      const response = await axios.get(
        `https://koicaresystemapi.azurewebsites.net/api/KoiChart/${koiId}`
      );
      const data = response.data["$values"].map((item) => ({
        ...item,
        date: convertToCurrentTime(item.date), // Chuyển đổi ngày sang giờ hiện tại
      }));
      setOriginalChartData(data);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };  

  useEffect(() => {
    if (user.role.toLocaleLowerCase() === "member") {
      setIsMember(true);
    } else {
      setIsMember(false);
    }

    fetchPonds();
    fetchKoiDetails();
    fetchChartData();

    if (location.state?.age) {
      const ageInYears = calculateAge(location.state.age);
      form.setFieldsValue({
        ...form.getFieldsValue(),
        age: ageInYears, // Hiển thị tuổi đã tính toán
      });
    }

    if (pondId) {
      setSelectedPond(pondId);
    }
    if (pondId) {
      setSelectedPond(pondId); // Set selectedPond only once
    }

    // Lấy image từ location.state nếu có
    if (location.state?.image) {
      setImage(location.state.image);
    }
  }, [koiId, form, navigate, pondId, location.state]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
  
      // Lấy dữ liệu hiện tại từ koiDetails và chỉ cập nhật length, weight
      const updatedData = {
        ...koiDetails, // Giữ nguyên các trường hiện có
        length: Number(values.length), // Cập nhật length
        weight: Number(values.weight), // Cập nhật weight
      };
  
      console.log("Payload being sent:", updatedData);
  
      const response = await axios.put(
        `https://koicaresystemapi.azurewebsites.net/api/pond/${selectedPond}/Koi/${koiId}`,
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
  
        // Cập nhật originalChartData ngay lập tức
        const newChartData = [
          ...originalChartData,
          {
            date: new Date().toLocaleString(), // Thời gian hiện tại
            length: Number(values.length),
            weight: Number(values.weight),
          },
        ];
        setOriginalChartData(newChartData); // Cập nhật state của chart
      }
    } catch (error) {
      if (error.response) {
        console.error("Lỗi khi lưu dữ liệu:", error.response.data);
      } else {
        console.error("Lỗi khác:", error.message);
      }
    }
  };  

  const onDelete = async () => {
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
  };

  // const chartData = {
  //   labels: originalChartData.map((data) => data.date),
  //   datasets: [
  //     {
  //       label: "Length (cm)",
  //       data: originalChartData.map((data) => data.length),
  //       borderColor: "orange",
  //       yAxisID: "y1",
  //     },
  //     {
  //       label: "Weight (g)",
  //       data: originalChartData.map((data) => data.weight),
  //       borderColor: "blue",
  //       yAxisID: "y2",
  //     },
  //   ],
  // };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
          font: {
            size: 16,
          },
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
      y1: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "Length (cm)",
          font: {
            size: 16,
          },
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
      y2: {
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "Weight (g)",
          font: {
            size: 16,
          },
        },
        ticks: {
          font: {
            size: 14,
          },
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 16,
          },
        },
      },
      tooltip: {
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 12,
        },
      },
    },
  };

  return (
    <>
      {/* Modal cho báo cáo */}
      <Modal
        title="Koi Growth Report"
        visible={isReportVisible}
        onCancel={closeReport}
        footer={[
          <Button key="close" onClick={closeReport}>
            Close
          </Button>,
        ]}
      >
        <div style={{ marginBottom: "20px" }}>
          <p style={{ color: "green", fontWeight: "bold" }}>
            Good: Your fish are growing very well. Please continue to take care
            of your fish at all times!
          </p>
          <p style={{ color: "red", fontWeight: "bold" }}>
            Warning: Your Koi fish's weight is increasing or decreasing by more
            than 15%. Review your fish feeding process or check your pond's
            water quality!
          </p>
          <p>
            <strong>Suggestion:</strong>
            <ul>
              <li>
                You can use the Food Calculator or Salt Calculator function to
                calculate the amount of food or salt for your pond.
              </li>
              <li>
                Visit the product store at Home page to buy accessories to care
                for your fish!
              </li>
            </ul>
          </p>
        </div>

        <Table
          dataSource={dataWithHealthStatus}
          columns={reportColumns}
          rowKey="chartId"
          pagination={false}
        />
      </Modal>

      <Modal
        title="Accept Delete"
        visible={isDelete}
        onCancel={() => setIsDelete(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsDelete(false)}
            className="modal-cancel-button"
          >
            Cancel
          </Button>,
          <Button
            key="ok"
            type="primary"
            onClick={onDelete}
            className="modal-delete-button"
          >
            Delete
          </Button>,
        ]}
        className="custom-modal"
      >
        <p className="modal-content-text">You want to delete this Koi fish ?</p>
      </Modal>

      <Header />
      <div className="koide_background"></div>
      <div className="koide_header">
        <button className="koide_button" onClick={() => navigate("/mykoi")}>
          <span className="koide_back">←Back</span>
        </button>
        <div className="koide_title">Koi Details</div>
      </div>
      <div className="koide_divider">
        <Divider />
      </div>

      <div className="koide_form_wrapper">
        <div className="koide_left">
          <div className="koide_image">
            {image ? (
              <img
                src={image}
                alt="Koi Fish"
                style={{
                  width: "100%",
                  height: "300px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            ) : (
              <img
                src="https://via.placeholder.com/200"
                alt="No Image"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            )}
          </div>

          <Form form={form} layout="vertical">
            <Form.Item label="Name:" name="name">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Age:" name="age">
              <Input disabled placeholder="No age available" />
            </Form.Item>

            <Form.Item label="Length (cm): " name="length">
              <Input type="number" disabled={!isEditing} />
            </Form.Item>

            <Form.Item label="Physique: " name="physique">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Weight (g): " name="weight">
              <Input type="number" disabled={!isEditing} />
            </Form.Item>
            <Form.Item label="Pond: " name="pond">
              <Select onChange={handlePondChange} disabled>
                {ponds.map((pond) => (
                  <Option key={pond.pondId} value={pond.pondId}>
                    {pond.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <div className="koide_button_1">
              {isEditing ? (
                <>
                  <Button type="primary" onClick={handleSave}>
                    Save
                  </Button>
                  <Button type="primary" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button type="primary" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                  <Button type="primary" onClick={() => setIsDelete(true)}>
                    Delete
                  </Button>
                </>
              )}
            </div>
          </Form>
        </div>

        {isMember ? (
          <div className="koide_right">
            <Line data={chartData} options={chartOptions} />
            <div className="report-button-container">
              <Button
                type="primary"
                className="report-button"
                onClick={handleReport}
              >
                Report
              </Button>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <Footer />
    </>
  );
}

export default KoiDetail;
