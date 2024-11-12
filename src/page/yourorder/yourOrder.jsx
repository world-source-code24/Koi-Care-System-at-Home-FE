import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import { Layout, Menu, message, Modal, Row, Col } from "antd";

import { useEffect, useState } from "react";
import axios from "axios";
const { Sider, Content } = Layout;

import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { width } from "@fortawesome/free-solid-svg-icons/fa0";
import "./yourOrder.scss";
import { color } from "chart.js/helpers";
import VisibilityIcon from "@mui/icons-material/Visibility";

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
  const [ordersPending, setOrdersPending] = useState([]); // Store all orders
  const [orderDetails, setOrderDetails] = useState([]);
  const [selectedKey, setSelectedKey] = useState(1); // Track selected menu item
  const [isCancel, setIsCancel] = useState(false);
  const [isConfirm, setIsConfirm] = useState(true);
  const [isViewDetail, setIsViewDetail] = useState(false);
  const [orders, setOrders] = useState([]);

  const handleCancle = async (orderId) => {
    const respones = await axios.put(
      `https://koicaresystemapi.azurewebsites.net/api/Update-OrderStatus?orderID=${orderId}&status=5`
    );
    if (respones.status === 200) {
      message.success("Cancel successfully!!");
      fetchOrders(selectedKey);
    }
  };

  const handleConfirm = async (orderId) => {
    const respones = await axios.put(
      `https://koicaresystemapi.azurewebsites.net/api/Update-Status-Payment?orderID=${orderId}`
    );
    if (respones.status === 200) {
      message.success("Confirm successfully!!");
      fetchOrders(selectedKey);
    }
  };

  useEffect(() => {
    // Call fetchOrders when the component is mounted or when the selectedKey changes

    fetchOrders(selectedKey);
  }, [selectedKey]); // Re-fetch when `selectedKey` changes

  // Fetch orders based on the selected menu item
  const fetchOrders = async (key) => {
    if (key === 1 || key === 2) {
      setIsCancel(true);
    } else if (key === 4) {
      setIsCancel(false);
      setIsConfirm(true);
    } else {
      setIsCancel(false);
      setIsConfirm(false);
    }

    const user = localStorage.getItem("userId");
    const url = `https://koicaresystemapi.azurewebsites.net/api/Get-Order-By-OrderStatus?status=${key}&accId=${user}`;

    try {
      const response = await axios.get(url);

      if (response.status === 200 && response.data.orders.$values) {
        console.log("Orders API Response:", response.data.orders.$values);
        setOrdersPending(response.data.orders.$values); // Set the orders based on the selected key
      } else {
        console.error("Error fetching orders:", response.data);
      }
    } catch (error) {
      console.error("Error calling order API:", error);
    }
  };

  // Fetch order details after ordersPending is set
  useEffect(() => {
    if (ordersPending.length > 0) {
      fetchOrderDetails();
    }
  }, [ordersPending]);

  const fetchOrderDetails = async () => {
    try {
      const orderDetailsList = [];

      // Loop through all orderIds from `ordersPending` and get each order's details
      for (const order of ordersPending) {
        const response = await axios.get(
          `https://koicaresystemapi.azurewebsites.net/api/Get-All-Order-Details?orderId=${order.orderId}`
        );

        if (response.status === 200 && response.data.$values) {
          setOrders(response.data.$values);
          orderDetailsList.push(...response.data.$values); // Add all details to list
        } else {
          console.error(
            `Error fetching details for Order ID ${order.orderId}:`,
            response.data
          );
        }
      }

      // After fetching all details, update `orderDetails`

      setOrderDetails(orderDetailsList);
    } catch (error) {
      console.error("Error calling order details API:", error);
    }
  };

  console.log(ordersPending);
  return (
    <>
      <Header />
      <div>
        <Layout>
          <Sider className="order_sidebar" width={250} theme="light">
            <Menu
              mode="vertical"
              selectedKeys={[String(selectedKey)]} // Highlight the selected item
              onClick={(e) => setSelectedKey(Number(e.key))} // Update selected key
              className="order_menu"
            >
              <Menu.Item key={1}>Order List</Menu.Item>
              <Menu.Item key={2}>Processing</Menu.Item>
              <Menu.Item key={3}>In Shipping</Menu.Item>
              <Menu.Item key={4}>Shipped</Menu.Item>
              <Menu.Item key={5}>Completed</Menu.Item>
              <Menu.Item key={6}>Cancel</Menu.Item>
            </Menu>
          </Sider>

          <Content>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left">OrderId</StyledTableCell>
                    <StyledTableCell align="left">
                      Total Amount (VND)
                    </StyledTableCell>
                    <StyledTableCell align="left">Date</StyledTableCell>
                    <StyledTableCell>Status Order</StyledTableCell>
                    <StyledTableCell align="center"> Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ordersPending.map((item, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell align="left">
                        {item.orderId}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {(item.totalAmount * 1000).toLocaleString()} VND
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {item.date}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {item.statusOrder}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <VisibilityIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setIsViewDetail(!isViewDetail);
                          }}
                        />

                        {isCancel ? (
                          <i
                            style={{ cursor: "pointer", marginLeft: "20px" }}
                            onClick={() => {
                              const userConfirm = confirm(
                                "Do you want to cancel this order. The action can not be undo"
                              );
                              if (userConfirm) {
                                handleCancle(item.orderId);
                              }
                            }}
                            className="bi bi-archive-fill"
                          ></i>
                        ) : (
                          <Button
                            disabled={!isConfirm}
                            onClick={() => {
                              handleConfirm(item.orderId);
                            }}
                          >
                            Confirm
                          </Button>
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Content>
        </Layout>
      </div>

      <Modal
        open={isViewDetail}
        onCancel={() => setIsViewDetail(false)}
        footer={null} // Remove OK/Cancel buttons
        width="80%"
        style={{
          maxWidth: "800px",
          height: "80vh",
          overflowY: "auto",
          padding: "20px",
        }}
      >
        {orders.map((order, index) => (
          <div key={index} className="product-container">
            <Row gutter={16}>
              {/* Left Side Content */}
              <Col md={14} xs={24}>
                <h4>Product Name:</h4>
                <div>{order.product.name}</div>
                <br />
                <h6>Product Info:</h6>
                <div>{order.product.productInfo}</div>
              </Col>

              {/* Right Side Content */}
              <Col md={10} xs={24}>
                <div>
                  <h6>Quantity: {order.quantity}</h6>
                </div>
                <div>
                  <br />
                  <h6>
                    Price: {(order.totalPrice * 1000).toLocaleString()} VND
                  </h6>
                </div>
              </Col>
            </Row>
            {/* Add a border to separate each product */}
            {index < orders.length - 1 && (
              <div className="product-divider"></div>
            )}
          </div>
        ))}
      </Modal>

      <Footer />
    </>
  );
}

export default YourOrder;

