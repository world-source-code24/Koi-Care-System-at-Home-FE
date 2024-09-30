import { useState, useRef } from 'react';
import Header from '../../components/header/header';
import './environment.scss';
import koi from '../../img/background.jpg';
import hoca from '../../img/hoca.jpg';
import { Select, Form, Input, Row, Col, Button } from "antd";
import Footer from '../../components/footer/footer';

function Environment() {
    const [showMore, setShowMore] = useState(false);
    const [EnvironmentFormData, setEnvironmentFormData] = useState({});
    const [waterParamsFormData, setWaterParamsFormData] = useState({});


    const EnvironmentFormRef = useRef(null);
    const waterParamsFormRef = useRef(null);


    const handleEnvironmentFormFinish = (values) => {
        setEnvironmentFormData(values);
        console.log("Environment Form Data:", values);
    };

    const handleWaterParamsFormFinish = (values) => {
        setWaterParamsFormData(values);
        console.log("Water Parameters Form Data:", values);
    };


    const handleSave = () => {

        EnvironmentFormRef.current.submit();

        if (showMore) {
            waterParamsFormRef.current.submit();
        }
    };

    return (
        <div className='EnvironmentPage'>
            <Header />
            <div className='Environment__img'>
                <img src={koi} alt="" />
            </div>

            <div className='Environment__body'>
                
                <div className='Environment__infor'>
                    <div className='Environment__form__container'>
                        <h1>Environment Monitor</h1>
                        <img src={hoca} alt="" width="100%" />
                        <Form
                            className='Environment__form'
                            ref={EnvironmentFormRef}  
                            onFinish={handleEnvironmentFormFinish}
                        >
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item labelCol={{ span: 24 }} label="Name:" name="name">
                                        <Input />
                                    </Form.Item>

                                    <Form.Item labelCol={{ span: 24 }} label="Drain Count:" name="drainCount">
                                        <Input />
                                    </Form.Item>

                                    <Form.Item labelCol={{ span: 24 }} label="Skimmer Count:" name="skimmerCount">
                                        <Input />
                                    </Form.Item>

                                    <Form.Item labelCol={{ span: 24 }} label="Other Pond:" name="otherPond">
                                        <Select>
                                            <Select.Option value="Pond__1">Pond 1</Select.Option>
                                            <Select.Option value="Pond__2">Pond 2</Select.Option>
                                            <Select.Option value="Pond__3">Pond 3</Select.Option>
                                            <Select.Option value="Pond__4">Pond 4</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item labelCol={{ span: 24 }} label="Volume:" name="volume">
                                        <Input />
                                    </Form.Item>

                                    <Form.Item labelCol={{ span: 24 }} label="Depth:" name="depth">
                                        <Input />
                                    </Form.Item>

                                    <Form.Item labelCol={{ span: 24 }} label="Pumping Capacity:" name="pumpingCapacity">
                                        <Input />
                                    </Form.Item>

                                    <Form.Item labelCol={{ span: 24 }} label="Additional Info:" name="additionalInfo">
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Button type="default" onClick={() => setShowMore(!showMore)}>
                                {showMore ? "Show Less" : "Show More"}
                            </Button>
                        </Form>

                        {showMore && (
                            <>
                                <h1>Water Parameters</h1>
                                <Form
                                    className='Environment__form'
                                    ref={waterParamsFormRef} 
                                    onFinish={handleWaterParamsFormFinish}
                                >
                                    <Row gutter={16}>
                                        <Col xs={24} sm={12}>
                                            <Form.Item labelCol={{ span: 24 }} label="ParameterId:" name="parameterId">
                                                <Input />
                                            </Form.Item>

                                            <Form.Item labelCol={{ span: 24 }} label="Temperature:" name="temperature">
                                                <Input />
                                            </Form.Item>

                                            <Form.Item labelCol={{ span: 24 }} label="Salt:" name="salt">
                                                <Input />
                                            </Form.Item>

                                            <Form.Item labelCol={{ span: 24 }} label="PhLevel:" name="phLevel">
                                                <Input />
                                            </Form.Item>

                                            <Form.Item labelCol={{ span: 24 }} label="O2Level:" name="o2Level">
                                                <Input />
                                            </Form.Item>

                                            <Form.Item labelCol={{ span: 24 }} label="No2Level:" name="no2Level">
                                                <Input />
                                            </Form.Item>

                                            <Form.Item labelCol={{ span: 24 }} label="No3Level:" name="no3Level">
                                                <Input />
                                            </Form.Item>

                                            <Form.Item labelCol={{ span: 24 }} label="TotalChlorines:" name="totalChlorines">
                                                <Input />
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} sm={12}>
                                            <Form.Item labelCol={{ span: 24 }} label="Po4Level:" name="po4Level">
                                                <Input />
                                            </Form.Item>

                                            <Form.Item labelCol={{ span: 24 }} label="Nh4Level:" name="nh4Level">
                                                <Input />
                                            </Form.Item>

                                            <Form.Item labelCol={{ span: 24 }} label="KhLevel:" name="khLevel">
                                                <Input />
                                            </Form.Item>

                                            <Form.Item labelCol={{ span: 24 }} label="GhLevel:" name="ghLevel">
                                                <Input />
                                            </Form.Item>

                                            <Form.Item labelCol={{ span: 24 }} label="Co2Level:" name="co2Level">
                                                <Input />
                                            </Form.Item>

                                            <Form.Item labelCol={{ span: 24 }} label="Co2Level:" name="outDoorTemp">
                                                <Input />
                                            </Form.Item>

                                            <Form.Item labelCol={{ span: 24 }} label="Date:" name="date">
                                                <Input />
                                            </Form.Item>

                                            <Form.Item labelCol={{ span: 24 }} label="Note:" name="note">
                                                <Input.TextArea rows={5} className='textarea'></Input.TextArea>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </>
                        )}

                        <Button className='save_all' type="secondary" onClick={handleSave}>Save All</Button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Environment;
