import { Button, Card, Col, Collapse, Row, Table, Typography, message } from "antd";
import axios from "../../configs/axios";
import React, { useEffect, useRef, useState } from "react";
import AppLayout from "../../components/AppLayout";
import moment from "moment";
import { SolutionOutlined, DotChartOutlined, PrinterOutlined, UndoOutlined, UserOutlined } from "@ant-design/icons";
import ReactToPrint from "react-to-print";
import theme from "../../theme";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import LoadingComp from "../../components/LoadingComp";
import { IGejala } from "../Gejala";
import { HasilIdentifikasi } from "../../components/HasilIdentifikasi";
import { useGlobalContext } from "../../context/GlobalContext";

export default function Detail() {
  const { isMhs } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [detail, setDetail] = useState<any>();
  const params = useParams();
  const componentRef = useRef<any>();

  const getDetail = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/histories/${params.historyId}`);
      setDetail(res.data);
    } catch (error: any) {
      message.error("Something went wrong!");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDetail();
  }, []);

  const columns = [
    // {
    //   title: 'Kode',
    //   dataIndex: 'code',
    //   key: 'code',
    //   width: '20%',
    // },
    {
      title: "Kriteria Terpilih",
      dataIndex: "name",
      key: "name",
      width: "80%",
    },
  ];

  console.log(detail);

  return (
    <AppLayout title={`Detail Hasil Identifikasi`}>
      {isLoading && <LoadingComp />}
      {!isLoading && (
        <>
          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-bold mb-2">Hasil Identifikasi</h1>{" "}
            {isMhs ? (
              <></>
            ) : (
              <ReactToPrint
                documentTitle="hasil"
                trigger={() => (
                  <Button icon={<PrinterOutlined />} type="primary">
                    Cetak
                  </Button>
                )}
                content={() => componentRef.current}
              />
            )}
          </div>

          <p className="text-red-500 text-sm">Berikut hasil identifikasi mahasiswa</p>
          <div className="flex items-center gap-2 mb-2">
            <UserOutlined />
            <p className="mb-0">
              <span className="font-medium mr-2">{detail?.user?.fullname}</span>
              {moment(detail?.createdAt).format("DD MMM YYYY HH:MM:DD")}
            </p>
          </div>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Table dataSource={detail?.evidences} columns={columns} pagination={false} />
            </Col>
            <Col span={24}>
              <CustomCard title="Kesimpulan" headStyle={{ background: theme.primary }}>
                <div dangerouslySetInnerHTML={{ __html: detail?.payload }} />
              </CustomCard>
            </Col>
            <Col span={24}>
              <h2 className="text-lg font-[600] mb-4 text-gray-800">
                Berdasarkan kriteria yang dipilih ada beberapa rekomendasi yang bisa dilakukan :
              </h2>
              <CustomCollapse accordion expandIconPosition="end">
                {detail?.evidences.map((item: IGejala) => (
                  <Collapse.Panel header={item.name} key={item.code}>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: item.description ?? "",
                      }}
                      className="md:text-sm text-sm font-medium text-gray-800"
                    ></p>
                  </Collapse.Panel>
                ))}
                {/* </CustomCard>  */}
              </CustomCollapse>
            </Col>
          </Row>
          <div style={{ display: "none" }}>
            <HasilIdentifikasi detail={detail} ref={componentRef} />
          </div>
        </>
      )}
    </AppLayout>
  );
}

const CustomCard = styled(Card)`
  .ant-card-head-title {
    color: #fff;
  }

  .ant-card-body {
    border: 1px solid ${theme.primary};
  }
`;

const CustomCollapse = styled(Collapse)`
  .ant-collapse {
    background-color: transparent;
  }
  .ant-collapse-borderless > .ant-collapse-item {
    border: 1px solid #e5e9ec;
  }

  .ant-collapse-item {
    padding: 20px 16px 20px 28px;
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
