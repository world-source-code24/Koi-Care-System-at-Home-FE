import { Button, Divider, Form, InputNumber, message, Select, Spin } from "antd";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import "./food.scss";
import { useEffect, useState } from "react";
import axios from "axios";
const { Option } = Select;

function Food() {
  const [ponds, setPonds] = useState([]);
  const [selectedPond, setSelectedPond] = useState("All pond");
  const [koiWeight, setKoiWeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [growth, setGrowth] = useState("low");
  const [minTemp, setMinTemp] = useState("");
  const [maxTemp, setMaxTemp] = useState("");
  const [isEditingTemp, setIsEditingTemp] = useState(false);
  const [advice, setAdvice] = useState("");
  const [recommendFood, setRecommendFood] = useState("");

   {/*Validate input water*/}
  const handleMinTempChange = (value) => {
    if (value < 0 || !Number.isInteger(value)) {
      message.error("Please enter a positive integer value only.");
    } else {
      setMinTemp(value);
    }
  };
  
  const handleMaxTempChange = (value) => {
    if (value < 0 || !Number.isInteger(value)) {
      message.error("Please enter a positive integer value only.");
    } else {
      setMaxTemp(value);
    }
  };

  useEffect(() => {
    const fetchPonds = async () => {
      try {
        const accId = localStorage.getItem("userId");
        const response = await axios.get(
          `https://koicaresystemapi.azurewebsites.net/api/Show-All-Ponds-UserID/${accId}`
        );
        setPonds(response.data.listPond["$values"]);
      } catch (error) {
        console.error("Error fetching ponds list", error);
      }
    };
    fetchPonds();
  }, []);

  // function to fetch total weight
  const fetchAllKoiWeights = async () => {
    let totalWeight = 0;
    for (const pond of ponds) {
      try {
        const response = await axios.get(
          `https://koicaresystemapi.azurewebsites.net/api/pond/${pond.pondId}/Koi`
        );
        const koiList = response.data.$values;
        const pondWeight = koiList.reduce((sum, koi) => sum + koi.weight, 0);
        totalWeight += pondWeight;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error(`Data for pond ${pond.pondId} not found.`);
        } else {
          console.error(`Error fetching koi data for pond ${pond.pondId}`, error);
        }
      }
    }
    return totalWeight;
  };

  // Function to select a pond or all ponds
  const handlePondChange = async (value) => {
    setSelectedPond(value);
    if (value === "All ponds") {
      setLoading(true);
      const totalWeight = await fetchAllKoiWeights();
      setKoiWeight(totalWeight);
      setLoading(false);
    } else {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://koicaresystemapi.azurewebsites.net/api/pond/${value}/Koi`
        );
        const koiList = response.data.$values;
  
        if (koiList.length === 0) {
          // If the pond has no koi, set koiWeight = 0 and show a message
          setKoiWeight(0);
          console.warn("This pond currently has no koi.");
        } else {
          // Calculate total koi weight
          const totalWeight = koiList.reduce((sum, koi) => sum + koi.weight, 0);
          setKoiWeight(totalWeight);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Handle 404 error - pond has no koi
          setKoiWeight(0);
          console.warn("This pond currently has no koi.");
        } else {
          console.error("Error fetching koi data", error);
        }
      }
      setLoading(false);
    }
  };

  const handleSaveTemperature = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://koicaresystemapi.azurewebsites.net/api/Calculator/food-calculator?pondId=${selectedPond}&growthLevel=${growth}&minTemp=${minTemp}&maxTemp=${maxTemp}`
      );
      setRecommendFood(response.data.recommendFood);
      setAdvice(response.data.adive); // Save "adive" from API into advice state
    } catch (error) {
      console.error("Error fetching food recommendation", error);
    }
    setLoading(false);
    setIsEditingTemp(false);
  };  

  const getAdviceForTemperature = () => {
    if (minTemp >= 6 && maxTemp <= 8) {
      return (
        <p>
          The food amount should be given to koi <strong>every 2-3 days</strong>.
          If the temperature is below 6°C, stop feeding! In the 6-8°C range, the growth targets <strong>medium</strong> and <strong>high</strong> are not selectable due to reduced koi metabolism.
        </p>
      );
    } else if (minTemp >= 9 && maxTemp <= 12) {
      return (
        <p>
          The food amount should be split into <strong>2-3 feedings per day</strong>. In the
          9-12°C range, the growth targets <strong>medium</strong> and <strong>high</strong> are not selectable due to reduced koi metabolism.
        </p>
      );
    } else if (minTemp >= 13 && maxTemp <= 16) {
      return (
        <p>
          The food amount should be split into <strong>3-5 feedings per day</strong> to improve koi ingestion.
        </p>
      );
    } else if (minTemp >= 17 && maxTemp <= 20) {
      return (
        <p>
          The food amount should be split into <strong>4-6 feedings per day</strong> to improve koi ingestion.
        </p>
      );
    } else if (minTemp >= 21 && maxTemp <= 28) {
      return (
        <p>
          The food amount should be split into <strong>4-8 feedings per day</strong> to improve koi ingestion. Feeding above 28°C is not recommended!
        </p>
      );
    } else {
      return <p>Please enter a valid temperature range to display recommendations.</p>;
    }
  };
  
  return (
    <>
      <Header />
      <div className="food_background_form">
        <div className="food_container">
          <div className="food_title">Food Calculator</div>
          <div className="food_divi">
            <Divider />
          </div>
          <div className="food_form_wrapper">
            {/*Left-form*/}
            <div className="food_left_form">
              <Form layout="vertical">
                <Form.Item label="Name: ">
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
                <Form.Item label="Total koi weight: ">
                  {loading ? <Spin /> : koiWeight === 0 ? (
                    <p>This pond currently has no koi.</p>
                  ) : (
                    <p>{koiWeight} g</p>
                  )}
                </Form.Item>

                {/*Desired Growth*/}
                <Form.Item label="Desired Growth:">
                  <div className="growth-buttons">
                    <Button
                      type={growth === "low" ? "primary" : "default"}
                      onClick={() => setGrowth("low")}
                    >
                      Low
                    </Button>
                    <Button
                      type={growth === "medium" ? "primary" : "default"}
                      onClick={() => setGrowth("medium")}
                    >
                      Medium
                    </Button>
                    <Button
                      type={growth === "high" ? "primary" : "default"}
                      onClick={() => setGrowth("high")}
                    >
                      High
                    </Button>
                  </div>
                </Form.Item>

                {/* Water Temperature */}
                <Form.Item label="Water Temperature (°C):">
                  {isEditingTemp ? (
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <InputNumber
                      placeholder="Minimum Temperature"
                      value={minTemp}
                      onChange={handleMinTempChange}
                      min={0}
                      precision={0}
                      style={{ width: "25%" }}
                    />
                    <InputNumber
                      placeholder="Maximum Temperature"
                      value={maxTemp}
                      onChange={handleMaxTempChange}
                      min={0}
                      precision={0}
                      style={{ width: "25%" }}
                    />
                    <div className="button_set" >
                      <Button type="primary" onClick={handleSaveTemperature} style={{ backgroundColor: "red", color: "white" }}>Save</Button>
                      <Button className="btn_cancel" onClick={() => setIsEditingTemp(false)} style={{ backgroundColor: "red", color: "white" }}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p>{minTemp} - {maxTemp} °C</p>
                    <Button onClick={() => setIsEditingTemp(true)} style={{ backgroundColor: "red", color: "white", width: "100px" }}>Edit</Button>
                  </div>
                )}
                </Form.Item>
              </Form>
            </div>

            {/*Right-form: Feeding information */}
            <div className="food_right_form">
              <h3>Feeding Information</h3>
              {getAdviceForTemperature()}
            </div>
          </div>

          <div className="recommend_amount_section">
            {loading ? (
              <Spin />
            ) : (
              <>
                <p>Recommended food amount:</p>
                <p className="amount-value">
                {parseFloat(recommendFood).toFixed(2)} g
                </p>
                {advice && (
                  <div className="advice-section">
                    <h4>Advice: </h4>
                    <p>{advice}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Food;
