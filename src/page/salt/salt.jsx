import "./salt.scss";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { Form, Select, Slider } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
const { Option } = Select;
function Salt() {
  const [ponds, setPonds] = useState([]);
  const [totalVolume, setTotalVolume] = useState(0);
  const [currentConcentration, setCurrentConcentration] = useState(0);
  const [disiredConcentration, setDisiredConcentration] = useState(0);
  const [waterChangeAmount, setWaterChangeAmount] = useState(0);

  useEffect(() => {
    const fetchPonds = async () => {
      try {
        const accID = localStorage.getItem("userId");
        const response = await axios.get(
          `https://koicaresystemapi.azurewebsites.net/api/Show-All-Ponds-UserID/${accID}`
        );
        setPonds(response.data.listPond["$values"]);
        console.log(response.data.listPond["$values"]);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách hồ", error);
      }
    };
    fetchPonds();
  }, []);

  const handlePondChange = async (pondId) => {
    if (pondId === "All ponds") {
      const total = ponds.reduce((sum, pond) => sum + pond.volume, 0);
      setTotalVolume(total);
    } else {
      try {
        const response = await axios.get(
          `https://koicaresystemapi.azurewebsites.net/api/Show-Specific-Pond/${pondId}`
        );
        setTotalVolume(response.data.pond.volume);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin hồ", error);
      }
    }
  };

  const waterChangePercent = Math.round(
    (waterChangeAmount / totalVolume) * 100
  );

  const amountOfSalt =
    disiredConcentration > currentConcentration
      ? (totalVolume * (disiredConcentration - currentConcentration)).toFixed(2)
      : 0;

  const perWaterChange = (waterChangeAmount * disiredConcentration).toFixed(2);
  return (
    <>
      <Header />
      <div className="salt_background_form">
        <div className="salt_container">
          <div className="salt_title">Salt Calculator</div>

          <div className="salt_form-wrapper">
            {/*left-form*/}
            <div className="salt_left_form">
              <Form layout="vertical">
                <Form.Item label="Name:">
                  <Select
                    defaultValue="All ponds"
                    onChange={handlePondChange}
                    style={{ width: 200 }}
                  >
                    <Option value="All ponds">All ponds</Option>
                    {ponds.map((pond) => (
                      <Option key={pond.pondId} value={pond.pondId}>
                        {pond.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="Total Volume:">
                  <div>{totalVolume} l</div>
                </Form.Item>

                <Form.Item
                  label={`Current concentration: ${currentConcentration}%`}
                  className="salt_current"
                >
                  <Slider
                    min={0}
                    max={2}
                    step={0.01}
                    value={currentConcentration}
                    onChange={setCurrentConcentration}
                    tooltipVisible
                  />
                </Form.Item>

                <Form.Item
                  label={`Disired concentration: ${disiredConcentration}%`}
                  className="salt_disired"
                >
                  <Slider
                    min={0}
                    max={2}
                    step={0.01}
                    value={disiredConcentration}
                    onChange={setDisiredConcentration}
                    tooltipVisible
                  />
                </Form.Item>

                <Form.Item
                  label={`Water change: ${waterChangeAmount} l (${waterChangePercent}%)`}
                >
                  <Slider
                    min={0}
                    max={totalVolume}
                    step={8}
                    value={waterChangeAmount}
                    onChange={setWaterChangeAmount}
                    tooltipVisible
                  />
                </Form.Item>
              </Form>
            </div>

            {/*Right form*/}
            <div className="salt_right_form">
              <div className="salt_disclaimer">
                <h3>Disclaimer</h3>
                <p>
                  Only add pure salt without iodine to the water! Too high of a
                  salt concentration can be damaging to the koi. If you are
                  unsure, please talk to a veterinarian. For fighting diseases
                  and algae or for taking precautions a concentration of 0.5 %
                  is recommended.
                </p>
              </div>
            </div>
          </div>
          <div className="salt_result">
            <div className="result_item">
              <span>Amount of salt: </span>
              <span>{amountOfSalt} kg</span>
            </div>
            <div className="result_item">
              <span>Per water change (refill): </span>
              <span>{perWaterChange} kg</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Salt;
