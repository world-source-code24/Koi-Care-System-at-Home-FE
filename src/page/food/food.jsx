import background from "../../img/2.jpg";
import "./food.scss";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { Button, Form, Input } from "antd";
import axios from "axios";
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

      <div className="Calculator_background">
        <img src={background} alt="" />
      </div>
      <div className="Calculator_body">
        <div className="Calculator_title">Food and Salt Calculator</div>
        <div className="Calculator_Form">
          <div className="Calculator_Food">
            <Form className="Food_form" layout="vertical" onFinish={onFinishFoodCalculator}>
              <div className="Food_title">Food calculator</div>

              <Form.Item 
              label="Koi Fish pond name: " 
              name="pondName"
              rules={[{ required: true, message: "Please enter the pond name!" }]}
              >
                <Input 
                placeholder="Enter the name of the koi pond"
                />
              </Form.Item>
              <div className="form-columns">
                <div className="form-column">
                  <Form.Item 
                  label="Total number of Koi fish:" 
                  name="totalFish"
                  rules={[{ required: true, message: "Please enter the total number of koi fish!" }]}
                  >
                    <Input 
                    placeholder="Enter the total number of koi fish" 
                    rules={[{ required: true, message: "Please enter the total number of Koi fish!" }]}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Average weight of koi fish (kg):"
                    name="avgWeight"
                    rules={[{ required: true, message: "Please enter the average weight!" }]}
                  >
                    <Input placeholder="Enter the average weight of Koi fish " />
                  </Form.Item>
                </div>

                <div className="form-column">
                  <Form.Item 
                  label="Ratio Food (1% - 4%): " 
                  name="foodRatio"
                  rules={[{ required: true, message: "Please enter ratio of food!" }]}>
                    <Input placeholder="Enter feed ratio" />
                  </Form.Item>
                  <Form.Item
                    label="Amount of food for the lake (gam):"
                    name="foodAmount"
                    rules={[{ required: true, message: "Please enter the amount of food!" }]}
                  >
                    <Input placeholder="Enter the amount of food for the pond" />
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

          {/*Fish Calculator */}
          <div className="Calculator_Fish">
            <Form className="Fish_form" layout="vertical" onFinish={onFinishFishCalculator}>
              <div className="Fish_title">
                Your Fish Calculator
              </div>
            <Form.Item label="Koi Fish name: " name="koiName" rules={[{ required: true, message: "Please enter name of your Koi fish!" }]}>
                <Input placeholder="Enter name of your Koi fish" />
              </Form.Item>
              <div className="form-columns">
                <div className="form-column">
                  <Form.Item
                    label="Length of your Koi fish (cm):"
                    name="length"
                    rules={[{ required: true, message: "Please enter your length of your Koi fish!" }]}
                  >
                    <Input placeholder="Enter length of your Koi fish"  />
                  </Form.Item>
                  <Form.Item
                    label="Weight of your Koi fish (kg): "
                    name="weight"
                    rules={[{ required: true, message: "Please enter weight of your Koi fish!" }]}
                  >
                    <Input placeholder="Enter weight of your Koi fish "  />
                  </Form.Item>
                </div>

                <div className="form-column">
                  <Form.Item 
                  label="Ratio Fish Food (1% - 4%):" 
                  name="fishRatio"
                  rules={[{ required: true, message: "Please enter ratio of food for Koi fish!" }]}
                  >
                    <Input 
                    placeholder="Enter ratio fish food" 

                    />
                  </Form.Item>
                  <Form.Item 
                  label="Amount of food for Koi fish ( gam ):" 
                  name="fishAmount"
                  rules={[{ required: true, message: "Please enter the amount of food for Koi fish!" }]}
                  >
                    <Input 
                    placeholder="Enter amount of food for Koi fish" 
                    />
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

          {/*Salt Calculator */}
          <div className="Calculator_Salt">
            <Form className="Salt_form" layout="vertical" onFinish={onFinishSaltCalculator}>
              <div className="Salt_title">Salt calculator</div>

              <Form.Item 
              label="Koi fish pond name: "
              name="pondName"
              rules={[{ required: true, message: "Please enter the pond name!" }]}  
              >
                <Input placeholder="Enter koi fish pond name" />
              </Form.Item>
              <div className="form-columns">
                <div className="form-column">
                  <Form.Item
                    label="Amount of salt for the pond ( kg ):"
                    name="saltAmount"
                    rules={[{ required: true, message: "Please enter the amount of salt!" }]}
                  >
                    <Input placeholder="Enter Amount of salt for the pond" />
                  </Form.Item>
                  <Form.Item 
                  label="Salt ratio (1% - 5%): " 
                  name="saltRatio"
                  rules={[{ required: true, message: "Please enter the salt ratio!" }]}
                  >
                    <Input 
                    placeholder="Enter salt ratio" />
                  </Form.Item>
                </div>

                <div className="form-column">
                  <Form.Item
                    label="Volume of the lake ( litre ):"
                    name="volume"
                    rules={[{ required: true, message: "Please enter the volume of the lake!" }]}
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