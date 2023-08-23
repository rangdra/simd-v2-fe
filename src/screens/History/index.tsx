import { Button, Form, Input, Modal, Select, Space, Table, Tag, Typography, message } from "antd";
import { DeleteFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "../../configs/axios";
import moment from "moment";
import AppLayout from "../../components/AppLayout";
import { useGlobalContext } from "../../context/GlobalContext";
import { Link } from "react-router-dom";
import { TableProps } from "antd/es/table";
import theme from "../../theme";

const History = () => {
  moment.locale("id");

  const [listHistory, setListHistory] = useState<any>([]);
  const { isMhs, currentUser, isAdmin } = useGlobalContext();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetch, setIsFetch] = useState(true);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);

  const [tmpHistory, setTmpHistory] = useState<any>();

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
      render: (date: any) => <div>{moment(date).format("DD MMM YYYY HH:MM:DD")}</div>,
    },
    {
      title: "Nama",
      dataIndex: "mahasiswa",
      key: "mahasiswa",
      width: "20%",
      render: (_: any, record: any) => (
        <Link style={{ color: theme.gray800, textDecoration: "underline" }} to={`/hasil/${record._id}`}>
          {record.user.fullname}
        </Link>
      ),
    },
    // {
    //   title: 'Kriteria Terpilih',
    //   dataIndex: 'gejala',
    //   key: 'gejala',
    //   render: (_: any, record: any) => (
    //     <div>
    //       {record.evidences.map((evidence: IGejala) => (
    //         <Tag color="blue">{evidence.name}</Tag>
    //       ))}
    //     </div>
    //   ),
    // },
    {
      title: "Kegagalan (%)",
      dataIndex: "kegagalan",
      key: "kegagalan",
      render: (_: any, record: any) => <div>{record?.percentage || 0}</div>,
    },
    {
      title: "Potensi",
      dataIndex: "potensi",
      key: "potensi",
      render: (_: any, record: any) => (
        <div>
          {record?.problem.length > 0
            ? record?.problem?.map(
                (x: { name: string }, idx: number) => `${x.name}${record?.problem.length - 1 !== idx ? ", " : ""}`
              )
            : "-"}
        </div>
      ),
    },
    // {
    //   title: 'Hasil',
    //   dataIndex: 'hasil',
    //   key: 'hasil',
    //   render: (_: any, record: any) => (
    //     <div dangerouslySetInnerHTML={{ __html: record.payload }} />
    //   ),
    // },
    isAdmin && {
      title: "Aksi",
      dataIndex: "action",
      key: "action",
      render: (_: any, record: any) => {
        return (
          <Space>
            <Button
              icon={<DeleteFilled />}
              type="primary"
              danger
              ghost
              onClick={() => {
                setTmpHistory(record);
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

  const getHistories = async () => {
    setIsLoading(true);
    let url = isMhs ? `/histories?userId=${currentUser?._id}` : "/histories";
    try {
      const resHistory = await axios.get(url);

      setListHistory(
        resHistory.data.map((item: any, idx: number) => ({
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
      getHistories();
      setIsFetch(false);
    }
  }, [isFetch]);

  const hapusHistory = async () => {
    setIsLoading(true);
    try {
      const res = await axios.delete(`/histories/${tmpHistory?._id}`);

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

  return (
    <AppLayout title="Daftar Hasil Identifikasi">
      <Table dataSource={listHistory} columns={columns} loading={isLoading} scroll={{ x: 250 }} />

      {/* Delete */}
      <Modal
        title="Hapus History"
        open={isModalDeleteVisible}
        onOk={hapusHistory}
        onCancel={() => {
          setIsModalDeleteVisible(false);
          setTmpHistory(null);
        }}
        confirmLoading={isLoading}
      >
        <Typography.Text style={{ fontSize: 16, display: "block", margin: "20px 0px" }}>
          Apakah anda yakin ingin menghapus riwayat ini ?
        </Typography.Text>
      </Modal>
    </AppLayout>
  );
};

export default History;
