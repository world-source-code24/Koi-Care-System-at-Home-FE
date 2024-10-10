import { useParams } from "react-router-dom";
import "./detail.scss";
import React, { useState } from 'react';
import { Listproduct } from "../../share/listproduct";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import bg from '../../img/news.jpg';
import { Button } from "antd";

function Detail() {
    const { id } = useParams();
    const find = Listproduct.find(pro => pro.Id === id);
    const [count, setCount] = useState(1);

    // Tính tổng giá và định dạng giá trị theo kiểu tiền Việt Nam (có dấu chấm)
    const totalPrice = (find.Price * count).toLocaleString("vi-VN");

    const handleMinion = () => {
        if (count <= 1) {
            setCount(1);
        } else {
            setCount(count - 1);
        }
    };

    const handlePlus = () => {
        setCount(count + 1);
    };

    const handleChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 1) {
            setCount(value);
        }
    };

    return (
        <>
            <Header />
            <div className="detail__img">
                <img src={bg} alt="" />
            </div>
            <br />
            <div className="detail__title">
                <h1>Information of product</h1>
            </div>

            <div className="detail__divider"></div>
            <div className="row detailPage__product">
                <div className="col-md-6 detailPage__left">
                    <img src={find.Image} alt="" />
                </div>

                <div className="col-md-6 detailPage__right">
                    <br />
                    <h1>{find.Name}</h1>
                    <b><p>{find.Information}</p></b>
                    <b>Origin: <p>{find.Origin}</p></b>
                    <b>Rating: <p>{find.Rating}</p></b>
                    <div className="modal-promotions">
                        <ul>
                            <li>Genuine product commitment</li>
                            <li>Cash on Delivery</li>
                        </ul>
                    </div>
                    <div className="detail__quantity">
                        <p onClick={handleMinion} style={{ cursor: 'pointer' }}>-</p>
                        <input type="text" value={count} onChange={handleChange} style={{ textAlign: "center" }} />
                        <p onClick={handlePlus} style={{ cursor: 'pointer' }}>+</p>
                    </div>
                    {/* Hiển thị tổng giá đã định dạng */}
                    <h3>Total Price: {totalPrice}.000 VND</h3>

                    <Button type="secondary">Check out</Button>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Detail;
