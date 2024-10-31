import { useState, useEffect } from "react";
import { Form, Input, Table, Typography, Avatar, Space, Button } from "antd";
import axios from "axios";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";

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
  const [filteredData, setFilteredData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://koicaresystemapi.azurewebsites.net/api/Account/get-all"
        );
        const users = response.data.accs.$values;
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
        setFilteredData(formattedData);
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

      const updatedUser = {
        accId: key,
        name: row.name,
        image: row.image,
        phone: row.phone,
        address: row.address,
      };

      const query = new URLSearchParams(updatedUser).toString();
      await axios.put(
        `https://koicaresystemapi.azurewebsites.net/api/Account/Profile?${query}`,
        updatedUser,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      await axios.put(
        `https://koicaresystemapi.azurewebsites.net/api/Account/edit-role/${key}?role=${row.role}`
      );

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setFilteredData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Update failed:", errInfo);
    }
  };

  const handleSearch = () => {
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
    setSearchText("");
  };

  const columns = [
    {
      title: "Avatar",
      dataIndex: "image",
      width: 80,
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
      editable: true,
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
    <Space direction="vertical" style={{ width: "100%" }}>
      <h1 className="vertical">User Management</h1>
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

export default UserManagement;
