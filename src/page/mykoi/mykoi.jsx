import Header from "../../components/header/header";
import "./mykoi.scss";
import koiwall from "../../img/koi2.jpg";
import { DownCircleOutlined, FilterOutlined, PlusCircleOutlined, UploadOutlined} from "@ant-design/icons";
import { useState } from "react";
import { Button, Divider, Form, Image, Input, Modal, Select, Upload } from "antd";

function mykoi() {
  const {Option} = Select;
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái modal
  const [isClicked, setIsClicked] = useState(false); 
  const [sortValue, setSortValue] = useState("In pond since (newest first)");
  const [pondValue, setPondValue] = useState("All");
  const [sexValue, setSexValue] = useState("All");
  const [stateValue, setStateValue] = useState("All");

  // image
  const [image, setImage] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // Hàm cho Down Icon
  const scrollToContent = () => {
    const contentSection = document.getElementById("content-section");
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: "smooth" }); 
    }
    setIsClicked(true); 
    setTimeout(() => setIsClicked(false), 300); 
  };

  // Các hàm cho Sort
  const handleSortChange = (value) => {
    setSortValue(value);
  };

  const handlePondChange = (value) => {
    setPondValue(value);
  };

  const handleSexChange = (value) => {
    setSexValue(value);
  };

  const handleStateChange = (value) => {
    setStateValue(value);
  };

    // Modal
    const showModal = () => {
      setIsModalVisible(true);
    };

    const handleOk = () => {
      setIsModalVisible(false);
      setKoiCount(koiCount + 1); 
    };
  
    const handleCancel = () => {
      setIsModalVisible(false);
    };

    // Image
    const handleImageUpload = (file) => {
      setImage(URL.createObjectURL(file));
      return false;
    }; 

  const koiCount = 0; // Bạn có thể cập nhật giá trị này dựa trên số lượng cá Koi hiện có
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

      <div className="my_divider">
        <Divider/>
      </div>

      <div className="my_sort_container">
        <div className="my_sidebar">
          <div className="my_icon_filter">
            <FilterOutlined className="filter_icon"/>
          </div>
          <Divider />
          
          {/* Dropdown for Sort */}
          {/*Sort By: */}
          <div className="sort_dropdown">
                <label>Sort by: </label> 
                <Select value={sortValue} onChange={handleSortChange}>
                  <Option value="In pond since (newest first)">
                    In pond since (newest first)
                  </Option>
                  <Option value="In pond since (oldest first)">
                    In pond since (oldest first)
                  </Option>
                  <Option value="Name (A-Z)">Name (A-Z)</Option>
                  <Option value="Name (Z-A)">Name (Z-A)</Option>
                  <Option value="Length (descending)">Length (descending)</Option>
                  <Option value="Length (ascending)">Length (ascending)</Option>
                  <Option value="Age (descending)">Age (descending)</Option>
                  <Option value="Age (ascending)">Age (ascending)</Option>
                </Select>
          </div>
              
          <Divider/>

          {/*Pond: */}
          <div className="sort_dropdown">
            <label>Pond: </label>
            <Select value={pondValue} onChange={handlePondChange}>
              <Option>All</Option>
            </Select>
          </div>

          <Divider/>

          {/*Sex: */}
          <div className="sort_dropdown">
            <label>Sex: </label>
            <Select>
              <Option>All</Option>
              <Option>Male</Option>
              <Option>Female</Option>
              <Option>Not specified</Option>
            </Select>
          </div>  

          <Divider/>

          {/*State of life: */}
          <div className="sort_dropdown">
            <label>State of life: </label>
            <Select>
              <Option>All</Option>
              <Option>Alive</Option>
              <Option>Dead</Option>
            </Select>
          </div>  

        </div>

        {/*Content*/}
        <div className="my_content">
        <h5>Your koi here</h5>
        <p>You didn't add any koi yet. Add a koi by tapping on the plus-symbol</p>
        
        {/* Symbol and Koi */}
        <div className="add-koi-container">
          <PlusCircleOutlined className="plus-icon" onClick={showModal} />
          <span className="koi-count">Koi: {koiCount}</span>
        </div>

        {/*Modal add*/}
        <Modal
         title="Add new Koi"
         visible={isModalVisible}
         onOk={handleOk}
         onCancel={handleCancel}
        >
            <Form layout="vertical">
              <div className="form-columns">
                <div className="form-column">
                  <Form.Item label="koi_ava" required>
                  <Upload beforeUpload={handleImageUpload}>
                    <Button icon={<UploadOutlined />}>Upload Image</Button>
                  </Upload>

                  {image && (
                    <div>
                      <img src={image} alt="Uploaded" width="20%" />
                    </div>
                  )}
                  </Form.Item>

                  <Form.Item label="Physique: " required>
                    <Select>
                      <Option>Slim</Option>
                      <Option>Normal</Option>
                      <Option>Corpulent</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label="Length: " required>
                    <Input placeholder="Enter length of your Koi fish " />
                  </Form.Item>

                  <Form.Item label="Sex:" required>
                    <Select>
                    <Option>Not specified</Option>
                    <Option>Male</Option>
                    <Option>Female</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label="Pond: " required>
                    <Input placeholder="Enter pond" />
                  </Form.Item>

                  <Form.Item label="Breeder: " required>
                    <Input placeholder="Enter Breeder" />
                  </Form.Item>
                </div>

                <div className="form-column">
                  <Form.Item label="Koi fish name:" required>
                    <Input placeholder="Enter name of your Koi fish" />
                  </Form.Item>

                  <Form.Item label="Age: " required>
                    <Select>
                      <Option>Not specified</Option>
                      <Option>0 year</Option>
                      <Option>1 year</Option>
                      <Option>2 years</Option>
                      <Option>3 years</Option>
                      <Option>4 years</Option>
                      <Option>5 years</Option>
                      <Option>6 years</Option>
                      <Option>7 years</Option>
                      <Option>8 years</Option>
                      <Option>9 years</Option>
                      <Option>10 years</Option>
                      <Option>11 years</Option>
                      <Option>12 years</Option>
                      <Option>13 years</Option>
                      <Option>14 years</Option>
                      <Option>15 years</Option>
                      <Option>16 years</Option>
                      <Option>17 years</Option>
                      <Option>18 years</Option>
                      <Option>19 years</Option>
                      <Option>20 years</Option>
                      <Option>21 years</Option>
                      <Option>22 years</Option>
                      <Option>23 years</Option>
                      <Option>24 years</Option>
                      <Option>25 years</Option>
                      <Option>26 years</Option>
                      <Option>27 years</Option>
                      <Option>28 years</Option>
                      <Option>29 years</Option>
                      <Option>30 years</Option>
                      <Option>31 years</Option>
                      <Option>32 years</Option>
                      <Option>33 years</Option>
                      <Option>34 years</Option>
                      <Option>35 years</Option>
                      <Option>36 years</Option>
                      <Option>37 years</Option>
                      <Option>38 years</Option>
                      <Option>39 years</Option>
                      <Option>40 years</Option>
                      <Option>41 years</Option>
                      <Option>42 years</Option>
                      <Option>43 years</Option>
                      <Option>44 years</Option>
                      <Option>45 years</Option>
                      <Option>46 years</Option>
                      <Option>47 years</Option>
                      <Option>48 years</Option>
                      <Option>49 years</Option>
                      <Option>50 years</Option>
                      <Option>51 years</Option>
                      <Option>52 years</Option>
                      <Option>53 years</Option>
                      <Option>54 years</Option>
                      <Option>55 years</Option>
                      <Option>56 years</Option>
                      <Option>57 years</Option>
                      <Option>58 years</Option>
                      <Option>59 years</Option>
                      <Option>60 years</Option>
                      <Option>61 years</Option>
                      <Option>62 years</Option>
                      <Option>63 years</Option>
                      <Option>64 years</Option>
                      <Option>65 years</Option>
                      <Option>66 years</Option>
                      <Option>67 years</Option>
                      <Option>68 years</Option>
                      <Option>69 years</Option>
                      <Option>70 years</Option>
                      <Option>71 years</Option>
                      <Option>72 years</Option>
                      <Option>73 years</Option>
                      <Option>74 years</Option>
                      <Option>75 years</Option>
                      <Option>76 years</Option>
                      <Option>77 years</Option>
                      <Option>78 years</Option>
                      <Option>79 years</Option>
                      <Option>80 years</Option>
                      <Option>81 years</Option>
                      <Option>82 years</Option>
                      <Option>83 years</Option>
                      <Option>84 years</Option>
                      <Option>85 years</Option>
                      <Option>86 years</Option>
                      <Option>87 years</Option>
                      <Option>88 years</Option>
                      <Option>89 years</Option>
                      <Option>90 years</Option>
                      <Option>91 years</Option>
                      <Option>92 years</Option>
                      <Option>93 years</Option>
                      <Option>94 years</Option>
                      <Option>95 years</Option>
                      <Option>96 years</Option>
                      <Option>97 years</Option>
                      <Option>98 years</Option>
                      <Option>99 years</Option>
                      <Option>100 years</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label="Weight:" required>
                    <Input placeholder="Enter weight of your Koi fish" />
                  </Form.Item>

                  <Form.Item label="Variety: ">
                    <Input placeholder="Enter Notes" />
                  </Form.Item>

                  <Form.Item label="In pond since: " required>
                    <Input placeholder="Enter Price" />
                  </Form.Item>

                  <Form.Item label="Purchase price: ">
                    <Input placeholder="Enter Additional Info"  />
                  </Form.Item>
                </div>
              </div>
            </Form>
        </Modal>
        {previewImage && (
            <Image
              wrapperStyle={{
                display: "none",
              }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
      </div>
      </div>
    </>
  );
}

export default mykoi;
