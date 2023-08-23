import {
  Alert,
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  TableProps,
  Tag,
  Typography,
  message,
} from 'antd';
import { EditOutlined, DeleteFilled } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import axios from '../../configs/axios';
import moment from 'moment';
import AppLayout from '../../components/AppLayout';
import { ERoleType, IMahasiswa, IUser } from '../../types';
import { useGlobalContext } from '../../context/GlobalContext';
import { useNavigate } from 'react-router-dom';

const initialUser = {
  fullname: '',
  username: '',
  role: '',
  nim: '',
  jurusan: '',
  jenjang: '',
  password: '',
};

const Users = () => {
  const { currentUser } = useGlobalContext();
  const [form] = Form.useForm();
  const [listUsers, setListUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetch, setIsFetch] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [search, setSearch] = useState('');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);

  const [dataUser, setDataUser] = useState<any>(initialUser);
  const [tmpUser, setTmpUser] = useState<any>(initialUser);

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render: (no: number) => <div>{no}</div>,
    },
    {
      title: 'Tanggal dibuat',
      dataIndex: 'createdAt',
      key: 'createdAt',

      render: (date: any) => <>{moment.utc(date).format('DD MMM YYYY')}</>,
    },
    {
      title: 'Nama',
      dataIndex: 'fullname',
      key: 'fullname',
    },
    {
      title: 'Nama Pengguna',
      dataIndex: 'username',
      key: 'username',

      render: (text: string, record: IUser) => <>{record?.username}</>,
    },
    // {
    //   title: 'Role',
    //   dataIndex: 'role',
    //   key: 'role',
    //   render: (text: string, record: IUser) => (
    //     <>
    //       <Tag
    //         color={
    //           text === ERoleType.admin
    //             ? 'red'
    //             : text === ERoleType.super_admin
    //             ? 'blue'
    //             : 'orange'
    //         }
    //       >
    //         {text.split('_').join(' ')}
    //       </Tag>
    //     </>
    //   ),
    // },
    {
      title: 'Aksi',
      dataIndex: 'action',
      key: 'action',

      render: (_: any, record: any) => {
        return (
          <Space>
            <Button
              icon={<EditOutlined />}
              type="primary"
              ghost
              onClick={() => {
                setIsModalVisible(true);
                setIsEdit(true);
                setTmpUser(record);
                setDataUser({
                  fullname: record?.fullname,
                  username: record?.username,

                  // role: record?.role,
                  // nim: record?.mahasiswa?.nim,
                  // jurusan: record?.mahasiswa?.jurusan,
                  // jenjang: record?.mahasiswa?.jenjang,
                });
                form.setFieldValue('fullname', record?.fullname);
                form.setFieldValue('username', record?.username);
                // form.setFieldValue('role', record?.role);

                // form.setFieldValue('nim', record?.mahasiswa?.nim);
                // form.setFieldValue('jurusan', record?.mahasiswa?.jurusan);
                // form.setFieldValue('jenjang', record?.mahasiswa?.jenjang);
              }}
            >
              Ubah
            </Button>
            {currentUser?._id === record._id ? null : (
              <Button
                icon={<DeleteFilled />}
                type="primary"
                danger
                ghost
                onClick={() => {
                  setTmpUser(record);
                  setIsModalDeleteVisible(true);
                }}
              >
                Hapus
              </Button>
            )}
          </Space>
        );
      },
    },
  ].filter(Boolean) as TableProps<any>['columns'];

  const getUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/users?role=admin');
      setListUsers(
        res.data.map((item: any, idx: number) => ({
          no: idx + 1,
          ...item,
        }))
      );
    } catch (error: any) {
      message.error('Something went wrong!');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isFetch) {
      getUsers();
      setIsFetch(false);
    }
  }, [isFetch]);

  const tambahUser = async () => {
    form.validateFields();

    setIsLoading(true);
    let res;

    try {
      if (isEdit) {
        res = await axios.put(`/users/${tmpUser._id}`, {
          ...dataUser,
        });
      } else {
        // res = await axios.post('/users', { ...dataUser, role: 'admin' });
        res = await axios.post('/auth/register', {
          ...dataUser,
          role: 'admin',
        });
      }

      setIsEdit(false);
      setIsFetch(true);
      form.resetFields();
      setIsModalVisible(false);
      setDataUser(initialUser);
      setTmpUser(initialUser);

      if (isEdit) {
        message.success(res.data.message);
      } else {
        message.success('User berhasil ditambahkan');
      }
    } catch (error: any) {
      console.log(error);
      message.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const hapusMahasiswa = async () => {
    setIsLoading(true);
    try {
      const res = await axios.delete(`/users/${tmpUser?._id}`);

      setIsFetch(true);
      setIsModalDeleteVisible(false);
      message.success(res.data.message);
    } catch (error: any) {
      console.log(error);
      message.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const { isSuperAdmin, isAdmin } = useGlobalContext();
  const navigate = useNavigate();
  if (!isAdmin) {
    navigate('/dashboard');
  }

  const transformData = () => {
    let sortedUsers = listUsers;

    if (search) {
      sortedUsers = sortedUsers.filter(
        (user) =>
          user.fullname.toLowerCase().includes(search.toLowerCase()) ||
          user.username.toLowerCase().includes(search.toLowerCase())
      );
    }

    return sortedUsers;
  };

  return (
    <AppLayout title="Daftar Admin">
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
          marginBottom: 12,
        }}
      >
        {/* <Input.Search
          placeholder="Cari admin berdasarkan nama atau nama pengguna..."
          style={{ width: '50%' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />{' '} */}
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Tambah Admin
        </Button>
      </div>

      <Table
        dataSource={transformData()}
        columns={columns}
        loading={isLoading}
        pagination={false}
        scroll={{ x: true }}
      />
      {/* Tambah */}
      <Modal
        title={isEdit ? 'Edit Admin' : 'Tambah Admin'}
        open={isModalVisible}
        onOk={tambahUser}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setIsEdit(false);
        }}
        confirmLoading={isLoading}
      >
        <Form
          style={{ marginTop: 24 }}
          name="basic"
          autoComplete="off"
          form={form}
          layout="vertical"
        >
          {/* {!isEdit || (isEdit && tmpUser?.isTemporaryPassword) ? (
            <Alert
              message="Username akan dijadikan sebagai default password Admin"
              type="warning"
              showIcon
              style={{ marginBottom: 8 }}
            />
          ) : null} */}

          <Form.Item
            label="Nama"
            name="fullname"
            rules={[
              { required: true, message: 'Silahkan masukan nama admin!' },
            ]}
          >
            <Input
              placeholder="Masukan nama admin"
              onChange={(e) =>
                setDataUser({ ...dataUser, fullname: e.target.value })
              }
              value={dataUser.fullname}
            />
          </Form.Item>

          <Form.Item
            label="Nama Pengguna"
            name="username"
            rules={[
              {
                required: true,
                message: 'Silahkan masukan nama pengguna admin!',
              },
            ]}
          >
            <Input
              placeholder="Masukan nama pengguna admin"
              onChange={(e) =>
                setDataUser({ ...dataUser, username: e.target.value })
              }
              value={dataUser.username}
            />
          </Form.Item>
          {!isEdit && (
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Silahkan masukan password anda!' },
              ]}
            >
              <Input.Password
                onChange={(e) =>
                  setDataUser({ ...dataUser, password: e.target.value })
                }
                value={dataUser.password}
              />
            </Form.Item>
          )}

          {/* <Form.Item
            label="Role"
            name="role"
            rules={[
              {
                required: true,
                message: 'Silahkan masukan role user!',
              },
            ]}
          >
            <Select
              onChange={(value) => setDataUser({ ...dataUser, role: value })}
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'mahasiswa', label: 'Mahasiswa' },
              ]}
            />
          </Form.Item> */}

          {/* {dataUser?.role === ERoleType.mahasiswa && (
            <>
              <Form.Item
                label="NIM"
                name="nim"
                rules={[
                  {
                    required: true,
                    message: 'Silahkan masukan nama mahasiswa!',
                  },
                ]}
              >
                <Input
                  placeholder="Masukan NIM Mahasiswa"
                  onChange={(e) =>
                    setDataUser({ ...dataUser, nim: e.target.value })
                  }
                  value={dataUser.nim}
                  type="number"
                />
              </Form.Item>

              <Form.Item
                label="Jurusan"
                name="jurusan"
                rules={[
                  {
                    required: true,
                    message: 'Silahkan masukan jurusan mahasiswa!',
                  },
                ]}
              >
                <Select
                  onChange={(value) =>
                    setDataUser({ ...dataUser, jurusan: value })
                  }
                  options={[
                    { value: 'Sistem Informasi', label: 'Sistem Informasi' },
                    {
                      value: 'Teknik Informatika',
                      label: 'Teknik Informatika',
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item
                label="Jenjang"
                name="jenjang"
                rules={[
                  {
                    required: true,
                    message: 'Silahkan masukan jenjang pendidikan mahasiswa!',
                  },
                ]}
              >
                <Select
                  onChange={(value) =>
                    setDataUser({ ...dataUser, jenjang: value })
                  }
                  options={[
                    { value: 'D3', label: 'D3' },
                    { value: 'S1', label: 'S1' },
                  ]}
                />
              </Form.Item>
            </>
          )} */}
        </Form>
      </Modal>
      {/* Delete */}
      <Modal
        title="Hapus User"
        open={isModalDeleteVisible}
        onOk={hapusMahasiswa}
        onCancel={() => {
          setIsModalDeleteVisible(false);
          setTmpUser(initialUser);
        }}
        confirmLoading={isLoading}
      >
        <Typography.Text
          style={{ fontSize: 16, display: 'block', margin: '20px 0px' }}
        >
          Apakah anda yakin ingin menghapus user{' '}
          <span style={{ fontWeight: 'bold' }}>{tmpUser.fullname}</span> ?
        </Typography.Text>
      </Modal>
    </AppLayout>
  );
};

export default Users;
