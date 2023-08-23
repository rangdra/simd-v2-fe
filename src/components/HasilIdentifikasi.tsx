import { SolutionOutlined, DotChartOutlined, PrinterOutlined, UndoOutlined, UserOutlined } from "@ant-design/icons";
import axios from "../configs/axios";
import { Card, Col, Collapse, Row, Table, Typography } from "antd";
import moment from "moment";
import styled from "styled-components";
import { IGejala } from "../screens/Gejala";
import theme from "../theme";
import Logo from "../assets/logo-pranata.png";
import AntdIcon from "@ant-design/icons";

import React from "react";

export const HasilIdentifikasi = React.forwardRef(({ detail }: { detail: any }, ref: any) => {
  const columns = [
    //   {
    //     title: 'Kode',
    //     dataIndex: 'code',
    //     key: 'code',
    //     width: '20%',
    //   },
    {
      title: "kriteria Terpilih",
      dataIndex: "name",
      key: "name",
    },
  ];

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "8px 12px",
        width: "100%",
      }}
    >
      <div>
        <div className="flex justify-center">
          <img src={Logo} alt="logo" className="h-[160px] w-[160px] my-8" />
        </div>
        <h1 className="text-2xl font-bold my-2">Hasil Identifikasi</h1>
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
            {/* <CustomCard
                title="Berdasarkan kriteria yang dipilih ada beberapa rekomendasi yang bisa dilakukan : "
                headStyle={{ background: theme.primary }}
              >
                {detail?.evidences.map((item: IGejala) => (
                  <Row>
                    <Typography.Text strong>{item.name}: </Typography.Text>
                    <Typography.Text>{item.description}</Typography.Text>
                  </Row>
                ))}
              </CustomCard> */}
            <CustomCollapse
              accordion
              expandIconPosition="end"
              // expandIcon={({ isActive }) =>
              //   isActive ? (
              //     <AntdIcon
              //       component={IconChevron}
              //       style={{ transition: 'all .2s' }}
              //     />
              //   ) : (
              //     <AntdIcon
              //       component={IconChevron}
              //       style={{
              //         transform: 'rotate(180deg)',
              //         transition: 'all .2s',
              //       }}
              //     />
              //   )
              // }
            >
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
      </div>
    </div>
  );
});

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
