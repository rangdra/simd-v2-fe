import {
  Alert,
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  Form,
  Radio,
  Row,
  Select,
  Space,
  Steps,
  Table,
  message,
} from "antd";
import { SolutionOutlined, DotChartOutlined, PrinterOutlined, RedoOutlined, UserOutlined } from "@ant-design/icons";
import ReactToPrint from "react-to-print";
import { useEffect, useRef, useState } from "react";
import axios from "../configs/axios";
import styled from "styled-components";
import { useGlobalContext } from "../context/GlobalContext";
import theme from "../theme";
import moment from "moment";
import { IUser } from "../types";
import { HasilIdentifikasi } from "./HasilIdentifikasi";
import LoadingComp from "./LoadingComp";
import { removeDuplicateData, sortRules } from "../helpers";

interface IMahasiswa {
  name: string;
  nim: string;
  jurusan: string;
  jenjang: string;
  _id?: string;
}

const Identifikasi: React.FC = () => {
  const { isMhs, currentUser } = useGlobalContext();
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [listMahasiswa, setListMahasiswa] = useState<IUser[]>([]);
  const [rekomendasi, setRekomendasi] = useState<any>([]);
  const [listRule, setListRule] = useState<any>([]);
  const [hasil, setHasil] = useState<any>();
  const componentRef = useRef<any>();

  const [isLoading, setIsLoading] = useState(false);

  const getMahasiswa = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/mahasiswa");
      setListMahasiswa(res.data);
    } catch (error: any) {
      message.error("Something went wrong!");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRules = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/rules");
      setListRule(res?.data);
    } catch (error: any) {
      message.error("Something went wrong!");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMahasiswa();
    getRules();
  }, []);

  const handleNext = async () => {
    try {
      await form.validateFields();
    } catch (error: any) {
      console.error(error);
      return;
    }
    await hitungDempsterShafer();
  };

  const handleBack = () => {
    setCurrent(current - 1);
  };

  const hitungDempsterShafer = async () => {
    const keyEv = Object.keys(form.getFieldsValue()).filter((item) => item !== "mahasiswa");
    const arrEvId = keyEv.map((key) => form.getFieldsValue()[key]).filter((item) => item);

    console.log({
      evidences: arrEvId,
      mhsId: form.getFieldsValue().mahasiswa,
    });

    setIsLoading(true);
    try {
      const mhsId = isMhs ? currentUser?._id : form.getFieldsValue().mahasiswa;
      if (arrEvId.length === 0) {
        message.error("Silahkan pilih kriteria terlebih dahulu!");
        return;
      }

      if (!mhsId) {
        message.error("Silahkan pilih mahasiswa!");
        return;
      }

      const res = await axios.post("/process", {
        evidences: arrEvId,
        mhsId,
      });

      const rekomRules = sortRules(listRule, arrEvId);

      let rulePotensiTinggi = [];
      let rulePotensiSedang = [];
      let rulePotensiRendah = [];

      for (const item of rekomRules) {
        const arrKode = item.problems.map((x) => x.code);

        if (arrKode.includes("KG3")) {
          rulePotensiTinggi.push(item);
        }
        if (arrKode.includes("KG2")) {
          rulePotensiSedang.push(item);
        }
        if (arrKode.includes("KG1")) {
          rulePotensiRendah.push(item);
        }
      }

      const resR = [...rulePotensiTinggi, ...rulePotensiSedang, ...rulePotensiRendah];

      setRekomendasi(removeDuplicateData(resR));

      setCurrent(current + 1);
      setHasil(res.data);
      form.resetFields();
      if (isMhs) {
        form.setFieldValue("mahasiswa", currentUser?._id);
      }
    } catch (error: any) {
      console.log(error);
      message.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(hasil);

  const columns = [
    // {
    //   title: "Kode",
    //   dataIndex: "code",
    //   key: "code",
    //   width: "20%",
    // },
    {
      title: "Kriteria Terpilih",
      dataIndex: "name",
      key: "name",
      // width: "80%",
    },
  ];

  const isShowContent = listRule?.length > 1;

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: 360,
          width: "100%",
          backgroundColor: theme.white,
          padding: 16,
          borderRadius: 8,
        }}
      >
        <div>
          {isShowContent && (
            <Steps
              current={current}
              items={[
                {
                  title: "Isi Kriteria yang dialami",
                  status: "finish",
                  icon: <SolutionOutlined />,
                },
                {
                  title: "Hasil Identifikasi",
                  status: "finish",
                  icon: <DotChartOutlined />,
                },
              ]}
            />
          )}

          {isLoading && <LoadingComp />}
          {!isLoading && current === 0 && (
            <Row>
              {listRule.length > 1 && (
                <Col span={24}>
                  <Form style={{ marginTop: 24 }} name="basic" autoComplete="off" form={form} layout="vertical">
                    {!isMhs ? (
                      <Form.Item
                        label="Pilih Mahasiswa"
                        name="mahasiswa"
                        rules={[
                          {
                            required: true,
                            message: "Silahkan pilih mahasiswa!",
                          },
                        ]}
                        style={{ flex: 1 }}
                      >
                        <Select
                          disabled={isMhs}
                          allowClear
                          placeholder="Pilih mahasiswa"
                          options={listMahasiswa.map((mhs) => ({
                            value: mhs?._id,
                            label: `${mhs?.fullname || "-"} / ${mhs?.mahasiswa?.nim || "-"} / ${
                              mhs?.mahasiswa?.jenjang || "-"
                            } / ${mhs?.mahasiswa?.jurusan || "-"}`,
                          }))}
                          showSearch
                          filterOption={(input, option) => {
                            return (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase());
                          }}
                        />
                      </Form.Item>
                    ) : (
                      <h1 className="text-2xl font-bold mb-4">Isi kriteria berikut! </h1>
                    )}

                    {listRule.map((list: any, index: number) => (
                      <Form.Item
                        key={list?._id}
                        label={`${index + 1}. ${list?.evidence.name}`}
                        name={`evidence_${index + 1}`}
                      >
                        <Radio.Group>
                          <Radio value={`${list?.evidence?._id}`}>Ya</Radio>
                          <Radio value={false}>Tidak</Radio>
                        </Radio.Group>
                      </Form.Item>
                    ))}
                  </Form>
                </Col>
              )}

              {listRule.length <= 1 && (
                <Alert
                  message={
                    isMhs
                      ? "Ooppss identifikasi belum tersedia untuk saat ini"
                      : "Untuk melakukan identifikasi harus memiliki minimal 2 pertanyaan, silahkan input pertanyaan terlebih dahulu"
                  }
                  type="info"
                  showIcon
                  style={{ width: "100%" }}
                />
              )}
            </Row>
          )}

          {current === 1 && (
            <>
              <h1 className="text-2xl font-bold my-2">Hasil Identifikasi</h1>
              <p className="text-red-500 text-sm">Berikut hasil identifikasi mahasiswa</p>
              <div className="flex items-center gap-2 mb-2">
                <UserOutlined />
                <p className="mb-0">
                  <span className="font-medium mr-2">{hasil?.mahasiswa?.name || hasil?.user?.fullname}</span>{" "}
                  {moment(hasil?.createdAt).format("DD MMM YYYY, HH:MM:DD")}
                </p>
              </div>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <CustomTable dataSource={hasil?.evidences} columns={columns} pagination={false} />
                </Col>
                <Col span={24}>
                  <CustomCard title="Kesimpulan" headStyle={{ background: theme.primary }}>
                    <div dangerouslySetInnerHTML={{ __html: hasil?.payload }} />
                  </CustomCard>
                </Col>
                <Col span={24}>
                  <h2 className="text-xl font-[600] mb-4 text-gray-800">
                    Berdasarkan kriteria yang dipilih ada beberapa rekomendasi yang bisa dilakukan :
                  </h2>
                  <CustomCollapse accordion expandIconPosition="end">
                    {rekomendasi?.map((item: any) => (
                      <Collapse.Panel header={item?.evidence.name} key={item?.evidence.code}>
                        <p
                          dangerouslySetInnerHTML={{
                            __html: item.evidence.description,
                          }}
                          className="md:text-sm text-sm font-medium text-gray-800"
                        ></p>
                      </Collapse.Panel>
                    ))}
                  </CustomCollapse>
                </Col>
              </Row>
            </>
          )}
        </div>
        {current === 0 && isShowContent && (
          <Row style={{ justifyContent: "end", marginTop: 24 }}>
            <Button style={{ width: 150 }} type="primary" onClick={handleNext} loading={isLoading} className="btn-bold">
              Identifikasi
            </Button>
          </Row>
        )}
        {current === 1 && (
          <Row style={{ justifyContent: "center", marginTop: 24 }}>
            <Space>
              <Button type="primary" onClick={handleBack} className="btn-bold">
                <RedoOutlined /> Identifikasi Lagi
              </Button>
              {!isMhs && (
                <ReactToPrint
                  documentTitle="hasil"
                  trigger={() => (
                    <Button icon={<PrinterOutlined />} type="primary" ghost>
                      Cetak
                    </Button>
                  )}
                  content={() => componentRef.current}
                />
              )}
            </Space>
          </Row>
        )}
        <div style={{ display: "none" }}>
          <HasilIdentifikasi detail={hasil} ref={componentRef} />
        </div>
      </div>
    </>
  );
};

export default Identifikasi;

const CustomCollapse = styled(Collapse)`
  .ant-collapse {
    background-color: transparent;
  }
  .ant-collapse-borderless > .ant-collapse-item {
    border: 1px solid #e5e9ec;
  }

  .ant-collapse-item {
    padding: 20px;
    margin-bottom: 0;

    &.ant-collapse-item-active {
      background-color: #f4f6f9;
      border-color: #f4f6f9;
      .ant-collapse-header {
        color: ${theme.primary};
      }
    }

    .ant-collapse-header {
      padding: 0;
      font-size: 16px;
      font-weight: 600;
      color: #1e1e1e;
    }
    .ant-collapse-content {
      background: transparent !important;
      border: none;
    }
    .ant-collapse-content-box {
      padding: 0;
      margin-top: 16px;

      .ant-typography {
        font-size: 14px;
        font-weight: 400;
        color: #3f4c5f;
      }
    }
  }
`;

const CustomCard = styled(Card)`
  .ant-card-head-title {
    color: #fff;
  }

  .ant-card-body {
    border: 1px solid ${theme.primary};
  }
`;

const CustomTable = styled(Table)``;
