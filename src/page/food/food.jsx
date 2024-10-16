import { Col, Form, Input, Row } from 'antd';
import background from '../../img/2.jpg'
import './food.scss'
import Header from '../../components/header/header';
function Food() {

// Hàm xử lý khi form Food calculator 
const onFinishFoodCalculator = async (values) => {
  try {
    const response = await axios.post("API/Food calcu", values);
    message.success("Calculation successful!");
    console.log("Response from BE:", response.data);
  } catch (error) {
    message.error("An error occurred during calculation.");
    console.error("Error:", error);
  }
};

// Hàm xử lý khi form Fish calculator 
const onFinishFishCalculator = async (values) => {
  try {
    const response = await axios.post("API/Fish calcu", values);
    message.success("Calculation successful!");
    console.log("Response from BE:", response.data);
  } catch (error) {
    message.error("An error occurred during calculation.");
    console.error("Error:", error);
  }
};

// Hàm xử lý khi form Salt calculator 
const onFinishSaltCalculator = async (values) => {
  try {
    const response = await axios.post("API/salt calcu", values);
    message.success("Calculation successful!");
    console.log("Response from BE:", response.data);
  } catch (error) {
    message.error("An error occurred during calculation.");
    console.error("Error:", error);
  }
};

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
                <Input placeholder="Enter koi fish pond name" />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                  label="Total number of Koi Fish" 
                  >
                    <Input placeholder="Enter volume of the lake" />
                  </Form.Item>
                </div>
              </div>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Calculator
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Food;
