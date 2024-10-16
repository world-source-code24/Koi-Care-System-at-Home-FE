/* eslint-disable react/jsx-key */
import "./checkout.scss";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import bg from "../../img/a10.jpg";
import { Form, Input, Col, Row, Select, Button } from "antd";
import { useEffect, useState } from "react";

const { Option } = Select;

function Checkout() {
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const storedTotalPrice = localStorage.getItem("checkout");
    if (storedTotalPrice) {
      setTotalPrice(parseFloat(storedTotalPrice));
    }
    console.log(totalPrice);
  }, []);

  const handleFinish = (values) => {
    console.log("Form values:", values);
    // navigate("/confirmation");
  };

  const provinces = [
    { value: "Hà Nội", label: "Hà Nội" },
    { value: "Hồ Chí Minh", label: "Hồ Chí Minh" },
    { value: "Đà Nẵng", label: "Đà Nẵng" },
    { value: "Hải Phòng", label: "Hải Phòng" },
    { value: "Nha Trang", label: "Nha Trang" },
    { value: "Cần Thơ", label: "Cần Thơ" },
    { value: "Bắc Ninh", label: "Bắc Ninh" },
    { value: "Nam Định", label: "Nam Định" },
    { value: "Thái Nguyên", label: "Thái Nguyên" },
    { value: "Bình Dương", label: "Bình Dương" },
    { value: "Đồng Nai", label: "Đồng Nai" },
    { value: "Long An", label: "Long An" },
    { value: "Kiên Giang", label: "Kiên Giang" },
    { value: "Quảng Ninh", label: "Quảng Ninh" },
    { value: "Thừa Thiên Huế", label: "Thừa Thiên Huế" },
    { value: "Hà Tĩnh", label: "Hà Tĩnh" },
    { value: "Vĩnh Long", label: "Vĩnh Long" },
    { value: "Hưng Yên", label: "Hưng Yên" },
    { value: "Quảng Nam", label: "Quảng Nam" },
    { value: "Ninh Bình", label: "Ninh Bình" },
    { value: "Lạng Sơn", label: "Lạng Sơn" },
    { value: "Bến Tre", label: "Bến Tre" },
    { value: "Đắc Lắc", label: "Đắc Lắc" },
    { value: "Thái Bình", label: "Thái Bình" },
    { value: "Khánh Hòa", label: "Khánh Hòa" },
    { value: "Hà Giang", label: "Hà Giang" },
    { value: "Tuyên Quang", label: "Tuyên Quang" },
    { value: "Sơn La", label: "Sơn La" },
    { value: "Điện Biên", label: "Điện Biên" },
    { value: "Lai Châu", label: "Lai Châu" },
    { value: "Ninh Thuận", label: "Ninh Thuận" },
    { value: "Tây Ninh", label: "Tây Ninh" },
    { value: "Hà Nam", label: "Hà Nam" },
    { value: "Hòa Bình", label: "Hòa Bình" },
    { value: "Bắc Kạn", label: "Bắc Kạn" },
    { value: "Cao Bằng", label: "Cao Bằng" },
    { value: "Lào Cai", label: "Lào Cai" },
    { value: "Yên Bái", label: "Yên Bái" },
    { value: "Thanh Hóa", label: "Thanh Hóa" },
    { value: "Nghệ An", label: "Nghệ An" },
    { value: "Hà Tĩnh", label: "Hà Tĩnh" },
    { value: "Quảng Bình", label: "Quảng Bình" },
    { value: "Quảng Trị", label: "Quảng Trị" },
    { value: "Thừa Thiên Huế", label: "Thừa Thiên Huế" },
    { value: "Hải Dương", label: "Hải Dương" },
    { value: "Lạng Sơn", label: "Lạng Sơn" },
    { value: "Nam Định", label: "Nam Định" },
    { value: "Ninh Bình", label: "Ninh Bình" },
  ];

  return (
    <>
      <Header />
      <div className="Checkout__img">
        <img src={bg} width={"100%"} alt="" />
      </div>

      <div className="Checkout__body">
        <h1>Payment information</h1>

        <div className="Checkout__infor">
          <Form className="Checkout__form" onFinish={handleFinish}>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item name="userName">
                  <Input placeholder="Name" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item name="phone">
                  <Input placeholder="Phone" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <div className="inline-fields">
                  <Form.Item name="Province">
                    <Select placeholder="Select Province / City">
                      {provinces.map((pro) => (
                        <Option value={pro.value}></Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item name="qdresss">
                  <Input placeholder="Address" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item name="note">
                  <Input placeholder="Note" />
                </Form.Item>
              </Col>
            </Row>

            <div className="Checkout__order">
              <Button type="secondary" htmlType="submit">
                Order Now
              </Button>
            </div>
          </Form>
        </div>

        <div className="Checkout__sumary">
          <h3>Total Payment</h3>

          <div className="Checkout_total">
            <p>Sub Total</p>
            <p>
              {totalPrice}
              .000 VND
            </p>
          </div>

          <div className="Checkout_ship">
            <p>Shipping</p>
            <p>Free</p>
          </div>
        </div>
        <br />
        <br />
      </div>
      <Footer />
    </>
  );
}

export default Checkout;