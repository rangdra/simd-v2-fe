import AppLayout from "../../components/AppLayout";
import { Button, Form, Input, Modal, Select, Space, Table, TableProps, Typography, message } from "antd";
import { EditOutlined, DeleteFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "../../configs/axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import moment from "moment";
import { useGlobalContext } from "../../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import { dataRekomendasi } from "../../data";
import { truncateTextWithEllipsis } from "../../helpers";

export interface IGejala {
  code: string;
  name: string;
  _id?: string;
  description?: string;
}

const initialGejala = {
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

export default function Gejala() {
  const { isSuperAdmin, isAdmin } = useGlobalContext();
  const [form] = Form.useForm();
  const [listGejala, setListGejala] = useState<IGejala[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetch, setIsFetch] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);

  const [dataGejala, setDataGejala] = useState<IGejala>(initialGejala);
  const [tmpGejala, setTmpGejala] = useState<IGejala>(initialGejala);

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
      render: (date: any) => <div>{moment(date).format("DD MMM YYYY")}</div>,
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
    {
      title: "Solusi",
      dataIndex: "description",
      key: "description",
      width: "30%",
      render: (text: string) => (
        <div
          dangerouslySetInnerHTML={{
            __html: text ? text : "Not Set",
          }}
        />
      ),
    },

    isAdmin && {
      title: "Aksi",
      dataIndex: "action",
      key: "action",
      render: (_: any, record: IGejala) => {
        return (
          <Space>
            <Button
              icon={<EditOutlined />}
              type="primary"
              ghost
              onClick={() => {
                setIsModalVisible(true);
                setIsEdit(true);
                setTmpGejala(record);
                setDataGejala({
                  code: record?.code,
                  name: record?.name,
                  description: record?.description,
                });
                form.setFieldValue("code", record?.code);
                form.setFieldValue("name", record?.name);
                form.setFieldValue("description", record?.description);
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
                setTmpGejala(record);
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

  const getGejala = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/evidence");
      setListGejala(
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
      getGejala();
      setIsFetch(false);
    }
  }, [isFetch]);

  console.log(listGejala);

  const tambahGejala = async () => {
    form.validateFields();

    setIsLoading(true);

    let res;
    try {
      if (isEdit) {
        res = await axios.put(`/evidence/${tmpGejala._id}`, dataGejala);
      } else {
        res = await axios.post("/evidence", dataGejala);
      }

      setIsEdit(false);
      setIsFetch(true);
      form.resetFields();
      setIsModalVisible(false);
      setDataGejala(initialGejala);
      setTmpGejala(initialGejala);

      message.success(res.data.message);
    } catch (error: any) {
      console.log(error);
      message.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const hapusGejala = async () => {
    setIsLoading(true);
    console.log(tmpGejala);
    try {
      const res = await axios.delete(`/evidence/${tmpGejala?._id}`);

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
    <AppLayout title={`Daftar Kriteria`}>
      {isAdmin && (
        <div style={{ display: "flex", justifyContent: "end", marginBottom: 12 }}>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Tambah Kriteria
          </Button>
        </div>
      )}

      <Table dataSource={listGejala} columns={columns} loading={isLoading} scroll={{ x: 250 }} pagination={false} />
      {/* Tambah */}
      <Modal
        title={isEdit ? "Edit Kriteria" : "Tambah Kriteria"}
        open={isModalVisible}
        onOk={tambahGejala}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setIsEdit(false);
        }}
        confirmLoading={isLoading}
      >
        <Form style={{ marginTop: 24 }} name="basic" autoComplete="off" form={form} layout="vertical">
          {/* <Form.Item
            label="Kode kriteria"
            name="code"
            rules={[
              { required: true, message: 'Silahkan masukan kode kriteria!' },
            ]}
          >
            <Input
              placeholder="Input Kode Kriteria"
              onChange={(e) =>
                setDataGejala({ ...dataGejala, code: e.target.value })
              }
              value={dataGejala.code}
            />
          </Form.Item> */}

          <Form.Item
            label="Nama Kriteria"
            name="name"
            rules={[{ required: true, message: "Silahkan masukan nama kriteria" }]}
          >
            <Input
              placeholder="Input Nama Kriteria"
              onChange={(e) => setDataGejala({ ...dataGejala, name: e.target.value })}
              value={dataGejala.name}
            />
          </Form.Item>
          <Form.Item label="Rekomendasi terhadap kriteria" name="description">
            <ReactQuill
              theme="snow"
              value={dataGejala.description}
              onChange={(val) =>
                setDataGejala({
                  ...dataGejala,
                  description: val,
                })
              }
              modules={quillModules}
              formats={quillFormats}
            />

            {/* <Select
              dropdownClassName="custom-dropdown"
              options={dataRekomendasi.map((item) => ({
                value: item.label,
                label: item.label,
              }))}
              onChange={(e) => setDataGejala({ ...dataGejala, description: e })}
              value={dataGejala.description}
            /> */}
          </Form.Item>
        </Form>
      </Modal>
      {/* Delete */}
      <Modal
        title="Hapus Kriteria"
        open={isModalDeleteVisible}
        onOk={hapusGejala}
        onCancel={() => {
          setIsModalDeleteVisible(false);
          setTmpGejala(initialGejala);
        }}
        confirmLoading={isLoading}
      >
        <Typography.Text style={{ fontSize: 16, display: "block", margin: "20px 0px" }}>
          Apakah anda yakin ingin menghapus kriteria <span style={{ fontWeight: "bold" }}>{tmpGejala.name}</span> ?
        </Typography.Text>
      </Modal>
    </AppLayout>
  );
}
