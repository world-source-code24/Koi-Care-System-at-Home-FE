import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import bg from '../../img/background.jpg';
import './viewpond.scss';
import { Form, Input, Row, Col, Button, Select } from 'antd';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label } from 'recharts';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const { Option } = Select;

function Viewpond() {
    const { id } = useParams();
    const [waterParamsForm] = Form.useForm();
    const [chartData, setChartData] = useState([]);
    const [userDates, setUserDates] = useState([0, 10, 20, 30]);
    const [pondData, setPondData] = useState(null);
    const [selectedParameter, setSelectedParameter] = useState('temperature');

    useEffect(() => {
        const fetchPondData = async () => {
            try {
                const response = await axios.get(`https://koicaresystemapi.azurewebsites.net/api/WaterParameter/get-param${id}`);
                if (response.status === 200) {
                    setPondData(response.data);
                    waterParamsForm.setFieldsValue(response.data);

                    const initialChartData = createChartData(response.data);
                    setChartData(initialChartData);
                }
            } catch (error) {
                console.error("Error fetching pond data:", error);
            }
        };

        fetchPondData();
    }, [id, waterParamsForm]);

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
    
    const createChartData = (updatedValues) => {
        const formattedData = userDates.map(date => {
            const value = updatedValues[date] ? updatedValues[date][selectedParameter] : null; 
            return {
                name: date,
                min: standardData[selectedParameter].min,
                max: standardData[selectedParameter].max,
                value: value !== null ? value : standardData[selectedParameter].min,
            };
        });
        return formattedData;
    };
    
    
    const handleParameterChange = (value) => {
        setSelectedParameter(value);
        if (pondData) {
            const updatedChartData = createChartData(pondData); // Update chart data based on selected parameter
            setChartData(updatedChartData);
        }
    };
    
    

    const handleWaterParamsFormFinish = async (values) => {
        console.log("Water Parameters Form Data:", values);
    
        const pondId = pondData ? pondData.pondId : values.pondId;
    
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
                { headers: { 'Content-Type': 'application/json' } }
            );
    
            if (response.status === 200 || response.status === 201) {
                console.log("Water Parameters saved successfully:", response.data);
    
                const inputDate = parseInt(values.date); // Get the input date
                const newPondData = { ...pondData, [inputDate]: postData }; // Update pondData with the new date's data
    
                // Ensure userDates contains the input date, then update the chart
                if (!userDates.includes(inputDate)) {
                    setUserDates(prevDates => {
                        const newDates = [...prevDates, inputDate].sort((a, b) => a - b);
                        const newChartData = createChartData(newPondData); // Update chart data with the new pond data
                        setChartData(newChartData);
                        setPondData(newPondData); // Save the updated pond data
                        return newDates;
                    });
                } else {
                    const newChartData = createChartData(newPondData);
                    setChartData(newChartData);
                    setPondData(newPondData); // Ensure pondData is always updated
                }
            } else {
                console.error("Failed to save Water Parameters:", response);
            }
        } catch (error) {
            if (error.response) {
                console.error("Error details:", error.response.data);
            } else {
                console.error("Error saving Water Parameters:", error);
            }
        }
    };
    
    
    

    return (
        <>
            <Header />
            <div className='ViewPage'>
                <div className='ViewPage__img'>
                    <img src={bg} alt="" />
                </div>

                <h1>Water Parameters</h1>

                <div className='ViewPage__Water'>
                    <Form
                        form={waterParamsForm}
                        className='Environment__form'
                        onFinish={handleWaterParamsFormFinish}
                        layout="vertical"
                    >
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item hidden={true} label="ParameterId:" name="parameterId">
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Temperature:" name="temperature"
                                    tooltip="Please enter a value between 5 and 26 °C."
                                >
                                    <Input type='number'/>
                                </Form.Item>

                                <Form.Item
                                    label="Salt:" name="salt"
                                    tooltip="Please enter a value between 0 and 0.1 %."
                                >
                                    <Input type='number'/>
                                </Form.Item>

                                <Form.Item
                                    label="PhLevel:" name="phLevel"
                                    tooltip="Please enter a value between 6.9 and 8."
                                >
                                    <Input type='number'/>
                                </Form.Item>

                                <Form.Item
                                    label="O2Level:" name="o2Level"
                                    tooltip="Please enter a value greater than 6.5 mg/l."
                                >
                                    <Input type='number'/>
                                </Form.Item>

                                <Form.Item
                                    label="TotalChlorines:" name="totalChlorines"
                                    tooltip="Please enter a value between 0 and 0.001 mg/l."
                                >
                                    <Input type='number'/>
                                </Form.Item>

                            </Col>

                            <Col xs={24} sm={12}>
                                <Form.Item
                                    label="Po4Level:" name="po4Level"
                                    tooltip="Please enter a value between 0 and 0.035 mg/l."
                                >
                                    <Input type='number'/>
                                </Form.Item>

                                <Form.Item
                                    label="No2Level:" name="no2Level"
                                    tooltip="Please enter a value between 0 and 0.1 mg/l."
                                >
                                    <Input type='number'/>
                                </Form.Item>

                                <Form.Item
                                    label="No3Level:" name="no3Level"
                                    tooltip="Please enter a value between 0 and 20 mg/l."
                                >
                                    <Input type='number'/>
                                </Form.Item>

                                <Form.Item
                                    rules={[{ required: true, message: 'Please input the date!' }]}
                                    label="Date:" name="date"
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item label="Note:" name="note">
                                    <Input.TextArea rows={5} className='textarea' />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Button type="secondary" htmlType='submit'>Save</Button>
                    </Form>

                    <Select
                        defaultValue={selectedParameter}
                        onChange={handleParameterChange}
                        style={{ width: 200, marginTop: 10, marginBottom: 20 }}
                    >
                        <Option value="temperature">Temperature</Option>
                        <Option value="salt">Salt</Option>
                        <Option value="phLevel">PhLevel</Option>
                        <Option value="o2Level">O2Level</Option>
                        <Option value="totalChlorines">TotalChlorines</Option>
                        <Option value="po4Level">Po4Level</Option>
                        <Option value="no2Level">No2Level</Option>
                        <Option value="no3Level">No3Level</Option>
                    </Select>

                    {chartData.length > 0 && (
                        <LineChart width={600} height={400} data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name">
                                <Label value="Date" offset={15} position="insideBottom" style={{ textAnchor: 'middle', transform: 'translateY(20px)' }} />
                            </XAxis>
                            <YAxis>
                                <Label value={selectedParameter.charAt(0).toUpperCase() + selectedParameter.slice(1) + " (units)"} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" connectNulls={true} />
                            <Line type="monotone" dataKey="min" stroke="#ff0000" strokeDasharray="5 5" />
                            <Line type="monotone" dataKey="max" stroke="#00ff00" strokeDasharray="5 5" />
                        </LineChart>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Viewpond;