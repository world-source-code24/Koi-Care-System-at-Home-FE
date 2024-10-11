import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import bg from '../../img/background.jpg';
import './viewpond.scss';
import { Form, Input, Row, Col, Button } from 'antd';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

function Viewpond() {
    const [waterParamsForm] = Form.useForm();
    const [chartData, setChartData] = useState([]); 

    const handleWaterParamsFormFinish = (values) => {
        console.log("Water Parameters Form Data:", values);


        const newChartData = [
            { name: 'Temperature', value: parseFloat(values.temperature) || 0 },
            { name: 'Salt', value: parseFloat(values.salt) || 0 },
            { name: 'pH Level', value: parseFloat(values.phLevel) || 0 },
            { name: 'O2 Level', value: parseFloat(values.o2Level) || 0 },
            { name: 'No2 Level', value: parseFloat(values.no2Level) || 0 },
            { name: 'No3 Level', value: parseFloat(values.no3Level) || 0 },
            { name: 'Total Chlorines', value: parseFloat(values.totalChlorines) || 0 },
            { name: 'Po4 Level', value: parseFloat(values.po4Level) || 0 },
            { name: 'Nh4 Level', value: parseFloat(values.nh4Level) || 0 },
            { name: 'Kh Level', value: parseFloat(values.khLevel) || 0 },
            { name: 'Gh Level', value: parseFloat(values.ghLevel) || 0 },
            { name: 'Co2 Level', value: parseFloat(values.co2Level) || 0 },
            { name: 'Outdoor Temp', value: parseFloat(values.outDoorTemp) || 0 },
        ];
        setChartData(newChartData); 
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
                                <Form.Item
                                    hidden={true}
                                    label="ParameterId:" name="parameterId"
                                >
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
                                    rules={[{ pattern: /^[0-9.]+$/, message: 'Please enter a valid number for Nh4 level!' }]}
                                    label="Nh4Level:" name="nh4Level"
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    rules={[{ pattern: /^[0-9.]+$/, message: 'Please enter a valid number for Kh level!' }]}
                                    label="KhLevel:" name="khLevel"
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    rules={[{ pattern: /^[0-9.]+$/, message: 'Please enter a valid number for Gh level!' }]}
                                    label="GhLevel:" name="ghLevel"
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    rules={[{ pattern: /^[0-9.]+$/, message: 'Please enter a valid number for Co2 level!' }]}
                                    label="Co2Level:" name="co2Level"
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    rules={[{ pattern: /^[0-9.]+$/, message: 'Please enter a valid number for outdoor temperature!' }]}
                                    label="OutDoorTemp:" name="outDoorTemp"
                                >
                                    <Input />
                                </Form.Item>

                                {/* <Form.Item
                                    rules={[{ required: true, message: 'Please input the date!' }]}
                                    label="Date:" name="date"
                                >
                                    <Input />
                                </Form.Item> */}

                                <Form.Item
                                    label="Note:" name="note"
                                >
                                    <Input.TextArea rows={5} className='textarea' />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Button type="secondary" htmlType='submit'>Save</Button>
                    </Form>

                    {chartData.length > 0 && (
                        <LineChart width={500} height={300} data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis dataKey="value" />
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
