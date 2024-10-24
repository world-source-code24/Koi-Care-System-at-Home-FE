import { useState, useEffect } from "react";
import { Form, Input, Table, Typography, Avatar, Space } from "antd";
import axios from "axios";
import {
  CheckCircleFilled,
  CheckCircleOutlined,
  CloseCircleFilled,
  CloseCircleOutlined,
} from "@ant-design/icons";

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

function UserManagement() {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");

  useEffect(() => {
    // Fetching data from the API
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://koicaresystemapi.azurewebsites.net/api/Account/get-all"
        );
        const users = response.data.accs.$values; // Assuming this structure based on the provided JSON
        const formattedData = users.map((user) => ({
          key: user.accId.toString(),
          name: user.name,
          image: user.image,
          phone: user.phone,
          email: user.email,
          role: user.role,
          address: user.address,
          status: user.status,
        }));
        setData(formattedData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchData();
  }, []);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      image: "",
      phone: "",
      email: "",
      role: "",
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

      // Lấy các giá trị cần cập nhật từ form
      const updatedUser = {
        accId: key, // accId lấy từ key
        name: row.name, // Tên người dùng
        image: row.image, // Ảnh đại diện
        phone: row.phone, // Số điện thoại
        address: row.address, // Địa chỉ
        // Thêm các trường khác nếu cần
      };

      // Xây dựng URL với query parameters
      const query = new URLSearchParams(updatedUser).toString();
      const apiUrl = `https://koicaresystemapi.azurewebsites.net/api/Account/Profile?${query}`;

      // Gửi yêu cầu đến API với URL đúng
      await axios.put(apiUrl);

      // Cập nhật dữ liệu trong FE sau khi lưu thành công
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Update failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "Avatar",
      dataIndex: "image",
      width: 20,
      render: (image) => <Avatar src={image} alt="avatar" />,
    },
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
      title: "Email",
      dataIndex: "email",
      width: 200,
      editable: true,
    },
    {
      title: "Role",
      dataIndex: "role",
      width: 100,
      editable: false,
    },
    {
      title: "Address",
      dataIndex: "address",
      width: 250,
      editable: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 100,
      render: (status) =>
        status ? (
          <CheckCircleFilled style={{ fontSize: 20, color: "green" }} />
        ) : (
          <CloseCircleFilled style={{ fontSize: 20, color: "red" }} />
        ),
    },
    {
      title: "Operation",
      dataIndex: "operation",
      width: 150,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a onClick={() => save(record.key)} style={{ marginLeft: 8 }}>
              Save
            </a>
            <a onClick={cancel} style={{ marginLeft: 8 }}>
              Cancel
            </a>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
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
    <Space direction="vertical">
      <Typography.Title level={2}>User Management</Typography.Title>
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

export default UserManagement;
