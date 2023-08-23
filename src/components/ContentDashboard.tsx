import { Button, Col, Grid, List, Row, Typography } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { RightOutlined } from "@ant-design/icons";

export default function ContentDashboard() {
  const { lg } = Grid.useBreakpoint();
  const data = [
    "Peringatan lisan : 3 Bulan",
    "Surat peringatan pertama/peringatan TK II : 6 Bulan",
    "Surat peringatan kedua /peringatan TK III : 6 Bulan",
    "Surat peringatan ketiga/peringatan tingkat IV : 6 Bulan",
    "Pembatasan kuliah sementara (Skorsing)",
    "Skorsing di berikan kepada mahasiswa yang melanggar peraturan sampai kena sanksi DO",
    "Sedang dalam pemeriksaan pihak berwajib dengan batas waktu maksimal satu semester/6 Bulan, dan bila mahasiswa dinyatakan yang bersangkutan DO",
    "Skorsing dimaksudkan untuk tindakan pengamanan, pendingin dalam rangka pengampunan terhadap mahasiswa",
  ];
  return (
    <Content>
      <div className="inner">
        <h1>Selamat Datang di Sistem Identifikasi Dini Mahasiswa Drop Out!</h1>
        <p>
          Sistem Identifikasi Dini Mahasiswa Drop Out adalah platform yang dirancang khusus untuk membantu lembaga
          pendidikan mengenali dan membeikan perhatian pada mahasiswa yang berpotensi drop out sebelum terlambat.
        </p>
        <Link to={"/hasil-potensi"}>
          <Button type="primary">
            Lihat Hasil <RightOutlined />
          </Button>
        </Link>
      </div>
      <div
        style={{
          marginTop: lg ? 30 : 50,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: lg ? "100%" : "90%",
          }}
        >
          <Row
            gutter={[
              { xs: 0, sm: 24 },
              { xs: 12, sm: 24 },
            ]}
          >
            <Col span={24}>
              <div
                style={{
                  paddingBottom: 10,
                  borderBottom: "4px solid #5e81c7",
                }}
              >
                <Typography.Text
                  style={{
                    fontSize: 32,
                    fontWeight: "bold",
                    color: "#5e81c7",
                    display: "block",
                    textAlign: "center",
                  }}
                >
                  Informasi Terkait Sanksi
                </Typography.Text>
              </div>
            </Col>
            <Col span={24}>
              <List
                header={null}
                footer={null}
                bordered
                dataSource={data}
                renderItem={(item, idx) => (
                  <List.Item>
                    {idx + 1}.{"  "} {item}
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </div>
      </div>
    </Content>
  );
}

const Content = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .inner {
    h1,
    p {
      text-align: center;
    }

    h1 {
      font-weight: 700;
      font-size: 24px;
    }

    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 8px;
  }

  @media only screen and (min-width: 992px) {
    .inner {
      width: 60%;
    }
  }
`;
