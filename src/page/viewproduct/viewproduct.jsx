import { useState, useEffect } from 'react';
import './viewproduct.scss';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import bg from '../../img/background.jpg';
import { Listproduct } from '../../share/listproduct';
import { Button, Input, Modal } from 'antd';

function Viewproduct() {
    const [visible, setVisible] = useState(false);
    const [pro, setPro] = useState({});
    const [num, setNum] = useState(1);
    const [search, setSearch]=useState('');
    const [store,setStore]=useState([]);
    const [cartItems, setCartItems] = useState(() => {
        const storedCart = localStorage.getItem("cartItems");
        return storedCart ? JSON.parse(storedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

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
            // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
            const updatedCartItems = cartItems.map(item =>
                item.Id === pro.Id ? { quantity: item.quantity + num } : item
            );
            setCartItems(updatedCartItems);
        } else {
            // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm mới
            const productToAdd = {
                ...pro,
                quantity: num
            };
            setCartItems([...cartItems, productToAdd]);
        }
        setVisible(false);
        setNum(1); // Reset quantity after adding to cart
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
                            <Button className='Viewproduct__minus' onClick={handleNumbeMinus}>-</Button>
                            <input type="text" value={num} readOnly />
                            <Button className='Viewproduct__plus' onClick={handleNumbePlus}>+</Button>
                        </div>
                        <div className="modal-actions">
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
