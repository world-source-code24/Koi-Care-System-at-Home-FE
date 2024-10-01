import React, { useState, useEffect } from 'react';
import './cart.scss';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import bg from '../../img/background.jpg';

function Cart() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
            setCartItems(JSON.parse(storedCartItems));
        }
    }, []);

    const handleRemove = (id) => {
        const updatedCartItems = cartItems.filter(item => item.Id !== id);
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    };

    const getTotalPrice = () => {
        return cartItems.reduce((acc, item) => acc + item.Price * item.quantity, 0);
    };

    return (
        <>
            <Header />

            <div className="Cart__img">
                <img src={bg} alt="" />
            </div>

            <div className="cart__container">
                <h3>Your Cart</h3>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <>
                        <div className="cart__items">
                            {cartItems.map((item, index) => (
                                <div className="cart__item" key={index}>
                                    <img src={item.Image} alt={item.Name} />
                                    <div className="cart__item__details">
                                        <h4>{item.Name}</h4>
                                        <p>Product code: {item.Id}</p>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Price: {item.Price}</p>
                                    </div>
                                    <button onClick={() => handleRemove(item.Id)}>✖</button>
                                </div>
                            ))}
                        </div>
                        
                        <div className="cart__summary">
                            <span>Total:</span>
                            <span>{getTotalPrice()} VND</span>
                        </div>

                        <div className="cart__checkout">
                            <button>Checkout</button>
                        </div>
                    </>
                )}
            </div>
            
            <Footer />
        </>
    );
}


export default Cart;
