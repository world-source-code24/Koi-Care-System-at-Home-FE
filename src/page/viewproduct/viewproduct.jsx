import { useState, useEffect } from 'react';
import './viewproduct.scss';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import bg from '../../img/news.jpg';
import { Button, Input, Modal } from 'antd';
import { Link } from 'react-router-dom';

function Viewproduct() {
    const [visible, setVisible] = useState(false);
    const [pro, setPro] = useState({});
    const [num, setNum] = useState(1);
    const [search, setSearch] = useState('');
    const [store, setStore] = useState([]);
    const [filteredStore, setFilteredStore] = useState([]);
    const [notification, setNotification] = useState(false);

    const [cartItems, setCartItems] = useState(() => {
        const storedCart = localStorage.getItem("cartItems");
        return storedCart ? JSON.parse(storedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://koicaresystemapi.azurewebsites.net/api/Product/get-all');
                const data = await response.json(); // chuyển đổi dữ liệu từ json sang java

 
                if (data && data.product && data.product.$values) {
                    setStore(data.product.$values);
                    setFilteredStore(data.product.$values); 
                } else {
                    console.error("Unexpected data format:", data);
                    setStore([]); 
                    setFilteredStore([]);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setStore([]); 
                setFilteredStore([]);
            }
        };

        fetchProducts();
    }, []);

    const handleOpen = (product) => {
        setVisible(true);
        setPro(product);
    };

    const handleCancel = () => {
        setVisible(false);
        setNum(1); 
    };

    const handleNumPlus = () => {
        setNum(num + 1);
    };

    const handleNumMinus = () => {
        if (num > 1) {
            setNum(num - 1);
        }
    };

    const handleSearch = () => {
        if (search.trim() === '') {
            setFilteredStore(store); 
        } else {
            const filtered = store.filter(product =>
                product.name.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredStore(filtered);
        }
        setSearch('');
    };

    const addToCart = () => {
        const existingItem = cartItems.find(item => item.productId === pro.productId);
        if (existingItem) {
            const updatedCartItems = cartItems.map(item =>
                item.productId === pro.productId ? { ...item, quantity: item.quantity + num } : item
            );
            setCartItems(updatedCartItems);
        } else {
            const productToAdd = {
                ...pro,
                quantity: num
            };
            setCartItems([...cartItems, productToAdd]);
        }
        setVisible(false);
        setNum(1);
        setNotification(true);
        setTimeout(() => {
            setNotification(false);
        }, 1000);
    };

    return (
        <>
            <Header />
            <div className='Viewproduct__img'>
                <img src={bg} alt="" />
            </div>
            <div className='Viewproduct__title'>
                <h3>List of Products</h3>
            </div>
            <div className='Viewproduct__search'>
                <Input 
                    placeholder='Search Product'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button type='secondary' onClick={handleSearch}>Search</Button>
            </div>
            <div className='row Viewproduct__product'>
                {filteredStore.map(product => (
                    <div className='col-md-3 product' key={product.productId}>
                        <img src={product.image} alt={product.name} />
                        <Button type="secondary" onClick={() => handleOpen(product)}>
                            View Product
                        </Button>
                    </div>
                ))}
            </div>
            {notification && (
                <div className="notification">Added successfully!</div>
            )}
            <Modal open={visible} onCancel={handleCancel} footer={null}>
                <div className="modal-content">
                    <div className="modal-image">
                        <img src={pro.image} alt={pro.name} />
                    </div>
                    <div className="modal-details">
                        <h3>{pro.name}</h3>
                        <span className="modal-sku">Product code: {pro.productId}</span>
                        <p>{pro.productInfo}</p>
                        <p>Stock :{pro.stock} products</p>
                        <div className="modal-promotions">
                            <ul>
                                <li>Genuine product commitment</li>
                                <li>Cash on Delivery</li>
                            </ul>
                        </div>

                        <h5 className="modal-price">Price: {pro.price}.000 VND</h5>

                        <div className='Viewproduct__buy'>
                            <h5>Quantity: </h5>
                            <p style={{ cursor: 'pointer' }} onClick={handleNumMinus}>-</p>
                            <input type="text" value={num} readOnly />
                            <p style={{ cursor: 'pointer' }} onClick={handleNumPlus}>+</p>
                        </div>
                        
                        <div className="modal-actions">
                            <Link to={`/detail/${pro.productId}`}>BUY NOW</Link>
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
