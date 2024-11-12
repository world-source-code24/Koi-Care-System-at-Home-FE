import { useState, useEffect } from "react";
import { Button, Input, Form, Spin, message } from "antd";
import axios from "axios";
import './calculate.scss';
function Calculate() {
  const [parameters, setParameters] = useState([]);
  const [rangeTemps, setRangeTemps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingParameterId, setEditingParameterId] = useState(null); // Trạng thái để xác định bảng Level nào đang được chỉnh sửa
  const [editingRangeId, setEditingRangeId] = useState(null); // Trạng thái để xác định bảng Water Temperature nào đang được chỉnh sửa

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch parameters data
        const paramsResponse = await axios.get("https://koicaresystemapi.azurewebsites.net/api/Calculator/parameter");
        setParameters(paramsResponse.data);

        // Fetch range temperatures data
        const rangeResponse = await axios.get("https://koicaresystemapi.azurewebsites.net/api/Calculator/rangeTemp");
        setRangeTemps(rangeResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
        message.error("Failed to fetch data");
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Handle input change for parameters
  const handleParameterChange = (index, field, value) => {
    setParameters((prevParameters) => {
      const updatedParameters = [...prevParameters];
      updatedParameters[index] = { ...updatedParameters[index], [field]: value };
      return updatedParameters;
    });
  };

  // Handle input change for range temperatures
  const handleRangeChange = (index, field, value) => {
    setRangeTemps((prevRanges) => {
      const updatedRanges = [...prevRanges];
      updatedRanges[index] = { ...updatedRanges[index], [field]: value };
      return updatedRanges;
    });
  };

  // Save a specific parameter
  const handleSaveParameter = async (param) => {
    setLoading(true);
    try {
      const adviceValue = param.advice || "no recommend"; // Đảm bảo advice luôn có giá trị
  
      // Gửi yêu cầu PUT với các tham số trong URL
      const response = await axios.put(
        `https://koicaresystemapi.azurewebsites.net/api/Calculator/parameter?id=${param.parameterId}&multiplierLower=${param.multiplierLower}&multiplierBetween=${param.multiplierBetween}&multiplierUpper=${param.multiplierUpper}&advice=${encodeURIComponent(adviceValue)}`
      );
  
      console.log("Response:", response.data);
      message.success(`Dữ liệu cho level "${param.level}" đã được lưu thành công`);
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu", error);
      message.error("Không thể lưu dữ liệu");
    }
    setLoading(false);
    setEditingParameterId(null); // Đặt lại trạng thái không chỉnh sửa
  };
  
  

  // Save a specific range temperature
  const handleSaveRangeTemp = async (range) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `https://koicaresystemapi.azurewebsites.net/api/Calculator/rangeTemp?id=${range.rangeId}&minTemp=${range.minTemp}&maxTemp=${range.maxTemp}`
      );
  
      console.log("Response:", response.data);
      message.success(`Dữ liệu cho water temperature range "${range.rangeId}" đã được lưu thành công`);
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu", error);
      message.error("Không thể lưu dữ liệu");
    }
    setLoading(false);
    setEditingRangeId(null); // Đặt lại trạng thái không chỉnh sửa
  };
  
  return (
    <div className="form-container">
    <h2>Calculate</h2>
    {loading ? (
      <Spin />
    ) : (
      <Form layout="vertical">
        <div className="level-container">
          {parameters.map((param, index) => (
            <div key={param.parameterId} className="level-box">
              <h3>Level: {param.level}</h3>
              <Form.Item label="Multiplier Lower">
                <Input
                  value={param.multiplierLower}
                  disabled={editingParameterId !== param.parameterId}
                  onChange={(e) => handleParameterChange(index, "multiplierLower", e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Multiplier Between">
                <Input
                  value={param.multiplierBetween}
                  disabled={editingParameterId !== param.parameterId}
                  onChange={(e) => handleParameterChange(index, "multiplierBetween", e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Multiplier Upper">
                <Input
                  value={param.multiplierUpper}
                  disabled={editingParameterId !== param.parameterId}
                  onChange={(e) => handleParameterChange(index, "multiplierUpper", e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Advice">
                <Input
                  value={param.advice}
                  disabled={editingParameterId !== param.parameterId}
                  onChange={(e) => handleParameterChange(index, "advice", e.target.value)}
                />
              </Form.Item>
              {editingParameterId === param.parameterId ? (
                <Button type="primary" onClick={() => handleSaveParameter(param)}>
                  Save Level
                </Button>
              ) : (
                <Button type="default" onClick={() => setEditingParameterId(param.parameterId)}>
                  Edit Level
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="temperature-container">
          {rangeTemps.map((range, index) => (
            <div key={range.rangeId} className="temperature-box">
              <h3>Water Temperature Range: {range.rangeId}</h3>
              <Form.Item label="Min Temperature">
                <Input
                  value={range.minTemp}
                  disabled={editingRangeId !== range.rangeId}
                  onChange={(e) => handleRangeChange(index, "minTemp", e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Max Temperature">
                <Input
                  value={range.maxTemp}
                  disabled={editingRangeId !== range.rangeId}
                  onChange={(e) => handleRangeChange(index, "maxTemp", e.target.value)}
                />
              </Form.Item>
              {editingRangeId === range.rangeId ? (
                <Button type="primary" onClick={() => handleSaveRangeTemp(range)}>
                  Save Water Temperature
                </Button>
              ) : (
                <Button type="default" onClick={() => setEditingRangeId(range.rangeId)}>
                  Edit Water Temperature
                </Button>
              )}
            </div>
          ))}
        </div>
      </Form>
    )}
  </div>
);
}

export default Calculate;
