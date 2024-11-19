import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import "bootstrap-icons/font/bootstrap-icons.css";
import bg from "../../img/a10.jpg";
import "./viewpond.scss";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Pagination } from "antd";
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  Select,
  notification,
  Table,
  Modal,
} from "antd";
import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Label,
  Legend,
} from "recharts";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
const { Option } = Select;

function Viewpond() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [waterParamsForm] = Form.useForm();
  const [chartData, setChartData] = useState([]);
  const [pondData, setPondData] = useState([]);
  const [selectedParameter, setSelectedParameter] = useState("temperature");
  const [isMember, setIsMember] = useState(false);
  const [outOfStandard, setOutOfStandard] = useState({});
  const location = useLocation();
  const pondName = location.state?.name || "Unknown Pond";
  const pondImage = location.state?.image ? `${location.state.image}` : bg;
  const [parameterHistory, setParameterHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const [koiList, setKoiList] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [selectedKoi, setSelectedKoi] = useState(null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const calculateAge = (birthDate) => {
    if (!birthDate) return "Unknown"; // Kiểm tra nếu không có giá trị
    const now = new Date();
    const birth = new Date(birthDate);
    const ageInYears = Math.floor(
      (now - birth) / (365.25 * 24 * 60 * 60 * 1000)
    );
    return ageInYears;
  };

  // render lấy thông số hồ từ api
  useEffect(() => {
    const fetchPondData = async () => {
      try {
        const response = await axios.get(
          `https://koicaresystemapi.azurewebsites.net/api/WaterParameter/get-all${id}`
        );
        if (response.status === 200) {
          const data = response.data.parameter.$values;
          setPondData(data);
        }
      } catch (error) {
        console.error("Error fetching pond data:", error);
      }
    };

    fetchPondData();
  }, [id]);

  //render thông số hồ
  useEffect(() => {
    const fetchParameterHistory = async () => {
      try {
        const response = await axios.get(
          `https://koicaresystemapi.azurewebsites.net/api/WaterParameter/get-all${id}`
        );
        if (response.status === 200) {
          const sortedData = response.data.parameter.$values.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          // Chuyển đổi thời gian sang GMT+7
          const adjustedData = sortedData.map((item) => ({
            ...item,
            date: convertToGMT7(item.date),
          }));

          setParameterHistory(adjustedData);
        }
      } catch (error) {
        console.error("Error fetching parameter history:", error);
      }
    };

    // Hàm chuyển đổi thời gian sang GMT+7
    const convertToGMT7 = (gmtDateString) => {
      const gmtDate = new Date(gmtDateString); // Chuyển chuỗi GMT thành đối tượng Date
      const gmt7Date = new Date(gmtDate.getTime() + 7 * 60 * 60 * 1000); // Cộng thêm 7 giờ
      return gmt7Date.toLocaleString(); // Trả về chuỗi thời gian theo múi giờ GMT+7
    };

    fetchParameterHistory();
  }, [id]);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageModalVisible(true);
  };

  // render cá Koi
  useEffect(() => {
    const fetchKoiList = async () => {
      try {
        const response = await axios.get(
          `https://koicaresystemapi.azurewebsites.net/api/pond/${id}/Koi`
        );

        // Tính tuổi và cập nhật danh sách cá Koi
        const koiListWithAge = response.data.$values.map((koi) => ({
          ...koi,
          age: calculateAge(koi.age), // Tính số tuổi từ ngày sinh
        }));

        setKoiList(koiListWithAge); // Lưu danh sách cá Koi vào state
      } catch (error) {
        console.error("Error fetching koi list:", error);
      }
    };

    fetchKoiList();
  }, [id]);

  const fetchKoiReport = async (koiId) => {
    try {
      const response = await axios.get(
        `https://koicaresystemapi.azurewebsites.net/api/KoiChart/${koiId}`
      );
      const chartData = response.data["$values"];
  
      // Chuyển đổi giờ chính xác theo GMT+7 và định dạng 12 giờ (AM/PM)
      const report = chartData.map((data) => {
        const gmtDate = new Date(data.date); // Dữ liệu gốc
        const gmt7Date = new Date(gmtDate.getTime() + 7 * 60 * 60 * 1000); // Cộng thêm 7 giờ
  
        return {
          date: gmt7Date.toLocaleString("en-US", {
            hour12: true, // Sử dụng định dạng 12 giờ
            timeZone: "Asia/Bangkok", // Đảm bảo múi giờ GMT+7
          }),
          length: data.length,
          weight: data.weight,
          healthStatus:
            Math.abs(data.weight - (chartData[0]?.weight || 0)) >
            0.15 * (chartData[0]?.weight || 1)
              ? "Warning"
              : "Good",
        };
      });
      setReportData(report);
    } catch (error) {
      console.error("Error fetching Koi report:", error);
    }
  };  

  const handleShowReport = async (koi) => {
    setSelectedKoi(koi);
    await fetchKoiReport(koi.koiId);
    setIsReportVisible(true);
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text) => (
        <img
          src={text}
          alt="Koi"
          style={{ width: "50px", borderRadius: "5px", cursor: "pointer" }}
          onClick={() => handleImageClick(text)}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      render: (text) => (text !== "Unknown" ? `${text} years` : text),
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
      title: "Report",
      key: "action",
      render: (_, record) => (
        <RemoveRedEyeIcon
          style={{ cursor: "pointer" }}
          type="primary"
          onClick={() => handleShowReport(record)}
        />
      ),
    },
  ];

  const closeReport = () => {
    setIsReportVisible(false);
    setReportData([]);
  };

  // Khởi tạo các giá trị ban đầu là null
  const [currentParameter, setCurrentParameter] = useState({
    temperature: null,
    salt: null,
    phLevel: null,
    o2Level: null,
    totalChlorines: null,
    po4Level: null,
    no2Level: null,
    no3Level: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  // gán thông số tiêu chuẩn cho các thông số
  const standardData = {
    temperature: { min: 5, max: 26 },
    salt: { min: 0, max: 0.1 },
    phLevel: { min: 6.9, max: 8 },
    o2Level: { min: 6.5, max: 18 },
    totalChlorines: { min: 0, max: 0.001 },
    po4Level: { min: 0, max: 0.035 },
    no2Level: { min: 0, max: 0.1 },
    no3Level: { min: 0, max: 20 },
  };

  // render lại kiểm tra tài khoản có phải member không
  useEffect(() => {
    if (user.role.toLocaleLowerCase() === "member") {
      setIsMember(true);
    } else {
      setIsMember(false);
    }
    console.log(isMember);
    const fetchParamData = async () => {
      try {
        const response = await axios.get(
          `https://koicaresystemapi.azurewebsites.net/api/WaterParameter/get-param${id}`
        );
        if (response.status === 200) {
          const data = response.data.parameter;
          waterParamsForm.setFieldsValue(data);
          setCurrentParameter({
            temperature: data.temperature || null,
            salt: data.salt || null,
            phLevel: data.phLevel || null,
            o2Level: data.o2Level || null,
            totalChlorines: data.totalChlorines || null,
            po4Level: data.po4Level || null,
            no2Level: data.no2Level || null,
            no3Level: data.no3Level || null,
          });
        }
      } catch (error) {
        console.error("Error fetching pond data:", error);
      }
    };
    fetchParamData();
  }, [id]);

  // Thiết lập giá trị mới nhất cho mực nước
  useEffect(() => {
    if (currentParameter) {
      waterParamsForm.setFieldsValue(currentParameter);
    }
  }, [currentParameter, waterParamsForm]);

  // Thiết lập các giá trị cho chart
  useEffect(() => {
    const fetchPondData = async () => {
      try {
        const response = await axios.get(
          `https://koicaresystemapi.azurewebsites.net/api/WaterParameter/get-all${id}`
        );
        if (response.status === 200) {
          const data = response.data.parameter.$values;
          setPondData(data);
          const chartDataFormatted = createChartData(data, selectedParameter);
          setChartData(chartDataFormatted);
        }
      } catch (error) {
        console.error("Error fetching pond data:", error);
      }
    };

    fetchPondData();
  }, [id, selectedParameter]);

  // Hàm tạo chart
  const createChartData = (updatedValues, selectedParam) => {
    if (!Array.isArray(updatedValues)) {
      console.error("Expected array, but got:", updatedValues);
      return [];
    }

    return updatedValues.map((data) => {
      const date = new Date(data.date);
      return {
        name: date.toDateString(),
        min: standardData[selectedParam].min,
        max: standardData[selectedParam].max,
        value: data[selectedParam] || 0,
      };
    });
  };

  // Kiểm tra thông số có đạt tiêu chuẩn hay không
  const checkAllParameters = () => {
    let newOutOfStandard = {};
    Object.keys(currentParameter).forEach((param) => {
      const value = currentParameter[param];
      if (value !== null && standardData[param]) {
        if (value < standardData[param].min) {
          newOutOfStandard[param] = `below standard by ${
            standardData[param].min - value
          }`;
        } else if (value > standardData[param].max) {
          newOutOfStandard[param] = `above standard by ${
            value - standardData[param].max
          }`;
        }
      }
    });
    setOutOfStandard(newOutOfStandard);
  };
  useEffect(() => {
    checkAllParameters();
  }, [currentParameter]);

  // thiết lập lựa chọn các thông số
  const handleParameterChange = (value) => {
    setSelectedParameter(value);
    const updatedChartData = createChartData(pondData, value);
    setChartData(updatedChartData);
  };

  // Hàm submit form
  const handleWaterParamsFormFinish = async (values) => {
    const pondId = pondData.length > 0 ? pondData[0].pondId : values.pondId;

    const postData = {
      pondId,
      temperature: values.temperature,
      salt: values.salt,
      phLevel: values.phLevel,
      o2Level: values.o2Level,
      totalChlorines: values.totalChlorines,
      po4Level: values.po4Level,
      no2Level: values.no2Level,
      no3Level: values.no3Level,
      date: new Date(),
    };

    try {
      const response = await axios.post(
        `https://koicaresystemapi.azurewebsites.net/api/WaterParameter/save-param${id}`,
        postData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200 || response.status === 201) {
        const newData = response.data;
        setParameterHistory((prevHistory) => [...prevHistory, newData]);
        setCurrentParameter({
          temperature: newData.temperature || null,
          salt: newData.salt || null,
          phLevel: newData.phLevel || null,
          o2Level: newData.o2Level || null,
          totalChlorines: newData.totalChlorines || null,
          po4Level: newData.po4Level || null,
          no2Level: newData.no2Level || null,
          no3Level: newData.no3Level || null,
        });
        setPondData((prevData) => {
          const updatedPondData = [...prevData, newData];
          setChartData(createChartData(updatedPondData, selectedParameter));
          return updatedPondData;
        });
        notification.success({
          description: `The parameters have save succefully!!`,
          placement: "topRight",
        });
      } else {
        console.error("Failed to save Water Parameters:", response);
        notification.error({
          description:
            "There was an issue while processing. Please try again later.",
          placement: "topRight",
        });
      }
    } catch (error) {
      console.error(
        "Error saving Water Parameters:",
        error.response ? error.response.data : error
      );
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <>
      <Header />

      <div className="ViewPage">
        <div className="ViewPage__img">
          <img src={bg} alt="" />
        </div>

        <h1>Water Parameters</h1>

        <i
          className="bi bi-arrow-left-circle"
          style={{
            fontSize: "40px",
            marginLeft: "100px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/environment")}
        ></i>

        <div className="PondImage">
          <h3>Pond {pondName}</h3>
          <img src={pondImage} style={{ borderRadius: "15px" }} />
        </div>

        <div className="ViewPage__Water">
          <Form
            form={waterParamsForm}
            className="Environment__form"
            onFinish={handleWaterParamsFormFinish}
            onValuesChange={checkAllParameters}
            layout="vertical"
            initialValues={currentParameter}
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  hidden={true}
                  label="ParameterId:"
                  name="parameterId"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Temperature (°C)"
                  name="temperature"
                  tooltip="The ideal range of value is between 5 and 26 °C."
                  rules={[
                    {
                      type: "number",
                      min: 0,
                      message: "Temperature must be 0 or greater!",
                      transform: (value) => Number(value),
                    },
                  ]}
                >
                  <Input type="number" disabled={!isEditing} />
                </Form.Item>
                {outOfStandard.temperature && (
                  <p className="out-of-standard">
                    Warning: Temperature {outOfStandard.temperature} !
                  </p>
                )}

                <Form.Item
                  label="Salt (%)"
                  name="salt"
                  tooltip="The ideal range of value is between 0 and 0.1 %."
                  rules={[
                    {
                      type: "number",
                      min: 0,
                      message: "Salt must be 0 or greater!",
                      transform: (value) => Number(value),
                    },
                  ]}
                >
                  <Input type="number" disabled={!isEditing} />
                </Form.Item>
                {outOfStandard.salt && (
                  <p className="out-of-standard">
                    Warning: Salt {outOfStandard.salt} !
                  </p>
                )}

                <Form.Item
                  label="pH (pH)"
                  name="phLevel"
                  tooltip="The ideal range of value is between 6.9 and 8."
                  rules={[
                    {
                      type: "number",
                      min: 0,
                      message: "PhLevel must be 0 or greater!",
                      transform: (value) => Number(value),
                    },
                  ]}
                >
                  <Input type="number" disabled={!isEditing} />
                </Form.Item>
                {outOfStandard.phLevel && (
                  <p className="out-of-standard">
                    Warning: PhLevel {outOfStandard.phLevel} !
                  </p>
                )}

                <Form.Item
                  label="Oxygen (mg/L)"
                  name="o2Level"
                  tooltip="The ideal range of value is between 6.5 and 18 mg/l."
                  rules={[
                    {
                      type: "number",
                      min: 0,
                      message: "O2Level must be 0 or greater!",
                      transform: (value) => Number(value),
                    },
                  ]}
                >
                  <Input type="number" disabled={!isEditing} />
                </Form.Item>
                {outOfStandard.o2Level && (
                  <p className="out-of-standard">
                    Warning: O2Level {outOfStandard.o2Level} !
                  </p>
                )}
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="PO₄ (mg/L)"
                  name="po4Level"
                  tooltip="The ideal range of value is between 0 and 0.035 mg/l."
                  rules={[
                    {
                      type: "number",
                      min: 0,
                      message: "Po4Level must be 0 or greater!",
                      transform: (value) => Number(value),
                    },
                  ]}
                >
                  <Input type="number" disabled={!isEditing} />
                </Form.Item>
                {outOfStandard.po4Level && (
                  <p className="out-of-standard">
                    Warning: Po4Level {outOfStandard.po4Level} !
                  </p>
                )}

                <Form.Item
                  label="NO₂ (mg/L)"
                  name="no2Level"
                  tooltip="The ideal range of value is between 0 and 0.1 mg/l."
                  rules={[
                    {
                      type: "number",
                      min: 0,
                      message: "No2Level must be 0 or greater!",
                      transform: (value) => Number(value),
                    },
                  ]}
                >
                  <Input type="number" disabled={!isEditing} />
                </Form.Item>
                {outOfStandard.no2Level ? (
                  <p className="out-of-standard">
                    Warning: No2Level {outOfStandard.no2Level} !
                  </p>
                ) : (
                  ""
                )}

                <Form.Item
                  label="NO₃ (mg/L)"
                  name="no3Level"
                  tooltip="The ideal range of value is between 0 and 20 mg/l."
                  rules={[
                    {
                      type: "number",
                      min: 0,
                      message: "No3Level must be 0 or greater!",
                      transform: (value) => Number(value),
                    },
                  ]}
                >
                  <Input type="number" disabled={!isEditing} />
                </Form.Item>
                {outOfStandard.no3Level && (
                  <p className="out-of-standard">
                    Warning: No3Level {outOfStandard.no3Level} !
                  </p>
                )}

                <Form.Item
                  label="TotalChlorines:"
                  name="totalChlorines"
                  hidden={true}
                  tooltip="The ideal range of value is between 0 and 0.001 mg/l."
                  rules={[
                    {
                      type: "number",
                      min: 0,
                      message: "TotalChlorines must be 0 or greater!",
                      transform: (value) => Number(value),
                    },
                  ]}
                >
                  <Input type="number" disabled={!isEditing} />
                </Form.Item>
              </Col>
            </Row>

            <div className="save-edit-buttons">
              <Button type="primary" htmlType="submit" disabled={!isEditing}>
                Save
              </Button>
              <Button type="default" onClick={toggleEditMode}>
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </div>
          </Form>

          {isMember ? (
            <div>
              <Select
                value={selectedParameter}
                style={{ width: 120 }}
                onChange={handleParameterChange}
              >
                <Option value="temperature">Temperature</Option>
                <Option value="salt">Salt</Option>
                <Option value="phLevel">pH Level</Option>
                <Option value="o2Level">O2 Level</Option>

                <Option value="po4Level">PO4 Level</Option>
                <Option value="no2Level">NO2 Level</Option>
                <Option value="no3Level">NO3 Level</Option>
              </Select>
              <LineChart
                key={JSON.stringify(chartData)}
                width={600}
                height={300}
                data={chartData}
                margin={{ top: 25, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name">
                  <Label value="Date" offset={-7} position="bottom" />
                </XAxis>
                <YAxis
                  domain={[
                    standardData[selectedParameter].min,
                    standardData[selectedParameter].max,
                  ]}
                >
                  <Label
                    value={selectedParameter}
                    angle={-90}
                    position="insideLeft"
                  />
                </YAxis>
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="min"
                  stroke="#82ca9d"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="max"
                  stroke="#ff7300"
                  dot={false}
                />
                <Legend />
              </LineChart>
            </div>
          ) : (
            <b className="buymembership">
              You must buy membership to view chart information!
            </b>
          )}
        </div>
      </div>

      {isMember ? (
        <>
          <div className="parameter__history" style={{ textAlign: "center" }}>
            <Row gutter={[16, 16]} justify="center">
              {parameterHistory
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                .map((record, index) => (
                  <Col
                    key={index}
                    xs={24}
                    sm={12}
                    md={6}
                    style={{ textAlign: "center" }}
                  >
                    <div
                      className="parameter-table"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        padding: "10px",
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      <h3>Pond Name: {pondName}</h3>
                      <p>Date: {new Date(record.date).toLocaleString()}</p>
                      <Table
                        dataSource={[
                          {
                            name: "Temperature",
                            value: record.temperature,
                            reference: "5 - 26",
                            unit: "°C",
                          },
                          {
                            name: "Salt",
                            value: record.salt,
                            reference: "0 - 0.1",
                            unit: "%",
                          },
                          {
                            name: "pH Level",
                            value: record.phLevel,
                            reference: "6.9 - 8",
                            unit: "pH",
                          },
                          {
                            name: "Oxygen",
                            value: record.o2Level,
                            reference: "> 6.5",
                            unit: "mg/L",
                          },
                          {
                            name: "PO₄ Level",
                            value: record.po4Level,
                            reference: "0 - 0.035",
                            unit: "mg/L",
                          },
                          {
                            name: "NO₂ Level",
                            value: record.no2Level,
                            reference: "0 - 0.1",
                            unit: "mg/L",
                          },
                          {
                            name: "NO₃ Level",
                            value: record.no3Level,
                            reference: "0 - 20",
                            unit: "mg/L",
                          },
                        ]}
                        columns={[
                          { title: "Name", dataIndex: "name", key: "name" },
                          { title: "Value", dataIndex: "value", key: "value" },
                          {
                            title: "Standard Value",
                            dataIndex: "reference",
                            key: "reference",
                          },
                          { title: "Unit", dataIndex: "unit", key: "unit" },
                        ]}
                        pagination={false}
                        rowKey="name"
                      />
                    </div>
                  </Col>
                ))}
            </Row>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={parameterHistory.length}
                onChange={handlePageChange}
              />
            </div>
          </div>

          <br />
          <div className="koiList">
            <h2>Koi Fish List</h2>
            <Table columns={columns} dataSource={koiList} rowKey="koiId" />
          </div>

          <Modal
            title={`Koi Growth Report for ${selectedKoi?.name}`}
            open={isReportVisible}
            onCancel={closeReport}
            footer={<Button onClick={closeReport}>Close</Button>}
          >
            <div style={{ marginBottom: "20px" }}>
              <p style={{ color: "green", fontWeight: "bold" }}>
                Good: Your fish are growing very well. Please continue to take
                care of your fish at all times!
              </p>
              <p style={{ color: "red", fontWeight: "bold" }}>
                Warning: Your Koi fish weight is increasing or decreasing by
                more than 15%. Review your fish feeding process or check your
                pond water quality!
              </p>
              <p>
                <strong>Suggestion:</strong>
                <ul>
                  <li>
                    You can use the Food Calculator or Salt Calculator function
                    to calculate the amount of food or salt for your pond.
                  </li>
                  <li>
                    Visit the product store at Home page to buy accessories to
                    care for your fish!
                  </li>
                </ul>
              </p>
            </div>

            <Table
              className="TableKoi"
              dataSource={reportData}
              columns={[
                {
                  title: "Date",
                  dataIndex: "date",
                  key: "date",
                  render: (text) => <span>{text}</span>, // Đảm bảo hiển thị đúng dữ liệu
                },
                { title: "Length (cm)", dataIndex: "length", key: "length" },
                { title: "Weight (g)", dataIndex: "weight", key: "weight" },
                {
                  title: "Health Status",
                  dataIndex: "healthStatus",
                  key: "healthStatus",
                  render: (text) => (
                    <span
                      style={{ color: text === "Warning" ? "red" : "green" }}
                    >
                      {text}
                    </span>
                  ),
                },
              ]}
              rowKey="date"
              pagination={false}
              style={{ width: "80%" }}
            />
          </Modal>
        </>
      ) : (
        <></>
      )}
      <Modal
        visible={isImageModalVisible}
        footer={null}
        onCancel={() => setIsImageModalVisible(false)}
        centered
      >
        <img
          src={selectedImage}
          alt="Koi"
          style={{ width: "100%", borderRadius: "10px" }}
        />
      </Modal>

      <Footer />
    </>
  );
}

export default Viewpond;
