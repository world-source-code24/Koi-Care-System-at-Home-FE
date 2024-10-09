import "./mykoi.scss";
import { Button, Form, Input } from "antd";
import Header from "../../components/header/header";
import koi from "../../img/background.jpg";
import ca from "../../img/ca.jpg";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/footer/footer";
import { useState } from "react";

function Mykoi() {
  const [dataSource, setDataSource] = useState({
    name__fish: "",
    length__fish: "",
    variety__fish: "",
    breed__fish: "",
    physique__fish: "",
    weight__fish: "",
    pond__fish: "",
    purchase__fish: "",
    age__fish: "",
    sex__fish: "",
    pond__since__fish: "",
  });

  const handleFinish = (values) => {
    // Xử lý dữ liệu form tại đây
    console.log("Form values:", values);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDataSource({
      ...dataSource,
      [name]: value,
    });
  };

  const navigate = useNavigate();

  const handleCancleClick = () => {
    navigate("/");
  };

  return (
    <>
    <Header />
    <div className="UpdatePage">
      

      <div className="UpdatePage_body">
        <div className="UpdatePage_background">
          <img src={koi} alt="" />
        </div>

        <div className="UpdatePage_Title">
          <h1>My Koi Fish</h1>
        </div>

        
          <div className="UpdatePage_infomation">
          <Form onFinish={handleFinish}>
            <div className="row UpdatePage_fish">
              <div className="col-md-3 UpdatePage_img">
                <img src={ca} alt="" />
              </div>

              <div className="col-md-9 UpdatePage_inf">
                <div className="col-md-3 character_1">
                  <Form.Item
                    labelCol={{ span: 24 }}
                    name="name"
                    label="Name"
                    className="custom-label"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    name="length"
                    label="Length"
                    className="custom-label"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    name="variety__fish"
                    label="Variety"
                    className="custom-label"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    name="breed"
                    label="Breeder"
                    className="custom-label"
                  >
                    <Input />
                  </Form.Item>
                </div>

                <div className="col-md-3 character_2">
                  <Form.Item
                    labelCol={{ span: 24 }}
                    name="physique"
                    label="Physique"
                    className="custom-label"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    name="weight"
                    label="Weight"
                    className="custom-label"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    name="pond"
                    label="Pond"
                    className="custom-label"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    name="purchase"
                    label="Purchase Price"
                    className="custom-label"
                  >
                    <Input />
                  </Form.Item>
                </div>

                <div className="col-md-3 character_3">
                  <Form.Item
                    labelCol={{ span: 24 }}
                    name="age"
                    label="Age"
                    className="custom-label"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    name="sex"
                    label="Sex"
                    className="custom-label"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    name="pond_since"
                    label="In Pond Since"
                    className="custom-label"
                  >
                    <Input />
                  </Form.Item>
                </div>
              </div>
            </div>
            </Form>
          </div>

          <div className="container button">
            <Link className="but1" onClick={handleCancleClick}>
              Cancel
            </Link>

            <Button className="but2" type="secondary" htmlType="submit">
              Delete
            </Button>

            <Button className="but3" type="secondary" htmlType="submit">
              Update
            </Button>
          </div>
       
        <br />
        <br />
       
      </div>
    </div>
    <Footer />
    </>
    
  );
}

export default Mykoi;
