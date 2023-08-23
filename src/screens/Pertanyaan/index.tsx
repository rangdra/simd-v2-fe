import AppLayout from '../../components/AppLayout';
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Typography,
  message,
} from 'antd';
import { EditOutlined, DeleteFilled } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import axios from '../../configs/axios';
import { IGejala } from '../Gejala';
import moment from 'moment';
import { useGlobalContext } from '../../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { IRule } from '../Rule';

export interface IPertanyaan {
  pertanyaan: string;
  id_evidence: string;
}

const initialPertanyaan = {
  pertanyaan: '',
  id_evidence: '',
};

const Pertanyaan = () => {
  const [form] = Form.useForm();
  const [listPertanyaan, setListPertanyaan] = useState<IPertanyaan[]>([]);
  // const [listGejala, setListGejala] = useState<IGejala[]>([]);
  const [listRule, setListRule] = useState<IRule[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetch, setIsFetch] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);

  const [dataPertanyaan, setDataPertanyaan] = useState<any>(initialPertanyaan);
  const [tmpPertanyaan, setTmpPertanyaan] = useState<any>(initialPertanyaan);

  console.log(listPertanyaan);
  console.log(listRule);

  const columns = [
    {
      title: 'Pertanyaan',
      dataIndex: 'pertanyaan',
      key: 'pertanyaan',
    },
    {
      title: 'Gejala Terkait',
      dataIndex: 'gejala',
      key: 'gejala',
      render: (_: any, record: any) => <>{record?.id_evidence?.name}</>,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: any) => <>{moment(date).format('DD MMM YYYY')}</>,
    },
    {
      title: 'Action',
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
                setTmpPertanyaan(record);
                setDataPertanyaan({
                  pertanyaan: record?.pertanyaan,
                  // rule: record?.rule,
                  id_evidence: record?.id_evidence?._id,
                });
                form.setFieldValue('pertanyaan', record?.pertanyaan);
                form.setFieldValue('id_evidence', record?.id_evidence?._id);
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
                setTmpPertanyaan(record);
                setIsModalDeleteVisible(true);
              }}
            >
              Hapus
            </Button>
          </Space>
        );
      },
    },
  ];

  const getPertanyaan = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/pertanyaan');
      setListPertanyaan(res.data);
    } catch (error: any) {
      message.error('Something went wrong!');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // const getGejala = async () => {
  //   try {
  //     const res = await axios.get('/evidence');
  //     setListGejala(res.data);
  //   } catch (error: any) {
  //     message.error('Something went wrong!');
  //     console.log(error);
  //   }
  // };

  const getRules = async () => {
    try {
      const res = await axios.get('/rules');
      setListRule(res.data);
    } catch (error: any) {
      message.error('Something went wrong!');
      console.log(error);
    }
  };

  useEffect(() => {
    // getGejala();
    getRules();
  }, []);

  useEffect(() => {
    if (isFetch) {
      getPertanyaan();
      setIsFetch(false);
    }
  }, [isFetch]);

  const tambahPertanyaan = async () => {
    form.validateFields();

    setIsLoading(true);
    console.log(dataPertanyaan);
    let res;
    try {
      if (isEdit) {
        res = await axios.put(
          `/pertanyaan/${tmpPertanyaan._id}`,
          dataPertanyaan
        );
      } else {
        res = await axios.post('/pertanyaan', dataPertanyaan);
      }

      setIsEdit(false);
      setIsFetch(true);
      form.resetFields();
      setIsModalVisible(false);
      setDataPertanyaan(initialPertanyaan);
      setTmpPertanyaan(initialPertanyaan);

      message.success(res.data.message);
    } catch (error: any) {
      console.log(error);
      message.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const hapusPertanyaan = async () => {
    setIsLoading(true);
    try {
      const res = await axios.delete(`/pertanyaan/${tmpPertanyaan?._id}`);

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

  const { isMhs } = useGlobalContext();
  const navigate = useNavigate();
  if (isMhs) {
    navigate('/dashboard');
  }

  return (
    <AppLayout title="Daftar Pertanyaan">
      <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 12 }}>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Tambah Pertanyaan
        </Button>
      </div>
      <Table
        dataSource={listPertanyaan}
        columns={columns}
        loading={isLoading}
      />
      {/* Tambah */}
      <Modal
        title={isEdit ? 'Edit Pertanyaan' : 'Tambah Pertanyaan'}
        open={isModalVisible}
        onOk={tambahPertanyaan}
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
          <Form.Item
            label="Pertanyaan"
            name="pertanyaan"
            rules={[
              { required: true, message: 'Silahkan masukan pertanyaan!' },
            ]}
          >
            <Input
              placeholder="Masukan Pertanyaan"
              onChange={(e) =>
                setDataPertanyaan({
                  ...dataPertanyaan,
                  pertanyaan: e.target.value,
                })
              }
              value={dataPertanyaan.pertanyaan}
            />
          </Form.Item>
          <Form.Item
            label="Gejala Terkait"
            name="id_evidence"
            rules={[
              { required: true, message: 'Silahkan pilih gejala terkait!' },
            ]}
          >
            <Select
              allowClear
              placeholder="Pilih Gejala Terkait"
              onChange={(value) =>
                setDataPertanyaan({ ...dataPertanyaan, id_evidence: value })
              }
              value={dataPertanyaan.id_evidence}
              options={listRule.map((rule: any) => ({
                value: rule.evidence?._id,
                label: rule?.evidence?.name,
                disabled: listPertanyaan.some(
                  (list: any) => list.id_evidence?._id === rule.evidence?._id
                ),
              }))}
            />
          </Form.Item>{' '}
        </Form>
      </Modal>
      {/* Delete */}
      <Modal
        title="Hapus Pertanyaan"
        open={isModalDeleteVisible}
        onOk={hapusPertanyaan}
        onCancel={() => {
          setIsModalDeleteVisible(false);
          setTmpPertanyaan(initialPertanyaan);
        }}
        confirmLoading={isLoading}
      >
        <Typography.Text
          style={{ fontSize: 16, display: 'block', margin: '20px 0px' }}
        >
          Apakah anda yakin ingin menghapus pertanyaan{' '}
          <span style={{ fontWeight: 'bold' }}>{tmpPertanyaan.pertanyaan}</span>{' '}
          ?
        </Typography.Text>
      </Modal>
    </AppLayout>
  );
};

export default Pertanyaan;
