import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, message, Space, Table } from "antd";
import Highlighter from "react-highlight-words";
import axios from "axios";

function Orderlist() {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [data, setData] = useState([]); // State để lưu trữ dữ liệu hợp nhất
  const searchInput = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(
          "https://koicaresystemapi.azurewebsites.net/api/Account/get-all"
        );

        if (
          userResponse.data &&
          userResponse.data.accs &&
          userResponse.data.accs.$values
        ) {
          const users = userResponse.data.accs.$values.map((user) => ({
            accId: user.accId,
            name: user.name || "N/A",
            phone: user.phone || "N/A",
            address: user.address || "N/A",
          }));

          // Gọi API để lấy danh sách các đơn hàng
          const orderListResponse = await axios.get(
            "https://koicaresystemapi.azurewebsites.net/GetOrders"
          );

          if (
            orderListResponse.data &&
            orderListResponse.data.orders &&
            orderListResponse.data.orders.$values
          ) {
            const combinedData = [];
            const orderList = orderListResponse.data.orders.$values;
            orderList.forEach((order) => {
              if (order && order.accId) {
                const user = users.find((user) => user.accId === order.accId);

                combinedData.push({
                  key: order.orderId,
                  orderId: order.orderId,
                  date: order.date,
                  statusOrder: order.statusOrder,
                  statusPayment: order.statusPayment,
                  totalAmount: order.totalAmount * 1000,
                  name: user ? user.name : "N/A",
                  phone: user ? user.phone : "N/A",
                  address: user ? user.address : "N/A",
                  accId: user ? user.accId : "N/A",
                });
              }
            });
            setData(combinedData);
          } else {
            message.error("No order data found.");
          }
        } else {
          message.error("No user data found.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error(
          "Failed to fetch data. Please check console for more details."
        );
      }
    };

    fetchUserData();
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleConfirm = async (status, orderId) => {
    try {
      const response = await axios.put(
        `https://koicaresystemapi.azurewebsites.net/api/Update-OrderStatus?orderID=${orderId}&status=${status}`
      );

      if (response.status === 200) {
        message.success(
          "Order status updated to " + response.data.orderStatus + "!"
        );
        // Cập nhật lại data sau khi xác nhận
        setData((prevData) =>
          prevData.map((item) =>
            item.orderId === orderId
              ? { ...item, statusOrder: response.data.orderStatus }
              : item
          )
        );
      } else {
        message.error("Failed to update order status.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      message.error("An error occurred while updating the order status.");
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      ...getColumnSearchProps("orderId"),
      align: "center",
    },

    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      ...getColumnSearchProps("date"),
      align: "center",
    },

    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      align: "center",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      ...getColumnSearchProps("phone"),
      align: "center",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address"),
      align: "center",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      ...getColumnSearchProps("totalAmount"),
      align: "center",
    },
    {
      title: "Payment Status",
      dataIndex: "statusPayment",
      key: "statusPayment",
      ...getColumnSearchProps("statusPayment"),
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "statusOrder",
      key: "statusOrder",
      ...getColumnSearchProps("statusOrder"),
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (text, record) => {
        // Define conditions for each button
        const isPeding =
          record.statusOrder.toLowerCase() === "pending" &&
          record.statusPayment.toLowerCase() === "unpaid";

        const isProcessing =
          record.statusOrder.toLowerCase() === "processing" &&
          record.statusPayment.toLowerCase() === "unpaid";

        const isShipping =
          record.statusOrder.toLowerCase() === "shiping" &&
          record.statusPayment.toLowerCase() === "unpaid";
        const isShippingCompleted =
          record.statusOrder.toLowerCase() === "shipcompleted" &&
          record.statusPayment.toLowerCase() === "paid";
        const buttonStyle = { width: 100, margin: 10 };
        return (
          <>
            {/* Show only one button based on conditions */}
            {isPeding ? (
              <Button
                type="primary"
                onClick={() => handleConfirm(1, record.orderId)}
                style={buttonStyle}
              >
                Confirm
              </Button>
            ) : isProcessing ? (
              <Button
                type="primary"
                onClick={() => handleConfirm(2, record.orderId)}
                style={buttonStyle}
              >
                Ship
              </Button>
            ) : isShipping ? (
              <Button
                type="primary"
                onClick={() => handleConfirm(3, record.orderId)}
                style={buttonStyle}
              >
                Ship Complete
              </Button>
            ) : isShippingCompleted ? (
              <Button
                type="primary"
                onClick={() => handleConfirm(4, record.orderId)}
                style={buttonStyle}
              >
                Complete
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={() => handleConfirm(4, record.orderId)}
                style={buttonStyle}
                disabled={true}
              >
                Complete
              </Button>
            )}
            <Button
              type="default"
              onClick={() => handleConfirm(5, record.orderId)}
              style={buttonStyle}
              disabled={record.statusPayment.toLowerCase() === "paid"}
            >
              Cancel
            </Button>
          </>
        );
      },
    },
  ];

  return <Table columns={columns} dataSource={data} />;
}

export default Orderlist;
