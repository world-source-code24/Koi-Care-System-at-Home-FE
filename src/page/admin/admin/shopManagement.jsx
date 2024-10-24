import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Table,
  Typography,
  Popconfirm,
  message,
  Space,
  Flex,
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
  const [data, setData] = useState([]); // Quản lý state của dữ liệu cửa hàng
  const [editingKey, setEditingKey] = useState(""); // Quản lý trạng thái chỉnh sửa

  useEffect(() => {
    // Fetch dữ liệu từ API khi component được render lần đầu
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://koicaresystemapi.azurewebsites.net/api/Shop/get-all"
        );
        const shops = response.data.shops.$values; // Giả sử cấu trúc này dựa trên JSON đã được cung cấp
        const formattedData = shops.map((shop) => ({
          key: shop.shopId.toString(),
          name: shop.name,
          phone: shop.phone,
          address: shop.address,
        }));
        setData(formattedData); // Cập nhật state với dữ liệu đã được format
      } catch (error) {
        console.error("Failed to fetch shop data:", error);
      }
    };
    fetchData();
  }, []); // Chỉ gọi useEffect một lần khi component được mount

  const isEditing = (record) => record.key === editingKey; // Kiểm tra xem mục có đang được chỉnh sửa không

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      phone: "",
      address: "",
      ...record,
    });
    setEditingKey(record.key); // Thiết lập trạng thái chỉnh sửa
  };

  const cancel = () => {
    setEditingKey(""); // Hủy chỉnh sửa
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields(); // Validate dữ liệu trong form
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      // Chuẩn bị dữ liệu để cập nhật
      const updatedShop = {
        shopId: key, // shopId từ key
        name: row.name,
        phone: row.phone,
        address: row.address,
      };

      const apiUrl = `https://koicaresystemapi.azurewebsites.net/api/Shop/update${key}`;

      // Gửi yêu cầu cập nhật API
      await axios.put(apiUrl, updatedShop, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Cập nhật dữ liệu trong UI sau khi lưu thành công
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey("");
        message.success("Update successful");
      }
    } catch (errInfo) {
      message.error("Update failed: " + errInfo.message);
    }
  };

  // Hàm xóa mục
  const handleDelete = async (key) => {
    try {
      await axios.delete(
        `https://koicaresystemapi.azurewebsites.net/api/Shop/delete?shopId=${key}`
      );
      const newData = data.filter((item) => item.key !== key);
      setData(newData);
      message.success("Deleted successfully");
    } catch (error) {
      message.error("Delete failed: " + error.message);
    }
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
    <Space direction="vertical">
      <Typography.Title level={2}>Shop Management</Typography.Title>
      <Form form={form} component={false}>
        <Table
          components={{ body: { cell: EditableCell } }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{ pageSize: 5 }}
        />
      </Form>
    </Space>
  );
}

export default ShopManagement;
