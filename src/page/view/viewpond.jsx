import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import bg from "../../img/background.jpg";
import "./viewpond.scss";
import { Form, Input, Row, Col, Button, Select, notification } from "antd";
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
import { useParams } from "react-router-dom";

const { Option } = Select;

function Viewpond() {
  const { id } = useParams();
  const [waterParamsForm] = Form.useForm();
  const [chartData, setChartData] = useState([]);
  const [pondData, setPondData] = useState([]);
  const [selectedParameter, setSelectedParameter] = useState("temperature");
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

  const [isEditing, setIsEditing] = useState(false); // State to manage view/edit mode

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

  // Fetch parameter data when component mounts or ID changes
  useEffect(() => {
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

  // Sync form fields with current parameter data
  useEffect(() => {
    if (currentParameter) {
      waterParamsForm.setFieldsValue(currentParameter); // Update form with current parameter values
    }
  }, [currentParameter, waterParamsForm]);

  // Fetch pond data and generate chart when the ID or selected parameter changes
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

  const handleParameterChange = (value) => {
    setSelectedParameter(value);
    const updatedChartData = createChartData(pondData, value);
    setChartData(updatedChartData);
  };

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
    };

    try {
      const response = await axios.post(
        `https://koicaresystemapi.azurewebsites.net/api/WaterParameter/save-param${id}`,
        postData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200 || response.status === 201) {
        const newData = response.data;
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

  // Toggle between view and edit mode
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

        <div className="ViewPage__Water">
          <Form
            form={waterParamsForm}
            className="Environment__form"
            onFinish={handleWaterParamsFormFinish}
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
                  label="Temperature:"
                  name="temperature"
                  tooltip="Please enter a value between 5 and 26 °C."
                >
                  <Input type="number" disabled={!isEditing} />
                </Form.Item>

                <Form.Item
                  label="Salt:"
                  name="salt"
                  tooltip="Please enter a value between 0 and 0.1 %."
                >
                  <Input type="number" disabled={!isEditing} />
                </Form.Item>

                <Form.Item
                  label="PhLevel:"
                  name="phLevel"
                  tooltip="Please enter a value between 6.9 and 8."
                >
                  <Input type="number" disabled={!isEditing} />
                </Form.Item>

                <Form.Item
                  label="O2Level:"
                  name="o2Level"
                  tooltip="Please enter a value greater than 6.5 mg/l."
                >
                  <Input type="number" disabled={!isEditing} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="Po4Level:"
                  name="po4Level"
                  tooltip="Please enter a value between 0 and 0.035 mg/l."
                >
                  <Input type="number" disabled={!isEditing} />
                </Form.Item>

                <Form.Item
                  label="No2Level:"
                  name="no2Level"
                  tooltip="Please enter a value between 0 and 0.1 mg/l."
                >
                  <Input type="number" disabled={!isEditing} />
                </Form.Item>

                <Form.Item
                  label="No3Level:"
                  name="no3Level"
                  tooltip="Please enter a value between 0 and 20 mg/l."
                >
                  <Input type="number" disabled={!isEditing} />
                </Form.Item>

                <Form.Item
                  label="TotalChlorines:"
                  name="totalChlorines"
                  tooltip="Please enter a value between 0 and 0.001 mg/l."
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

          <Select
            value={selectedParameter}
            style={{ width: 120 }}
            onChange={handleParameterChange}
          >
            <Option value="temperature">Temperature</Option>
            <Option value="salt">Salt</Option>
            <Option value="phLevel">pH Level</Option>
            <Option value="o2Level">O2 Level</Option>
            <Option value="totalChlorines">Total Chlorines</Option>
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
            <Line type="monotone" dataKey="min" stroke="#82ca9d" dot={false} />
            <Line type="monotone" dataKey="max" stroke="#ff7300" dot={false} />
            <Legend />
          </LineChart>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Viewpond;
