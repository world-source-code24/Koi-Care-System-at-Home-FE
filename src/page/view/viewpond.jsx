import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import bg from '../../img/background.jpg';
import './viewpond.scss';
import { Form, Input, Row, Col, Button } from 'antd';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Viewpond() {
    const { id } = useParams();
    const [waterParamsForm] = Form.useForm();
    const [chartData, setChartData] = useState([]);
    const [pondData, setPondData] = useState(null);

    useEffect(() => {
        const fetchPondData = async () => {
            try {
                const response = await axios.get(`https://koicaresystemapi.azurewebsites.net/api/WaterParameter/get-param${id}`);
                if (response.status === 200) {
                    setPondData(response.data);
                    waterParamsForm.setFieldsValue(response.data);
                    // Cập nhật dữ liệu biểu đồ ngay khi nhận được dữ liệu
                    const initialChartData = createChartData(response.data);
                    setChartData(initialChartData);
                }
            } catch (error) {
                console.error("Error fetching pond data:", error);
            }
        };

        fetchPondData();
    }, [id, waterParamsForm]);

    const createChartData = (values) => {
        return [
            { name: 'Temperature', value: values.temperature },
            { name: 'Salt', value: values.salt },
            { name: 'pH Level', value: values.phLevel },
            { name: 'O2 Level', value: values.o2Level },
            { name: 'Total Chlorines', value: values.totalChlorines },
            { name: 'Po4 Level', value: values.po4Level },
            { name: 'No2 Level', value: values.no2Level },
            { name: 'No3 Level', value: values.no3Level },
        ];
    };

    const handleWaterParamsFormFinish = async (values) => {
        console.log("Water Parameters Form Data:", values);

        // Assuming pondId is taken from pondData
        const pondId = pondData ? pondData.pondId : values.pondId || 38;

        const postData = {
            $id: "1", // Optional, can be removed if not needed
            parameterId: values.parameterId || 5,
            temperature: values.temperature || 0,
            salt: values.salt || 0,
            phLevel: values.phLevel || 0,
            o2Level: values.o2Level || 0,
            no2Level: values.no2Level || 0,
            no3Level: values.no3Level || 0,
            po4Level: values.po4Level || 0,
            totalChlorines: values.totalChlorines || 0,
            date: new Date().toISOString(),
            note: values.note || "string",
            pondId: pondId,
        };

        console.log("Data to be sent:", postData);

        // Proceed with the POST request
        try {
            const response = await axios.post(
                `https://koicaresystemapi.azurewebsites.net/api/WaterParameter/save-param${id}`, 
                postData, 
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.status === 200 || response.status === 201) {
                console.log("Water Parameters saved successfully:", response.data);

                // Cập nhật dữ liệu biểu đồ
                const newChartData = createChartData(postData);
                setChartData(newChartData);
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
                                    rules={[{ required: true, pattern: /^[0-9.]+$/, message: 'Please enter a valid number for temperature!' }]}
                                    label="Temperature:" name="temperature"
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    rules={[{ pattern: /^[0-9.]+$/, message: 'Please enter a valid number for salt level!' }]}
                                    label="Salt:" name="salt"
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    rules={[{ pattern: /^[0-9.]+$/, message: 'Please enter a valid number for pH level!' }]}
                                    label="PhLevel:" name="phLevel"
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    rules={[{ pattern: /^[0-9.]+$/, message: 'Please enter a valid number for O2 level!' }]}
                                    label="O2Level:" name="o2Level"
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    rules={[{ pattern: /^[0-9.]+$/, message: 'Please enter a valid number for total chlorines!' }]}
                                    label="TotalChlorines:" name="totalChlorines"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={12}>
                                <Form.Item
                                    rules={[{ pattern: /^[0-9.]+$/, message: 'Please enter a valid number for Po4 level!' }]}
                                    label="Po4Level:" name="po4Level"
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    rules={[{ required: true, message: 'Please input the date!' }]}
                                    label="Date:" name="date"
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    rules={[{ pattern: /^[0-9.]+$/, message: 'Please enter a valid number for No2 level!' }]}
                                    label="No2Level:" name="no2Level"
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    rules={[{ pattern: /^[0-9.]+$/, message: 'Please enter a valid number for No3 level!' }]}
                                    label="No3Level:" name="no3Level"
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

                    {chartData.length > 0 && (
                        <LineChart width={600} height={400} data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" />
                        </LineChart>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Viewpond;
