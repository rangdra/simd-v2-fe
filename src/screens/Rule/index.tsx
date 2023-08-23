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
import { EditOutlined, DeleteFilled, CheckOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import axios from '../../configs/axios';
import { IGejala } from '../Gejala';
import { IKategori } from '../Kategori';
import { useGlobalContext } from '../../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

// interface IRule {
//   id_problem: any;
//   id_evidence: any;
//   cf: number;
//   _id?: string;
// }

export interface IRule {
  _id?: string;
  evidence: IGejala;
  problems: IKategori[];
  cf: number;
}

const initialRule = {
  _id: '',
  id_problem: '',
  id_evidence: '',
  cf: 0,
};

const RuleDO = () => {
  const [form] = Form.useForm();
  const [listRule, setListRule] = useState<IRule[]>([]);
  const [listGejala, setListGejala] = useState<IGejala[]>([]);
  const [listKategori, setListKategori] = useState<IKategori[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetch, setIsFetch] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);

  const [dataRule, setDataRule] = useState<any>(initialRule);
  const [tmpRule, setTmpRule] = useState<any>(initialRule);

  let columns = [];

  columns.push(
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render: (no: number) => <div>{no}</div>,
    },
    {
      title: 'Kriteria',
      dataIndex: 'evidence',
      key: 'evidence',
      // width: '25%',
      render: (_: any, record: any) => <>{record.evidence.name}</>,
    }
  );

  listKategori.forEach((item) => {
    columns.push({
      title: `${item.name} (${item.code})`,
      dataIndex: item.name.toLowerCase(),
      key: item.name.toLowerCase(),
      // width: '25%',
      render: (_: any, record: any) => (
        <>
          {record.problems.some(
            (problem: any) => problem.code === item.code
          ) ? (
            <Button type="primary" icon={<CheckOutlined />} />
          ) : null}
        </>
      ),
    });
  });

  columns.push(
    {
      title: 'Bobot',
      dataIndex: 'cf',
      key: 'cf',
      // width: '25%',
    },
    {
      title: 'Aksi',
      dataIndex: 'action',
      key: 'action',
      // width: '25%',
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
                setTmpRule(record);
                setDataRule({
                  _id: record._id,
                  id_evidence: record?.evidence?._id,
                  id_problem: record?.problems?.map(
                    (problem: any) => problem?._id
                  ),
                  cf: record?.cf,
                });
                form.setFieldValue('gejala', record?.evidence?._id);
                form.setFieldValue(
                  'kategori',
                  record?.problems.map((problem: any) => problem?._id)
                );
                form.setFieldValue('cf', record?.cf);
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
                setTmpRule(record);
                setIsModalDeleteVisible(true);
              }}
            >
              Hapus
            </Button>
          </Space>
        );
      },
    }
  );

  const getKategori = async () => {
    try {
      const res = await axios.get('/problems');
      setListKategori(res.data);
    } catch (error: any) {
      message.error('Something went wrong!');
      console.log(error);
    }
  };

  const getGejala = async () => {
    try {
      const res = await axios.get('/evidence');
      setListGejala(res.data);
    } catch (error: any) {
      message.error('Something went wrong!');
      console.log(error);
    }
  };

  useEffect(() => {
    getGejala();
    getKategori();
  }, []);

  console.log(listGejala);
  const getRule = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/rules');
      setListRule(
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
      getRule();
      setIsFetch(false);
    }
  }, [isFetch]);

  const tambahRule = async () => {
    form.validateFields();

    setIsLoading(true);

    try {
      if (+dataRule.cf > 1) {
        message.error('Bobot tidak boleh lebih dari 1');
        return;
      }

      if (dataRule.id_problem.length > 0) {
        let data: any = [];

        dataRule.id_problem.forEach((id: string) =>
          data.push({
            id_evidence: dataRule.id_evidence,
            id_problem: id,
            cf: dataRule.cf,
          })
        );

        if (isEdit) {
          await axios.put(`/rules/${tmpRule._id}`, { data });
        } else {
          await axios.post('/rules', { data });
        }

        setIsEdit(false);
        setIsFetch(true);
        form.resetFields();
        setIsModalVisible(false);
        setDataRule(initialRule);
        setTmpRule(initialRule);

        message.success(
          isEdit ? 'Rule berhasil diupdate!' : 'Rule berhasil ditambahkan!'
        );
      } else {
        message.error('Pilih kategori terlebih dahulu');
      }
    } catch (error: any) {
      console.log(error);
      message.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const hapusRule = async () => {
    setIsLoading(true);
    try {
      const res = await axios.delete(`/rules/${tmpRule?.evidence._id}`);

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
    <AppLayout title="Daftar Rule">
      <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 12 }}>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Tambah Rule
        </Button>
      </div>
      <Table
        dataSource={listRule}
        columns={columns}
        loading={isLoading}
        scroll={{ x: 250 }}
        pagination={false}
      />
      {/* Tambah */}
      <Modal
        title={isEdit ? 'Edit Rule' : 'Tambah Rule'}
        open={isModalVisible}
        onOk={tambahRule}
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
            label="Kriteria"
            name="gejala"
            rules={[{ required: true, message: 'Silahkan pilih kriteria!' }]}
          >
            <Select
              allowClear
              dropdownClassName="custom-dropdown"
              placeholder="Pilih kriteria!"
              onChange={(value) =>
                setDataRule({ ...dataRule, id_evidence: value })
              }
              options={listGejala.map((gejala) => ({
                value: gejala._id,
                label: gejala.name,
                disabled: listRule.some(
                  (rule) => rule.evidence._id === gejala._id
                ),
              }))}
            />
          </Form.Item>{' '}
          <Form.Item
            label="Kategori"
            name="kategori"
            rules={[{ required: true, message: 'Silahkan pilih kategori!' }]}
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Pilih gejala!"
              onChange={(value) =>
                setDataRule({ ...dataRule, id_problem: value })
              }
              options={listKategori.map((kate) => ({
                value: kate._id,
                label: `${kate.name} (${kate.code})`,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="Bobot"
            name="cf"
            rules={[
              { required: true, message: 'Silahkan masukan nilai bobot!' },
            ]}
          >
            <Input
              placeholder="0 - 1"
              onChange={(e) =>
                setDataRule({ ...dataRule, cf: +e.target.value })
              }
              value={dataRule.cf}
              type="number"
            />
          </Form.Item>
        </Form>
      </Modal>
      {/* Delete */}
      <Modal
        title="Hapus Rule"
        open={isModalDeleteVisible}
        onOk={hapusRule}
        onCancel={() => {
          setIsModalDeleteVisible(false);
          setTmpRule(initialRule);
        }}
        confirmLoading={isLoading}
      >
        <Typography.Text
          style={{ fontSize: 16, display: 'block', margin: '20px 0px' }}
        >
          Apakah anda yakin ingin menghapus rule ini ?
        </Typography.Text>
      </Modal>
    </AppLayout>
  );
};

export default RuleDO;
