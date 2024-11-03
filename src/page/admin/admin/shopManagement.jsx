import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Table,
  Typography,
  Popconfirm,
  message,
  Space,
  Button,
  Modal,
} from "antd";
import axios from "axios";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: true, message: `Please Input ${title}!` }]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

function ShopManagement() {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://koicaresystemapi.azurewebsites.net/api/Shop/get-all"
      );
      const shops = response.data.shops.$values;
      const formattedData = shops.map((shop) => ({
        key: shop.shopId.toString(),
        name: shop.name,
        phone: shop.phone,
        address: shop.address,
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    } catch (error) {
      console.error("Failed to fetch shop data:", error);
    }
  };

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      phone: "",
      address: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      const updatedShop = {
        shopId: key,
        name: row.name,
        phone: row.phone,
        address: row.address,
      };

      const apiUrl = `https://koicaresystemapi.azurewebsites.net/api/Shop/update${key}`;
      await axios.put(apiUrl, updatedShop, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setFilteredData(newData);
        setEditingKey("");
        message.success("Update successful");
      }
    } catch (errInfo) {
      message.error("Update failed: " + errInfo.message);
    }
  };

  const handleDelete = async (key) => {
    try {
      await axios.delete(
        `https://koicaresystemapi.azurewebsites.net/api/Shop/delete?shopId=${key}`
      );
      const newData = data.filter((item) => item.key !== key);
      setData(newData);
      setFilteredData(newData);
      message.success("Deleted successfully");
    } catch (error) {
      message.error("Delete failed: " + error.message);
    }
  };

  const handleSearch = () => {
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
    setSearchText("");
  };

  const handleAdd = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const newShop = {
        name: values.name,
        phone: values.phone,
        address: values.address,
      };

      await axios.post(
        "https://koicaresystemapi.azurewebsites.net/api/Shop/create",
        newShop
      );

      // Optionally, fetch updated shop data or update state locally
      message.success("Shop added successfully!");
      setIsModalVisible(false);
      form.resetFields(); // Reset the form after successful add

      // Fetch new data
      fetchData();
    } catch (error) {
      message.error("Failed to add shop: " + error.message);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); // Reset form fields when cancelling
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: 200,
      editable: true,
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      width: 200,
      editable: true,
    },
    {
      title: "Address",
      dataIndex: "address",
      width: 500,
      editable: true,
    },
    {
      title: "Operation",
      dataIndex: "operation",
      width: 150,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </a>
            <a onClick={cancel}>Cancel</a>
          </span>
        ) : (
          <span>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
              style={{ marginRight: 8 }}
            >
              Edit
            </Typography.Link>
          </span>
        );
      },
    },
    {
      title: "Delete",
      dataIndex: "delete",
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete?"
          onConfirm={() => handleDelete(record.key)}
          okText="Yes"
          cancelText="No"
        >
          <a>Delete</a>
        </Popconfirm>
      ),
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <h1 className="vertical">Shop Management</h1>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search by Name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200, marginRight: 8 }}
        />
        <Button
          type="primary"
          className="search__product"
          onClick={handleSearch}
        >
          Search
        </Button>
        <Button type="primary" className="add_product" onClick={handleAdd}>
          Add Shop
        </Button>
      </Space>
      <Form form={form} component={false}>
        <Table
          components={{ body: { cell: EditableCell } }}
          bordered
          dataSource={filteredData}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{ pageSize: 5 }}
        />
      </Form>
      <Modal
        title="Add New Shop"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical" name="addShopForm">
          <Form.Item
            name="name"
            label="Shop Name"
            rules={[{ required: true, message: "Please input the shop name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              { required: true, message: "Please input the phone number!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please input the address!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}

export default ShopManagement;
