import { Form, Select, Spin } from "antd";
import "./expert.scss"
import Header from "../../components/header/header";
import axios from "axios";
import { useEffect, useState } from "react";
const { Option } = Select;
function Expert() {
    const [ponds, setPonds] = useState([]);
    const [selectedPond, setSelectedPond] = useState("All pond");
    const [koiWeight, setKoiWeight] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPonds = async () => {
          try {
            const response = await axios.get(
              "https://koicaresystemapi.azurewebsites.net/api/Pond/Show-All-Ponds"  // API để lấy danh sách ponds
            );
            setPonds(response.data.listPond.$values);
          } catch (error) {
            console.error("Error fetching ponds", error);
          }
        };
        fetchPonds();
      }, []);
    
        // const lấy tổng cân nặng 
        const fetchAllKoiWeights = async () => {
          let totalWeight = 0;
          for (const pond of ponds) {
            try {
              const response = await axios.get(
                `https://koicaresystemapi.azurewebsites.net/api/pond/${pond.pondId}/Koi` //API lấy danh sách cá koi trong ponds
              );
              const koiList = response.data.$values;
              const pondWeight = koiList.reduce((sum, koi) => sum + koi.weight, 0);
              totalWeight += pondWeight;
            } catch (error) {
              console.error(`Error fetching koi data for pond ${pond.pondId}`, error);
            }
          }
          return totalWeight;
        };
    
      // Const chọn một hồ hoặc tất cả hồ
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
            const totalWeight = koiList.reduce((sum, koi) => sum + koi.weight, 0);
            setKoiWeight(totalWeight);
          } catch (error) {
            console.error("Error fetching koi data", error);
          }
          setLoading(false);
        }
      };
    return (
      <>
      <Header />
      <div className="exp_background_form">
        <div className="exp_container">
          <div className="exp_title">Food Calculator</div>
            <div className="exp_form_wrapper">
               <div className="exp_left_form">
                 <Form layout="vertical">
                   <Form.Item label="Name: ">
                    <Select
                            defaultValue="All ponds"
                            onChange={handlePondChange}
                            style={{ width: 200 }}
                        >
                            <Option value="All ponds">
                            All ponds
                            </Option>
                            {ponds.map((pond) => (
                                <Option key={pond.pondId} value={pond.pondId}>
                                {pond.name}
                                </Option>
                            ))}
                        </Select>
                   </Form.Item>
                   <Form.Item label="Total koi weight: ">
                        {loading ? <Spin /> : <p>{koiWeight} g</p>}
                        </Form.Item>
                 </Form>
               </div>     
            </div>
        </div>
      </div>
      </>
    )
}
export default Expert;