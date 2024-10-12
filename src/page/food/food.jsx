import background from "../../img/2.jpg";
import "./food.scss";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { Button, Form, Input } from "antd";
function Food() {
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
            <Form className="Food_form" layout="vertical">
              <div className="Food_title">Food calculator</div>

              <Form.Item 
              label="Koi Fish pond name: " 
              name="pondName"
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
                  >
                    <Input 
                    placeholder="Enter the total number of koi fish" 
                    />
                  </Form.Item>
                  <Form.Item
                    label="Average weight of koi fish (kg):"
                    name="avgWeight"
                  >
                    <Input placeholder="Enter the average weight of Koi fish " />
                  </Form.Item>
                </div>

                <div className="form-column">
                  <Form.Item 
                  label="Ratio Food (1% - 4%): " 
                  name="foodRatio">
                    <Input placeholder="Enter feed ratio" />
                  </Form.Item>
                  <Form.Item
                    label="Amount of food for the lake (gam):"
                    name="foodAmount"
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
              <Form.Item label="Koi Fish name: " name="koiName">
                <Input placeholder="Enter name of your Koi fish" />
              </Form.Item>
              <div className="form-columns">
                <div className="form-column">
                  <Form.Item
                    label="Length of your Koi fish (cm):"
                    name="length"
                  >
                    <Input placeholder="Enter length of your Koi fish" />
                  </Form.Item>
                  <Form.Item
                    label="Weight of your Koi fish (kg): "
                    name="weight"
                  >
                    <Input placeholder="Enter weight of your Koi fish " />
                  </Form.Item>
                </div>

                <div className="form-column">
                  <Form.Item 
                  label="Ratio Fish Food (1% - 4%):" 
                  name="fishRatio"
                  >
                    <Input 
                    placeholder="Enter ratio fish food" 
                    />
                  </Form.Item>
                  <Form.Item 
                  label="Amount of food for Koi fish ( gam ):" 
                  name="fishAmount"
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
            <Form className="Salt_form" layout="vertical">
              <div className="Salt_title">Salt calculator</div>

              <Form.Item 
              label="Koi fish pond name: "
              name="pondName"
              >
                <Input placeholder="Enter koi fish pond name" />
              </Form.Item>
              <div className="salt-columns">
                <div className="salt-column">
                  <Form.Item
                    label="Amount of salt for the pond ( kg ):"
                    name="saltAmount"
                  >
                    <Input placeholder="Enter Amount of salt for the pond" />
                  </Form.Item>
                  <Form.Item 
                  label="Salt ratio (1% - 5%): " 
                  name="saltRatio">
                    <Input placeholder="Enter salt ratio" />
                  </Form.Item>
                </div>

                <div className="salt-column">
                  <Form.Item
                    label="Volume of the lake ( litre ):"
                    name="volume"
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
