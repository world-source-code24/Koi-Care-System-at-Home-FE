import Header from "../../components/header/header";
import "./mykoi.scss";
import koiwall from "../../img/koi2.jpg";
import { DownCircleOutlined} from "@ant-design/icons";
import { useState } from "react";

function mykoi() {
  const [isClicked, setIsClicked] = useState(false); // Trạng thái nhấn chuột

  // Hàm cuộn xuống phần nội dung
  const scrollToContent = () => {
    const contentSection = document.getElementById("content-section");
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: "smooth" }); // Cuộn xuống mượt mà
    }
    setIsClicked(true); // Đặt trạng thái nhấn chuột thành true
    setTimeout(() => setIsClicked(false), 300); // Trở lại trạng thái mặc định sau 300ms
  };
  return (
    <>
      <Header />
      {/*Phần Head */}
      <div className="my_wall">
        <img src={koiwall} alt="Royal Koi" />
        <div className="overlay">
          <h1>Royal Koi</h1>
          <p>Let us help you care for your koi fish.</p>
          <DownCircleOutlined className={`down-icon ${isClicked ? "clicked" : ""}`} 
            onClick={scrollToContent} /> 
        </div>
      </div>

      <div className="my_title">
          <h1>My Koi </h1>
      </div>

    </>
  );
}

export default mykoi;
