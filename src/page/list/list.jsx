import Header from "../../components/header/header";
import "./list.scss";
import pic from "../../img/6.jpg";
import { Button, Divider, Input, Modal } from "antd";
import { Listkoi } from "../../share/listkoi";
import Footer from "../../components/footer/footer";
import { useState } from "react";
function List() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKoi, setSelectedKoi] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notFound, setNotFound] = useState(false);

  const showModal = (koi) => {
    setSelectedKoi(koi);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedKoi(null);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setNotFound(value && filteredKoi.length === 0); // Kiểm tra nếu không có kết quả
  };

  // Lọc danh sách cá Koi dựa trên searchTerm
  const filteredKoi = Listkoi.filter(koi =>
    koi.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
      <Header />
      <div className="List_page">
        <div className="List_background">
          <img src={pic} alt="" />  
        </div>

        <div className="List_title">List of Koi</div>

        <div className="List_search">
          <Button type="sencondary">Search</Button>
          <Input placeholder="Search name of Koi fish" value={searchTerm} onChange={handleSearchChange}/>
        </div>

        <div className="List_divider">
            <Divider/>
        </div>
    
        <div className="row List-body">
          {
            filteredKoi.map(koi => (
              <div className="col-md-2" key={koi.koiID}>
                <div className="koi-card">
                  <img src={koi.Image} alt={koi.name} className="koi-image" />
                  
                  <Button type="secondary" onClick={() => showModal(koi)} >
                    {koi.name}
                  </Button> 
                </div>
              </div>
            ))
          }

            {notFound && (
            <div className="not-found-message">
              <h3>Cá Koi của bạn không được tìm thấy.</h3>
            </div>
          )}  
        </div>
          
        <Modal
          visible={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          {selectedKoi && (
            <div className="koi-modal-content">
              <h2 className="koi-modal-title">{selectedKoi.name}</h2> 
              <img
                src={selectedKoi.Image}
                alt={selectedKoi.name}
                className="koi-modal-image"
              />
              <p><strong>Length:</strong> {selectedKoi.Length}</p>
              <p><strong>Weight:</strong> {selectedKoi.Weight}</p>
              <p><strong>Breed:</strong> {selectedKoi.Breed}</p>
              <p><strong>Describe:</strong> {selectedKoi.Describe}</p>
            </div>
          )}
        </Modal>

      </div>

      <Footer/>
    </>
  );
}

export default List;
