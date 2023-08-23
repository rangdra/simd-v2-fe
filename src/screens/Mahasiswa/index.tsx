import {
  Alert,
  Button,
  Form,
  Grid,
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
import { useEffect, useMemo, useState } from 'react';
import axios from '../../configs/axios';
import moment from 'moment';
import AppLayout from '../../components/AppLayout';
import { IMahasiswa, IUser } from '../../types';
import { useGlobalContext } from '../../context/GlobalContext';
import { Link, useNavigate } from 'react-router-dom';
import ValueSet from '../../components/ValueSet';
import { ExportToExcel } from '../../components/ExportToExcel';
import theme from '../../theme';

const initialMahasiswa = {
  fullname: '',
  nim: '',
  jurusan: '',
  jenjang: '',
};

const MahasiswaDO = () => {
  const { lg } = Grid.useBreakpoint();
  const navigate = useNavigate();
  const { isAdmin, isMhs } = useGlobalContext();
  const [form] = Form.useForm();
  const [listMahasiswa, setListMahasiswa] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetch, setIsFetch] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [search, setSearch] = useState('');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);

  const [dataMahasiswa, setDataMahasiswa] =
    useState<IMahasiswa>(initialMahasiswa);
  const [tmpMahasiswa, setTmpMahasiswa] =
    useState<IMahasiswa>(initialMahasiswa);

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
      render: (date: any) => <div>{moment(date).format('DD MMM YYYY')}</div>,
    },
    {
      title: 'Nama',
      dataIndex: 'fullname',
      key: 'fullname',
      width: '15%',
      render: (text: string, record: any) => (
        <Link
          style={{ color: theme.gray800, textDecoration: 'underline' }}
          to={
            record?.lastIdentification?._id
              ? `/hasil/${record?.lastIdentification?._id}`
              : '#'
          }
        >
          {text}
        </Link>
      ),
    },
    {
      title: 'NIM',
      dataIndex: 'nim',
      key: 'nim',
      render: (text: string, record: IUser) => (
        <ValueSet value={record?.mahasiswa?.nim} />
      ),
    },
    {
      title: 'Jurusan',
      dataIndex: 'jurusan',
      key: 'jurusan',
      render: (text: string, record: IUser) => (
        <>
          <ValueSet value={record?.mahasiswa?.jurusan} />
        </>
      ),
    },
    {
      title: 'Jenjang',
      dataIndex: 'jenjang',
      key: 'jenjang',
      render: (text: string, record: IUser) => (
        <ValueSet value={record?.mahasiswa?.jenjang} />
      ),
    },

    {
      title: 'Potensi',
      dataIndex: 'potensi',
      key: 'potensi',
      render: (text: string, record: any) => (
        <Space>
          {/* {record?.lastIdentification?.problem?.map((prob) => (
            <Tag>{prob?.name}</Tag>
          ))} */}

          <Tag>
            {record?.lastIdentification?.problem
              ? record?.lastIdentification?.problem?.[0]?.name
              : '-'}
          </Tag>
        </Space>
      ),
    },

    isAdmin && {
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
                setTmpMahasiswa(record);
                setDataMahasiswa({
                  fullname: record?.fullname,
                  nim: record?.mahasiswa?.nim,
                  jurusan: record?.mahasiswa?.jurusan,
                  jenjang: record?.mahasiswa?.jenjang,
                });
                form.setFieldValue('fullname', record?.fullname);
                form.setFieldValue('nim', record?.mahasiswa?.nim);
                form.setFieldValue('jurusan', record?.mahasiswa?.jurusan);
                form.setFieldValue('jenjang', record?.mahasiswa?.jenjang);
              }}
            >
              Ubah
            </Button>
            <Button
              icon={<DeleteFilled />}
              type="primary"
              danger
              ghost
              onClick={() => {
                setTmpMahasiswa(record);
                setIsModalDeleteVisible(true);
              }}
            >
              Hapus
            </Button>
          </Space>
        );
      },
    },
  ].filter(Boolean) as TableProps<any>['columns'];

  const getMahasiswa = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/mahasiswa');
      setListMahasiswa(
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
      getMahasiswa();
      setIsFetch(false);
    }
  }, [isFetch]);

  const tambahMahasiswa = async () => {
    form.validateFields();

    setIsLoading(true);
    let res;
    try {
      if (isEdit) {
        res = await axios.put(`/mahasiswa/${tmpMahasiswa._id}`, dataMahasiswa);
      } else {
        res = await axios.post('/mahasiswa', dataMahasiswa);
      }

      setIsEdit(false);
      setIsFetch(true);
      form.resetFields();
      setIsModalVisible(false);
      setDataMahasiswa(initialMahasiswa);
      setTmpMahasiswa(initialMahasiswa);

      message.success(res.data.message);
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
      const res = await axios.delete(`/mahasiswa/${tmpMahasiswa?._id}`);

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

  if (isMhs) {
    navigate('/dashboard');
  }

  const transformData = () => {
    let sortedMhs = listMahasiswa;

    if (search) {
      sortedMhs = sortedMhs.filter(
        (mhs) =>
          mhs.fullname.toLowerCase().includes(search.toLowerCase()) ||
          mhs.mahasiswa.nim.toLowerCase().includes(search.toLowerCase())
      );
    }

    return sortedMhs;
  };

  const list = transformData().map((mhs) => ({
    'Nama Mahasiswa': mhs.fullname,
    NIM: mhs.mahasiswa.nim,
    Jurusan: mhs.mahasiswa.jurusan,
    Jenjang: mhs.mahasiswa.jenjang,
    'Kegagalan (%)': (mhs as any).lastIdentification.problem
      ? (mhs as any).lastIdentification?.percentage.toString()
      : '-',
    Potensi: (mhs as any).lastIdentification.problem
      ? (mhs as any).lastIdentification.problem[0].name
      : '-',
  }));

  return (
    <AppLayout title="Daftar Mahasiswa">
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          marginBottom: 12,
          gap: 12,
        }}
      >
        <Input.Search
          placeholder="Cari mahasiswa berdasarkan nama atau nim..."
          style={{ width: lg ? '50%' : '100%' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <ExportToExcel apiData={list} fileName="Laporan Hasil" />
        {/* <Button
          icon={<DeleteFilled />}
          type="primary"
          danger
          ghost
          onClick={() => setIsModalVisible(true)}
        >
          Tmbh
        </Button> */}
      </div>

      <Table
        dataSource={transformData()}
        columns={columns}
        loading={isLoading}
        scroll={{ x: true }}
      />
      {/* Tambah */}
      <Modal
        title={isEdit ? 'Edit Mahasiswa' : 'Tambah Mahasiswa'}
        open={isModalVisible}
        onOk={tambahMahasiswa}
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
          {!isEdit && (
            <Alert
              message="NIM akan dijadikan sebagai default password mahasiswa"
              type="warning"
              showIcon
              style={{ marginBottom: 8 }}
            />
          )}
          <Form.Item
            label="Nama Mahasiswa"
            name="fullname"
            rules={[
              { required: true, message: 'Silahkan masukan nama mahasiswa!' },
            ]}
          >
            <Input
              placeholder="Masukan Nama Mahasiswa"
              onChange={(e) =>
                setDataMahasiswa({ ...dataMahasiswa, fullname: e.target.value })
              }
              value={dataMahasiswa.fullname}
            />
          </Form.Item>

          <Form.Item
            label="NIM"
            name="nim"
            rules={[
              { required: true, message: 'Silahkan masukan nama mahasiswa!' },
            ]}
          >
            <Input
              placeholder="Masukan NIM Mahasiswa"
              onChange={(e) =>
                setDataMahasiswa({ ...dataMahasiswa, nim: e.target.value })
              }
              value={dataMahasiswa.nim}
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
                setDataMahasiswa({ ...dataMahasiswa, jurusan: value })
              }
              options={[
                { value: 'Sistem Informasi', label: 'Sistem Informasi' },
                { value: 'Teknik Informatika', label: 'Teknik Informatika' },
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
                setDataMahasiswa({ ...dataMahasiswa, jenjang: value })
              }
              options={[
                { value: 'D3', label: 'D3' },
                { value: 'S1', label: 'S1' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
      {/* Delete */}
      <Modal
        title="Hapus Mahasiswa"
        open={isModalDeleteVisible}
        onOk={hapusMahasiswa}
        onCancel={() => {
          setIsModalDeleteVisible(false);
          setTmpMahasiswa(initialMahasiswa);
        }}
        confirmLoading={isLoading}
      >
        <Typography.Text
          style={{ fontSize: 16, display: 'block', margin: '20px 0px' }}
        >
          Apakah anda yakin ingin menghapus mahasiswa{' '}
          <span style={{ fontWeight: 'bold' }}>{tmpMahasiswa.fullname}</span> ?
        </Typography.Text>
      </Modal>
    </AppLayout>
  );
};

export default MahasiswaDO;
