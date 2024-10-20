import { Form, Select } from "antd";
import Header from "../../components/header/header";
import "./food.scss";
import { useEffect, useState } from "react";

const { Option } = Select;
function Food() {

  const [ponds, setPonds] = useState([]); // State chứa danh sách các hồ
  const [selectedPonds, setSelectedPonds] = useState('All ponds'); // State chứa các hồ đã được chọn
  const [totalWeight, setTotalWeight] = useState(0);

 useEffect(() => {
    // Lấy dữ liệu ao ban đầu
    const fetchPondData = async () => {
      try {
        const response = await fetch(
          `https://koicaresystemapi.azurewebsites.net/api/Pond/Show-All-Ponds`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch pond data');
        }

        const data = await response.json();
        if (data && data.listPond && data.listPond.$values) {
          setPondDataList(data.listPond.$values);
        } else {
          console.error('Unexpected data format:', data);
          setPondDataList([]);
        }
      } catch (error) {
        console.error('Error fetching pond data:', error);
        setPondDataList([]);
      }
    };

    fetchPondData();
  }, []);

  const handleSelectChange = (pondId) => {
    if (pondId === 'All ponds') {
      // Khi chọn All ponds, reset lại totalWeight
      setTotalWeight(0); // Có thể điều chỉnh theo logic tổng cho tất cả ponds nếu cần
      setSelectedPond('All ponds');
    } else {
      const selectedPondData = pondDataList.find(pond => pond.pondId === pondId);
      setSelectedPond(selectedPondData.name);
      calculateTotalKoiWeight(selectedPondData);
    }
  };

  return (
    <>
      <Header />
      <div className="food_background_form"></div>
      <div className="food_container">
        <div className="food_left_form">
          <Form layout="vertical">
            <Form.Item label="Name: ">
             
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
}

export default Food;
