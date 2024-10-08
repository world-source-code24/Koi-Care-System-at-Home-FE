import { useState, useEffect } from 'react';
import Header from '../../components/header/header';
import './environment.scss';
import koi from '../../img/news.jpg';
import { Form, Input, Button, Modal, Upload, Row, Col } from "antd";
import Footer from '../../components/footer/footer';
import { UploadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ho from '../../img/hoca.jpg';
import debounce from 'lodash/debounce';

function Environment() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [environmentForm] = Form.useForm();  
    const [pondDataList, setPondDataList] = useState([]); 
    const [originalPondDataList, setOriginalPondDataList] = useState([]); 
    const [image, setImage] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);

    // Lấy dữ liệu từ localStorage khi trang tải lần đầu
    useEffect(() => {
        const storedPondData = JSON.parse(localStorage.getItem('pondDataList')) || [];
        setPondDataList(storedPondData);
        setOriginalPondDataList(storedPondData);
    }, []);

    // Lưu dữ liệu vào localStorage mỗi khi pondDataList thay đổi
    useEffect(() => {
        localStorage.setItem('pondDataList', JSON.stringify(pondDataList));
    }, [pondDataList]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleDeletePond = (index) => {
        const updatedPondDataList = pondDataList.filter((_, pondIndex) => pondIndex !== index);
        setPondDataList(updatedPondDataList);
        setOriginalPondDataList(updatedPondDataList);
    };
    
    const handleEditPond = (index) => {
        const pondToEdit = pondDataList[index];
        environmentForm.setFieldsValue(pondToEdit); 
        setImage(pondToEdit.image); 
        setEditingIndex(index);
        setIsEditing(true);
        setIsModalVisible(true);
    };
    
    const handleOk = () => {
        const formData = environmentForm.getFieldsValue();
        const newPondData = { ...formData, image };
    
        if (isEditing) {
            const updatedPondDataList = [...pondDataList];
            updatedPondDataList[editingIndex] = newPondData;
            setPondDataList(updatedPondDataList);
            setOriginalPondDataList(updatedPondDataList); 
        } else {
            const updatedPondDataList = [...pondDataList, newPondData];
            setPondDataList(updatedPondDataList);
            setOriginalPondDataList(updatedPondDataList);
        }
    
        setIsModalVisible(false);
        environmentForm.resetFields();
        setImage(null);
        setIsEditing(false); 
    };
    
    const handleCancel = () => {
        setIsModalVisible(false);
        environmentForm.resetFields();
        setImage(null);
        setIsEditing(false); 
    };
    
    const handleImageUpload = (file) => {
        setImage(URL.createObjectURL(file));
        return false; 
    };

    // Sử dụng debounce để tối ưu tìm kiếm
    const handleSearch = debounce(() => {
        if (searchText.trim() === '') {
            setPondDataList(originalPondDataList); 
        } else {
            const filteredPonds = originalPondDataList.filter((pond) =>
                pond.name.toLowerCase().includes(searchText.toLowerCase())
            );
            setPondDataList(filteredPonds); 
        }
        setSearchText(''); 
    }, 300); // Thực hiện tìm kiếm sau 300ms khi người dùng ngừng nhập

    return (
        <div className='EnvironmentPage'>
            <Header />
            <div className='Environment__img'>
                <img src={koi} alt="" />
            </div>

            <div className='Environment__body'>
            <div className='title'>
                    <h3>Environment monitor</h3>
                </div>
                <div className="search">
                    <Input 
                        placeholder="Search Pond" 
                        value={searchText} 
                        onChange={(e) => setSearchText(e.target.value)} 
                        onPressEnter={handleSearch} // Cho phép nhấn Enter để tìm kiếm
                    />
                    <Button type="secondary" onClick={handleSearch}>Search</Button>                  
                </div>

                <div className='add'>
                    <Button type="secondary" onClick={showModal}>Add Pond</Button>
                </div>
                <br />



                <div  className='uploaded__pond__info'>
                                <h3>Pond sample</h3>
                                <Row gutter={16}>
                                    <Col md={12} xs={24} className='uploaded__pond__info__left'>
                                        <img src={ho} alt="Uploaded" style={{ width: '90%' }} />
                                    </Col>
                                    <Col md={12} xs={24} className='uploaded__pond__info__right'>
                                        <Row gutter={16}>
                                            <Col span={12} className='pond__infor'>
                                                <p><strong>Name: Koi's pond</strong> </p>
                                                <p><strong>Drain Count:2</strong></p>
                                            </Col>
                                            <Col span={12} className='pond__infor'>
                                                <p><strong>Skimmer Count:1</strong> </p>
                                                <p><strong>Volume:16m3</strong></p>
                                            </Col>
                                            <Col span={12} className='pond__infor'>
                                                <p><strong>Depth:1m</strong> </p>
                                                <p><strong>Pumping Capacity:25</strong></p>
                                            </Col>
                                            <Col span={12} className='pond__infor'>
                                                <p><strong>Additional Info:No</strong></p>
                                            </Col>
                                        </Row>
                                        <Link to={'/view'}>View</Link>
                                        <Button type='secondary'>Edit</Button>
                                        <Button type='secondary'>Delete</Button>
                                    </Col>
                                </Row>
                                <br />
                            </div>
                
                <div className='Environment__infor'>
                    <div className='Environment__form__container'>
                        <Modal title="Add Pond" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                            <Upload beforeUpload={handleImageUpload}>
                                <Button icon={<UploadOutlined />}>Upload Image</Button>
                            </Upload>
                            {image && (
                                <div>
                                    <img src={image} alt="Uploaded" width="100%" />
                                </div>
                            )}

                            <Form form={environmentForm} layout="vertical" >
                                <Form.Item label="Name:" name="name">
                                    <Input />
                                </Form.Item>
                                <Form.Item label="Drain Count:" name="drainCount">
                                    <Input />
                                </Form.Item>
                                <Form.Item label="Skimmer Count:" name="skimmerCount">
                                    <Input />
                                </Form.Item>
                                <Form.Item label="Volume:" name="volume">
                                    <Input />
                                </Form.Item>
                                <Form.Item label="Depth:" name="depth">
                                    <Input />
                                </Form.Item>
                                <Form.Item label="Pumping Capacity:" name="pumpingCapacity">
                                    <Input />
                                </Form.Item>
                                <Form.Item label="Additional Info:" name="additionalInfo">
                                    <Input />
                                </Form.Item>
                            </Form>
                        </Modal>

                        {pondDataList.map((pondData, index) => (
                            <div key={index} className='uploaded__pond__info'>
                                <h3>Pond {index + 1}</h3>
                                <Row gutter={16}>
                                    <Col md={12} xs={24} className='uploaded__pond__info__left'>
                                        <img src={pondData.image} alt="Uploaded" style={{ width: '90%' }} />
                                    </Col>
                                    <Col md={12} xs={24} className='uploaded__pond__info__right'>
                                        <Row gutter={16}>
                                            <Col span={12} className='pond__infor'>
                                                <p><strong>Name:</strong> {pondData.name}</p>
                                                <p><strong>Drain Count:</strong> {pondData.drainCount}</p>
                                            </Col>
                                            <Col span={12} className='pond__infor'>
                                                <p><strong>Skimmer Count:</strong> {pondData.skimmerCount}</p>
                                                <p><strong>Volume:</strong> {pondData.volume}</p>
                                            </Col>
                                            <Col span={12} className='pond__infor'>
                                                <p><strong>Depth:</strong> {pondData.depth}</p>
                                                <p><strong>Pumping Capacity:</strong> {pondData.pumpingCapacity}</p>
                                            </Col>
                                            <Col span={12} className='pond__infor'>
                                                <p><strong>Additional Info:</strong> {pondData.additionalInfo}</p>
                                            </Col>
                                        </Row>
                                        <Link to={'/view'}>View</Link>
                                        <Button type='secondary' onClick={() => handleEditPond(index)}>Update</Button>
                                        <Button type='secondary' onClick={() => handleDeletePond(index)}>Delete</Button>
                                    </Col>
                                </Row>
                            </div>
                        ))}
                    </div>
                    <br />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Environment;

                           