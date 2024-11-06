import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Table,
  message,
  Avatar,
  Radio,
  Space,
  Button,
  Typography,
} from "antd";
import axios from "axios";
import "./productManagement.scss";
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

function ProductManagement() {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://koicaresystemapi.azurewebsites.net/api/Product/get-all"
      );
      const products = response.data.product.$values;
      const formattedData = products.map((product) => ({
        key: product.productId.toString(),
        image: product.image,
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: product.category,
        description: product.productInfo,
        status: product.status,
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    } catch (error) {
      console.error("Failed to fetch product data:", error);
    }
  };

  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      price: "",
      stock: "",
      category: "",
      description: "",
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
        productId: key,
        name: row.name,
        price: row.price,
        quantity: row.stock,
        description: row.description,
        category: row.category,
        status: row.status,
      };

      const apiUrl = `https://koicaresystemapi.azurewebsites.net/api/Product/update${key}`;
      await axios.put(apiUrl, updatedShop, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (index > -1) {
        const item = newData[index];
        newData.slice(index, 1, { ...item, ...row });
        setData(newData);
        setFilteredData(newData);
        setEditingKey("");
        fetchData();
        message.success("Update successful");
      }
    } catch (errInfo) {
      message.error("Update failed: " + errInfo.message);
    }
  };

  const handleSearch = () => {
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
    setSearchText(""); // Reset searchText after search
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: 200,
      editable: true,
    },
    {
      title: "Price",
      dataIndex: "price",
      width: 200,
      editable: true,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      width: 200,
      editable: true,
    },
    {
      title: "Category",
      dataIndex: "category",
      width: 200,
      editable: true,
    },
    {
      title: "Information",
      dataIndex: "description",
      width: 200,
      editable: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 150,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item name="status" style={{ margin: 0 }}>
            <Radio.Group>
              <Radio value={true}>Unbanned</Radio>
              <Radio value={false}>Banned</Radio>
            </Radio.Group>
          </Form.Item>
        ) : (
          <span>{record.status ? "Unbanned" : "Banned"}</span>
        );
      },
    },
    {
      title: "Operation",
      dataIndex: "operation",
      with: 150,
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
      <h1 className="vertical">Product Management</h1>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search by Name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />
        <Button
          type="primary"
          className="search__product"
          onClick={handleSearch}
        >
          Search
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
    </Space>
  );
}

export default ProductManagement;
