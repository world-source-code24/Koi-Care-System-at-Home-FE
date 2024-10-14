import Header from "../../components/header/header";
import "./list.scss";
import pic from "../../img/3.jpg";
import { Button, Divider, Input, Modal } from "antd";
import { Listkoi } from "../../share/listkoi";
import Footer from "../../components/footer/footer";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
function List() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKoi, setSelectedKoi] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [store, setStore] = useState([]); 
  const [filteredKoi, setFilteredKoi] = useState([]); 

   useEffect(() => {
    const fetchKoi = async () => {
      try {
        const response = await fetch('https://koicaresystemapi.azurewebsites.net/api/user/1/Koi');
        const data = await response.json();

        if (data && data.koi && data.userID.$values) {
          setStore(data.userID.$values); 
          setFilteredKoi(data.userID.$values); 
        } else {
          console.error("Unexpected data format:", data);
          setStore([]); 
          setFilteredKoi([]);
        }
      } catch (error) {
        console.error("Error fetching Koi:", error);
        setStore([]);
        setFilteredKoi([]);
      }
    };

    fetchKoi();
  }, []);

    const handleSearchChange = (e) => {
      const value = e.target.value;
      setSearchTerm(value);
      if (value.trim() === '') {
        setFilteredKoi(store); 
      } else {
        const filtered = store.filter(koi =>
          koi.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredKoi(filtered);
      }
    };

  const showModal = (koi) => {
    setSelectedKoi(koi);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedKoi(null);
  };

  
  // const handleSearchChange = (e) => {
  //   const value = e.target.value;
  //   setSearchTerm(value);
  // };

  // // Lọc danh sách cá Koi
  // const filteredKoi = Listkoi.filter(koi =>
  //   koi.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const notFound = searchTerm && filteredKoi.length === 0; 
  
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
          <Input 
          placeholder="Search name of Koi fish" 
          value={searchTerm} 
          onChange={handleSearchChange}/>
          <Link to="/add">
            <Button type="sencondary" className="add-koi-button">Add New Koi</Button>
          </Link>
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
              <h3>Oops, Your fish is not exist ! Please try again :((</h3>
            </div>
          )}  
        </div>
          
        {/* <Modal
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
        </Modal> */}

        <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
          {selectedKoi && (
            <div className="koi-modal-content">
              <h2 className="koi-modal-title">{selectedKoi.name}</h2>
              <img src={selectedKoi.image} alt={selectedKoi.name} className="koi-modal-image" />
              <p><strong>Length:</strong> {selectedKoi.koi.length}</p>
              <p><strong>Weight:</strong> {selectedKoi.koi.weight}</p>
              <p><strong>Breed:</strong> {selectedKoi.koi.breed}</p>
              <p><strong>Description:</strong> {selectedKoi.koi.description}</p>
            </div>
          )}
        </Modal>
      </div>

      <Footer/>
    </>
  );
}

export default List;
