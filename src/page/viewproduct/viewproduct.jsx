import React, { useState, useEffect } from 'react';
import './viewproduct.scss';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import bg from '../../img/background.jpg';
import { Listproduct } from '../../share/listproduct';
import { Button, Modal } from 'antd';
import { Link } from 'react-router-dom';

function Viewproduct() {
    const [visible, setVisible] = useState(false);
    const [pro, setPro] = useState([]);
    const [num, setNum] = useState(1);
    const [cartItems, setCartItems] = useState(() => {

        const storedCart = localStorage.getItem("cartItems");
        return storedCart ? JSON.parse(storedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    const handleOpen = (values) => {
        setVisible(true);
        setPro(values);
    };

    const Ok = () => {
        setVisible(false);
    };

    const handleCancle = () => {
        setVisible(false);
    };

    const handleNumbePlus = () => {
        setNum(num + 1);
    };

    const handleNumbeMinus = () => {
        if (num <= 1) {
            setNum(1);
        } else {
            setNum(num - 1);
        }
    };

    const addToCart = () => {
        const productToAdd = {
            ...pro,
            quantity: num
        };
        setCartItems([...cartItems, productToAdd]); 
        setVisible(false);
    };

    return (
        <>
            <Header />
            <div className='Viewproduct__img'>
                <img src={bg} alt="" />
            </div>

            <div className='Viewproduct__title'>
                <h3>List of Product</h3>
            </div>
            <div className='row Viewproduct__product'>
                {
                    Listproduct.map(product => (
                        <div className='col-md-3 product' key={product.Id}>
                            <img src={product.Image} alt="" />
                            <Button type="secondary" onClick={() => handleOpen(product)}>
                                View product
                            </Button>
                        </div>
                    ))
                }
            </div>

            <Modal open={visible} onCancel={handleCancle} onOk={Ok} footer={null}>
                <div className="modal-content">
                    <div className="modal-image">
                        <img src={pro.Image} alt={pro.Name} />
                    </div>
                    <div className="modal-details">
                        <h3>{pro.Name}</h3>
                        <span className="modal-sku">Product code: {pro.Id}</span>
                        <span className="modal-stock">Status: in stock {pro.StockStatus}</span>
                        <h5 className="modal-price">Price: {pro.Price}</h5>
                        <div className="modal-promotions">
                            <h4>Promotion: sale 20%</h4>
                            <ul>
                                <li>Genuine product commitment</li>
                                <li>Cash on Delivery</li>
                            </ul>
                        </div>
                        <div className='Viewproduct__buy'>
                            <h5>Quantity: </h5>
                            <Button className='Viewproduct__minus' onClick={handleNumbeMinus}>-</Button>
                            <input type="text" value={num} readOnly />
                            <Button className='Viewproduct__plus' onClick={handleNumbePlus}>+</Button>
                        </div>
                        <div className="modal-actions">
                            <Button className="modal-buy-now">BUY NOW</Button>
                            <Button className="modal-add-cart" onClick={addToCart}>ADD TO CART</Button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Footer />
        </>
    );
}

export default Viewproduct;
