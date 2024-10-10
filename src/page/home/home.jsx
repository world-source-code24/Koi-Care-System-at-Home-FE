/* eslint-disable react/jsx-key */

import Carousel from "../../components/carousel/carousel";
import Header from "../../components/header/header";
import './home.scss';
import { Button, Modal } from "antd";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Products } from "../../share/product";
import Footer from "../../components/footer/footer";
import cakoi from "../../img/cakoi.png.jpg"

function HomePage() {

  const [notification, setNotification] = useState(false);
  const [cartItems, setCartItems] = useState(() => {

    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = () => {
    const productToAdd = {...pro,quantity: num};
      setCartItems([...cartItems, productToAdd]); 
      setVisible(false); 
      setNotification(true);

        setTimeout(() => {
            setNotification(false);
        }, 3000);
  };

  const [visible, setVisible]=useState(false);

  
  const [pro,setPro]=useState([]);
    const [num,setNum]=useState(1);

    const handleOpen=(values)=>{
        setVisible(true);
        setPro(values);
    }

    const Ok =()=>{
        setVisible(false);
    }
    
    const handleCancle =()=>{
        setVisible(false);
    }
    
    const handleNumbePlus=()=>{
        setNum(num+1);
    }

    const handleNumbeMinus=()=>{
        
        if(num<=1){
            setNum(1);
        }
        else{
            setNum(num-1);
        }
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
              <Button type="secondary" onClick={()=>handleOpen(product)}>
                View product
              </Button>
          </div>
            ))
          }
        </div>

        <div className="HomePage__viewmore">
          <Link  to="/viewproduct">View More [+]</Link>
        </div>

        {notification && (
            <div className="notification">
                Add successfully!
            </div>
            )}

        <Modal open={visible} onCancel={handleCancle} onOk={Ok} footer={null}>
          <div className="modal-content">
              <div className="modal-image">
                  <img src={pro.Image} alt={pro.Name} />
              </div>
              <div className="modal-details">
                  <h3>{pro.Name}</h3>
                  <span className="modal-sku">Product code: {pro.Id}</span>
                  <span className="modal-stock">Status:in stock {pro.StockStatus}</span>
                  <h5 className="modal-price">Price: {pro.Price}</h5>
                  <div className="modal-promotions">
                      <h4>Promotion:sale 20%</h4>
                      <ul>
                          <li>Genuine product commitment</li>
                          <li>Cash on Delivery</li>
                      </ul>
                  </div>
                  <div className='Viewproduct__buy'>
                      <h5>Quantity: </h5>
                      <p  style={{ cursor: 'pointer' }} onClick={handleNumbeMinus}>-</p>
                      <input type="text" value={num} readOnly />
                      <p  style={{ cursor: 'pointer' }} onClick={handleNumbePlus}>+</p>
                  </div>
                  <div className="modal-actions">
                      <Link type="secondary" to={`/detail/${pro.Id}`}>BUY NOW</Link>
                      <Button className="modal-add-cart" onClick={addToCart}>ADD TO CART</Button>
                  </div>
              </div>
          </div>
      </Modal>
      </div>
      <Footer/>
    </div>
  )
}

export default HomePage;