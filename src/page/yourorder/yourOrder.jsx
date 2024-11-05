import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import "./yourOrder.scss";
import { Layout, Menu } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
const { Sider, Content } = Layout;

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function YourOrder() {
  const [orders, setOrders] = useState([]); // Chỉ cần state cho orders

  const fetchOrders = async () => {
    const userId = localStorage.getItem("userId"); // Lấy userId từ localStorage
    try {
      const response = await axios.get(
        `https://koicaresystemapi.azurewebsites.net/GetAll/${userId}`
      );

      if (response.status === 200 && response.data.success) {
        // Lưu thông tin đơn hàng vào state
        setOrders(response.data.orders.$values);
      } else {
        console.error("Error fetching orders:", response.data);
      }
    } catch (error) {
      console.error("Error calling order API:", error);
    }
  };
  
  useEffect(() => {
    fetchOrders(); // Gọi API khi component được mount
  }, []);

  return (
    <>
      <Header />
      <div>
        <Layout>
          <Sider className="order_sidebar" width={250} theme="light">
            <Menu mode="vertical" defaultSelectedKeys={[1]} className="order_menu">
              <Menu.Item key={1}>Danh sách đơn hàng</Menu.Item>
              <Menu.Item key={2}>Thanh toán đang chờ</Menu.Item>
              <Menu.Item key={3}>Giao hàng</Menu.Item>
              <Menu.Item key={4}>Hoàn thành</Menu.Item>
              <Menu.Item key={5}>Đã hủy</Menu.Item>
              <Menu.Item key={6}>Trả hàng / Hoàn tiền</Menu.Item>
            </Menu>
          </Sider>

          <Content>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Hình Ảnh Sản Phẩm</StyledTableCell>
                    <StyledTableCell>Tên Sản Phẩm</StyledTableCell>
                    <StyledTableCell align="right">Số Lượng</StyledTableCell>
                    <StyledTableCell align="right">Tổng Tiền</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    order.orderDetailsTbls.$values.map((item) => ( // Giả sử orderDetails được lưu trong order.orderDetailsTbls
                      <StyledTableRow key={item.productId}>
                        <StyledTableCell>
                          <img
                            src={item.image}
                            alt={item.productName}
                            style={{ width: "50px", height: "50px" }}
                          />
                        </StyledTableCell>
                        <StyledTableCell>{item.productName}</StyledTableCell>
                        <StyledTableCell align="right">{item.quantity}</StyledTableCell>
                        <StyledTableCell align="right">
                          {(item.price * item.quantity * 1000).toLocaleString()} VND
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Content>
        </Layout>
      </div>
      <Footer />
    </>
  );
}

export default YourOrder;
