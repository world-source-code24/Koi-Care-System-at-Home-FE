/* eslint-disable react/jsx-key */
import Carousel from "../../components/carousel/carousel";
import Header from "../../components/header/header";
import './home.scss';
import { Button, Modal } from "antd";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Products } from "../../share/product";
import Footer from "../../components/footer/footer";
import cakoi from "../../img/cakoi.png.jpg"


function HomePage() {
  const[pro,setPro]=useState([]);

  const [visible, setVisible]=useState(false);
  const handleOpen=(values)=>{
    setPro(values);
      setVisible(true);
  }

  const handleOk=()=>{
    setVisible(false);
  }

  const handleCancel=()=>{
    setVisible(false);
  }

  return (
    <div>
      <Header/>
      <Carousel numberOfSlide={1} autoplay={true}/>

      <div className="HomePage">
        <br />
        <div className="row HomePage__Introduce">
          <div className="col-md-6 HomPage__left" >
            <img src={cakoi} alt="" width="90%"/>
          </div>
          <div className="col-md-6 HomPage__right">
            <h1>Royal Koi</h1>
            <div className="border"></div>
            <p>
            Is a web-app that helps users proactively manage and provide the best assessments so that users can take good care of
            Koi fish.
            </p>
            <p>
            In addition, we also provide products that help users take the best care of Koi fish from fish care accessories from
            leading countries in the world such as the US, Japan,... and foods that help increase color and size come from the US,
            Vietnam,... with the aim of supporting users in managing Koi fish ponds at home.
            </p>
          </div>
        </div>
        <br />
        <br />

        <div className="HomePage__body__product">
          <h1>Product</h1>
        </div>
        <div className="HomePage__body__divider"></div>

        <div className="row HomePage__body">
          {
            Products.map(product =>(
              <div className="col-md-3 koi">
              <img src={product.Image} alt="" />
              <br />
              {/* <Link type="secondary">
                View detail
              </Link> */}
              <Button type="secondary" onClick={()=>handleOpen(product)}>
                View product
              </Button>
          </div>
            ))
          }
        </div>

        <div className="HomePage__viewmore">
          <Link  to="">View More [+]</Link>
        </div>

        <Modal
            title="Information of Product"
            open={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <Button key="ok" type="secondary" onClick={handleOk} size="small">
                OK
              </Button>,
            ]}
        >
            <div className='modal__img'>
              <img src={pro.Image} alt="" />
            </div>
            <p> <strong>Id: {pro.Id}</strong> </p>
            <p> <strong>Name: {pro.Name}</strong> </p>
            <p> <strong>Origin: {pro.Origin}</strong> </p>
            <p> <strong>Category: {pro.Category}</strong> </p>
        </Modal>
      </div>
      <Footer/>
    </div>
  )
}

export default HomePage;