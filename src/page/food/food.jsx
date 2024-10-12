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
        <div className="Calculator_title">Food and salt Calculator</div>
        <div className="Calculator_Form">
          <div className="Calculator_Food">
            <Form className="Food_form" layout="vertical">
              <div className="Food_title">Food calculator</div>

              <Form.Item label="Koi Fish pond name: " name="pondName">
                <Input placeholder="Enter the name of the koi pond" />
              </Form.Item>
              <div className="form-columns">
                <div className="form-column">
                  <Form.Item label="Total number of Koi fish:" name="totalFish">
                    <Input placeholder="Enter the total number of koi fish" />
                  </Form.Item>
                  <Form.Item
                    label="Average weight of koi fish (kg):"
                    name="avgWeight"
                  >
                    <Input placeholder="Enter the average weight of Koi fish " />
                  </Form.Item>
                </div>

                <div className="form-column">
                  <Form.Item label="Ratio Food (1% - 4%): " name="feedRatio">
                    <Input placeholder="Enter feed ratio" />
                  </Form.Item>
                  <Form.Item label="Amount of food for the lake (gam):" name="feedAmount">
                    <Input placeholder="Enter the amount of food for the pond" />
                  </Form.Item>
                </div>
              </div>

              <Form.Item label="Koi Fish name: " name="koiName">
                <Input placeholder="Enter name of your Koi fish" />
              </Form.Item>
              <div className="form-columns">
                <div className="form-column">
                  <Form.Item label="Length of your Koi fish (cm):" name="length">
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
                  <Form.Item label="Tỉ lệ thức ăn" name="feedRatio">
                    <Input placeholder="Nhập tỉ lệ thức ăn" />
                  </Form.Item>
                  <Form.Item label="Lượng thức ăn cho hồ" name="feedAmount">
                    <Input placeholder="Nhập lượng thức ăn" />
                  </Form.Item>
                </div>
              </div>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Tính toán
                </Button>
              </Form.Item>
            </Form>
          </div>

          {/*Salt Calculator */}
          <div className="Calculator_Salt">
            <Form className="Food_form" layout="vertical">
              <div className="Food_title">Food calculator</div>

              <Form.Item label="Tên hồ nuôi cá koi" name="pondName">
                <Input placeholder="Nhập tên hồ nuôi cá koi" />
              </Form.Item>
              <div className="form-columns">
                <div className="form-column">
                  <Form.Item label="Tổng số cá koi" name="totalFish">
                    <Input placeholder="Nhập tổng số cá koi" />
                  </Form.Item>
                  <Form.Item
                    label="Cân nặng trung bình của cá koi"
                    name="avgWeight"
                  >
                    <Input placeholder="Nhập cân nặng trung bình" />
                  </Form.Item>
                </div>

                <div className="form-column">
                  <Form.Item label="Tỉ lệ thức ăn" name="feedRatio">
                    <Input placeholder="Nhập tỉ lệ thức ăn" />
                  </Form.Item>
                  <Form.Item label="Lượng thức ăn cho hồ" name="feedAmount">
                    <Input placeholder="Nhập lượng thức ăn" />
                  </Form.Item>
                </div>
              </div>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Tính toán
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
