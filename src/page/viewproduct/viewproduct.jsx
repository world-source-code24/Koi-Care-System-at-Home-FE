import { useState, useEffect } from 'react';
import './viewproduct.scss';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import bg from '../../img/news.jpg';
import { Listproduct } from '../../share/listproduct';
import { Button, Input, Modal } from 'antd';
import { Link } from 'react-router-dom';

function Viewproduct() {
    const [visible, setVisible] = useState(false);
    const [pro, setPro] = useState({});
    const [num, setNum] = useState(1);
    const [search, setSearch]=useState('');
    const [store,setStore]=useState([]);
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
                const response = await fetch('https://koicaresystemapi.azurewebsites.net/api/products'); // Link API của bạn
                const data = await response.json();
                setStore(data); // Lưu danh sách sản phẩm vào state 'store'
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
    
        fetchProducts();
    }, []);
    

    const handleOpen = (product) => {
        setVisible(true);
        setPro(product);
    };

    // const Ok = () => {
    //     setVisible(false);
    // };

    const handleCancle = () => {
        setVisible(false);
        setNum(1); 
    };

    const handleNumbePlus = () => {
        setNum(num + 1);
    };

    const handleNumbeMinus = () => {
        if (num > 1) {
            setNum(num - 1);
        }
    };

    const handleSearch =() =>{
        if(search.trim()===''){
            setStore(Listproduct);
        }
        else{
            const filter=Listproduct.filter(pro=>(
                pro.Name.toLowerCase()===(search.toLowerCase())
            ))
            setStore(filter);
        }
        setSearch('');
    }

    useEffect(() => {
        setStore(Listproduct); // Hiển thị toàn bộ danh sách sản phẩm khi component được render lần đầu
    }, []);
    

    const addToCart = () => {
        const existingItem = cartItems.find(item => item.Id === pro.Id);
        if (existingItem) {
            const updatedCartItems = cartItems.map(item =>
                item.Id === pro.Id ? { ...item, quantity: item.quantity + num } : item
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
        setNum(1); // Reset quantity after adding to cart
    
        // Hiển thị thông báo thành công
        setNotification(true);
    
        // Ẩn thông báo sau 3 giây
        setTimeout(() => {
            setNotification(false);
        }, 3000);
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

            
            <div className='Viewproduct__search'>
                <Input 
                placeholder='Search Product'
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                ></Input>
                <Button type='secondary' onClick={handleSearch}>Search</Button>
            </div>

            <div className='row Viewproduct__product'>
                {store.map(product => (
                    <div className='col-md-3 product' key={product.Id}>
                        <img src={product.Image} alt="" />
                        <Button type="secondary" onClick={() => handleOpen(product)}>
                            View product
                        </Button>
                    </div>
                ))}
            </div>
            {notification && (
            <div className="notification">
                Add successfully!
            </div>
            )}


            <Modal open={visible} onCancel={handleCancle} footer={null}>
                <div className="modal-content">
                    <div className="modal-image">
                        <img src={pro.Image} alt={pro.Name} />
                    </div>
                    <div className="modal-details">
                        <h3>{pro.Name}</h3>
                        <span className="modal-sku">Product code: {pro.Id}</span>
                        <h5 className="modal-price">Price: {pro.Price} </h5>
                        <div className='Viewproduct__buy'>
                            <h5>Quantity: </h5>
                            <p style={{ cursor: 'pointer' }}  onClick={handleNumbeMinus}>-</p>
                            <input type="text" value={num} readOnly />
                            <p style={{ cursor: 'pointer' }}  onClick={handleNumbePlus}>+</p>
                        </div>
                        <div className="modal-actions">
                            <Link to={`/detail/${pro.Id}`}>BUY NOW</Link>
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
