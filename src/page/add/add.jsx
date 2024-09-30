import './add.scss';
import koi from '../../img/background.jpg';
import Header from '../../components/header/header';
import ca from '../../img/ca.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Form, Input, Button } from 'antd';
import Footer from '../../components/footer/footer';
function AddPage() {
  const [formData, setFormData] = useState({
    name__fish: '',
    length__fish: '',
    variety__fish: '',
    breed__fish: '',
    physique__fish: '',
    weight__fish: '',
    pond__fish: '',
    purchase__fish: '',
    age__fish: '',
    sex__fish: '',
    pond__since__fish: '',
    number__fish: ''
  });

//   const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFinish = (values) => {
    // Xử lý dữ liệu form tại đây
    console.log('Form values:', values);
  };
  
  return (
    <div className='Addpage'>
      <Header />
      <div className='Addpage__body'>
        <div className='Addpage__background'>
          <img src={koi} alt="" width="30%" />
        </div>
  
        <div className='Addpage__Title'>
          <h1>Add New Koi</h1>
        </div>
  
        <Form onFinish={handleFinish}>
          <div className='Addpage__information'>
            <div className='row Addpage__fish'>
              <div className='col-md-3 Addpage__img'>
                <img src={ca} alt="" width="130%" />
              </div>
  
              <div className='col-md-9 Addpage_inf'>
                <div className='col-md-3 character__1'>
                  <Form.Item labelCol={{ span: 24 }} name="name__fish" label="Name">
                    <Input />
                  </Form.Item>
                  <Form.Item labelCol={{ span: 24 }} name="length__fish" label="Length">
                    <Input />
                  </Form.Item>
                  <Form.Item labelCol={{ span: 24 }} name="variety__fish" label="Variety">
                    <Input />
                  </Form.Item>
                  <Form.Item labelCol={{ span: 24 }} name="breed__fish" label="Breeder">
                    <Input />
                  </Form.Item>
                </div>
  
                <div className='col-md-3 character__2'>
                  <Form.Item labelCol={{ span: 24 }} name="physique__fish" label="Physique">
                    <Input />
                  </Form.Item>
                  <Form.Item labelCol={{ span: 24 }} name="weight__fish" label="Weight">
                    <Input />
                  </Form.Item>
                  <Form.Item labelCol={{ span: 24 }} name="pond__fish" label="Pond">
                    <Input />
                  </Form.Item>
                  <Form.Item labelCol={{ span: 24 }} name="purchase__fish" label="Purchase Price">
                    <Input />
                  </Form.Item>
                </div>
  
                <div className='col-md-3 character__3'>
                  <Form.Item labelCol={{ span: 24 }} name="age__fish" label="Age">
                    <Input />
                  </Form.Item>
                  <Form.Item labelCol={{ span: 24 }} name="sex__fish" label="Sex">
                    <Input />
                  </Form.Item>
                  <Form.Item labelCol={{ span: 24 }} name="pond__since__fish" label="In Pond Since">
                    <Input />
                  </Form.Item>
                  <Form.Item labelCol={{ span: 24 }} name="number__fish" label="Number Of Kois">
                    <Input />
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>
  
          <div className='Addpage__Link'>
            <Link className='Addpage__but1' to="/food">Food Calculator</Link>
            <Button className='Addpage__but2' type="secondary" htmlType="submit">
              Add New Fish
            </Button>
          </div>
        </Form>
        <br />
        <br />
        <Footer/>
      </div>
    </div>
  );
}

export default AddPage;
