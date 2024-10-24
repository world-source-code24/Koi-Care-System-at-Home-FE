import React, { useState, useEffect } from 'react';
import './cart.scss';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import bg from '../../img/news.jpg';
import { Link } from 'react-router-dom';

function Cart() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
            setCartItems(JSON.parse(storedCartItems));
        }
    }, []);

    const handleRemove = (indexToRemove) => {
        const updatedCartItems = cartItems.filter((_, index) => index !== indexToRemove);
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    };

    const getTotalPrice = () => {
        return cartItems.reduce((acc, item) => {
            const price = item.price ? (typeof item.price === 'number' ? item.price : parseFloat(item.price.toString().replace(/,/g, ''))) : 0;
            return acc + price * (item.quantity || 1);
        }, 0);
    };

    return (
        <>
            <Header />
            <div className="Cart__img">
                <img src={bg} alt="Background" />
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
                                    <img src={item.image} alt={item.name} />
                                    <div className="cart__item__details">
                                        <h4>{item.name}</h4>
                                        {/* <p>Product code: {item.Id}</p> */}
                                        <p>Quantity: {item.quantity || 1}</p>
                                        <p>Price: {item.price ? item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 'N/A'}.000 VND</p>
                                    </div>
                                    <button onClick={() => handleRemove(index)}>✖</button>
                                </div>
                            ))}
                        </div>
                        <div className="cart__summary">
                            <span>Total:</span>
                            <span>{getTotalPrice().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}.000 VND</span>
                        </div>
                        <Link to="/viewproduct">Continue shopping</Link>
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
