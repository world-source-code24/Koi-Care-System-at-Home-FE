import { Col, Form, Input, Row } from 'antd';
import background from '../../img/2.jpg'
import './food.scss'
import Header from '../../components/header/header';
function Food() {
  return (
    <>
    <Header />

    <div>
      <div className="Food_Page">
        <div className='Food_background'>
          <img src={background} alt="" />
        </div>

        <div className='Food_title'>
          <h3>Food Calculator</h3>
        </div>
          <div className="Food_body">
            <Form
              className="Food_form"
            >
              <Form.Item
                label="Name of your Koi Fish pond: " 
                name="name"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }} 
              >
                <Input/>
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                  label="Total number of Koi Fish" 
                  >
                    <Input/>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
      </div>
    </div>
    </>
  )
}

export default Food;