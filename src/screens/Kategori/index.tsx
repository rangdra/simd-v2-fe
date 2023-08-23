import AppLayout from "../../components/AppLayout";
import { Button, Form, Input, Modal, Space, Table, TableProps, Typography, message } from "antd";
import { EditOutlined, DeleteFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "../../configs/axios";
import moment from "moment";
import { useGlobalContext } from "../../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export interface IKategori {
  code: string;
  name: string;
  _id?: string;
  description?: string;
}

const initialKategori = {
  code: "",
  name: "",
  description: "",
};

const quillModules = {
  toolbar: [
    // [{ header: [1, 2, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};

const quillFormats = [
  // 'header',
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
];

const KategoriDO = () => {
  const { isSuperAdmin, isAdmin } = useGlobalContext();
  const [form] = Form.useForm();
  const [listKategori, setListKategori] = useState<IKategori[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetch, setIsFetch] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);

  const [dataKategori, setDataKategori] = useState<IKategori>(initialKategori);
  const [tmpKategori, setTmpKategori] = useState<IKategori>(initialKategori);

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      render: (no: number) => <div>{no}</div>,
    },
    {
      title: "Tanggal dibuat",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: any) => <>{moment.utc(date).format("DD MMM YYYY")}</>,
    },
    // {
    //   title: 'Kode',
    //   dataIndex: 'code',
    //   key: 'code',
    // },
    {
      title: "Nama",
      dataIndex: "name",
      key: "name",
    },
    // {
    //   title: 'Solusi',
    //   dataIndex: 'description',
    //   key: 'description',
    //   width: '20%',
    //   render: (text: string) => (
    //     <div dangerouslySetInnerHTML={{ __html: text ? text : 'Not Set' }} />
    //   ),
    // },

    isAdmin && {
      title: "Aksi",
      dataIndex: "action",
      key: "action",
      render: (_: any, record: IKategori) => {
        return (
          <Space>
            <Button
              icon={<EditOutlined />}
              type="primary"
              ghost
              onClick={() => {
                setIsModalVisible(true);
                setIsEdit(true);
                setTmpKategori(record);
                setDataKategori({
                  code: record?.code,
                  name: record?.name,
                  description: record?.description,
                });
                form.setFieldValue("code", record?.code);
                form.setFieldValue("description", record?.description);
                form.setFieldValue("name", record?.name);
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
                setTmpKategori(record);
                setIsModalDeleteVisible(true);
              }}
            >
              Hapus
            </Button>
          </Space>
        );
      },
    },
  ].filter(Boolean) as TableProps<any>["columns"];

  console.log(listKategori);
  const getKategori = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/problems");
      setListKategori(
        res.data.map((item: any, idx: number) => ({
          no: idx + 1,
          ...item,
        }))
      );
    } catch (error: any) {
      message.error("Something went wrong!");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isFetch) {
      getKategori();
      setIsFetch(false);
    }
  }, [isFetch]);

  const tambahKategori = async () => {
    setIsLoading(true);

    let res;
    try {
      if (isEdit) {
        res = await axios.put(`/problems/${tmpKategori._id}`, dataKategori);
      } else {
        res = await axios.post("/problems", dataKategori);
      }

      setIsEdit(false);
      setIsFetch(true);
      form.resetFields();
      setIsModalVisible(false);
      setDataKategori(initialKategori);
      setTmpKategori(initialKategori);

      message.success(res.data.message);
    } catch (error: any) {
      console.log(error);
      message.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const hapusKategori = async () => {
    form.validateFields();

    setIsLoading(true);
    try {
      const res = await axios.delete(`/problems/${tmpKategori?._id}`);

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
    navigate("/dashboard");
  }

  return (
    <AppLayout title="Daftar Kategori">
      {isAdmin && (
        <div style={{ display: "flex", justifyContent: "end", marginBottom: 12 }}>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Tambah Kategori
          </Button>
        </div>
      )}

      <Table dataSource={listKategori} columns={columns} loading={isLoading} pagination={false} scroll={{ x: 250 }} />
      {/* Tambah */}
      <Modal
        title={isEdit ? "Edit Kategori" : "Tambah Kategori"}
        open={isModalVisible}
        onOk={tambahKategori}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setIsEdit(false);
        }}
        confirmLoading={isLoading}
      >
        <Form style={{ marginTop: 24 }} name="basic" autoComplete="off" form={form} layout="vertical">
          {/* <Form.Item
            label="Kode Kategori"
            name="code"
            rules={[
              { required: true, message: 'Silahkan masukan kode kategori!' },
            ]}
          >
            <Input
              placeholder="Input Kode Kategori"
              onChange={(e) =>
                setDataKategori({ ...dataKategori, code: e.target.value })
              }
              value={dataKategori.code}
            />
          </Form.Item> */}

          <Form.Item
            label="Nama Kategori"
            name="name"
            rules={[{ required: true, message: "Silahkan masukan nama kategori!" }]}
          >
            <Input
              placeholder="Input Nama Kategori"
              onChange={(e) => setDataKategori({ ...dataKategori, name: e.target.value })}
              value={dataKategori.name}
            />
          </Form.Item>
          {/* <Form.Item label="Solusi" name="description">
            <ReactQuill
              theme="snow"
              value={dataKategori.description}
              onChange={(val) =>
                setDataKategori({
                  ...dataKategori,
                  description: val,
                })
              }
              modules={quillModules}
              formats={quillFormats}
            />
          </Form.Item> */}
        </Form>
      </Modal>
      {/* Delete */}
      <Modal
        title="Hapus Kategori"
        open={isModalDeleteVisible}
        onOk={hapusKategori}
        onCancel={() => {
          setIsModalDeleteVisible(false);
          setTmpKategori(initialKategori);
        }}
        confirmLoading={isLoading}
      >
        <Typography.Text style={{ fontSize: 16, display: "block", margin: "20px 0px" }}>
          Apakah anda yakin ingin menghapus kategori <span style={{ fontWeight: "bold" }}>{tmpKategori.name}</span> ?
        </Typography.Text>
      </Modal>
    </AppLayout>
  );
};

export default KategoriDO;
