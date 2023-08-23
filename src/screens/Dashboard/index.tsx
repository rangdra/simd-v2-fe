import { Button, Card, Col, Divider, Grid, Row, Typography } from "antd";
import {
  RightOutlined,
  ClusterOutlined,
  ApartmentOutlined,
  TeamOutlined,
  UserOutlined,
  BorderBottomOutlined,
  QuestionOutlined,
} from "@ant-design/icons";
import AppLayout from "../../components/AppLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { IconWrapper, CustomCard } from "./styles";
import { useEffect, useState } from "react";
import axios from "../../configs/axios";
import LoadingComp from "../../components/LoadingComp";
import { useGlobalContext } from "../../context/GlobalContext";
import ContentDashboard from "../../components/ContentDashboard";
import styled from "styled-components";

const Dashboard: React.FC = () => {
  const { lg } = Grid.useBreakpoint();
  const { isMhs, isSuperAdmin, isAdmin } = useGlobalContext();
  const navigate = useNavigate();
  const [totalData, setTotalData] = useState({
    users: 0,
    mahasiswa: 0,
    kategori: 0,
    gejala: 0,
    rule: 0,
    pertanyaan: 0,
  });
  const [dataPotensi, setDataPotensi] = useState<{
    mhsRendah: number;
    mhsSedang: number;
    mhsTinggi: number;
  }>({
    mhsRendah: 0,
    mhsSedang: 0,
    mhsTinggi: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const resDashboard = await axios.get("/dashboard");
        const resMhs = await axios.get("/mahasiswa");

        console.log(resMhs.data);

        const mhsRendah = resMhs.data.filter((mhs: any) => {
          if (
            !mhs.lastIdentification._id ||
            !mhs.lastIdentification.problem ||
            mhs.lastIdentification.problem.length === 0
          )
            return;

          return mhs.lastIdentification.problem[0].code === "KG1";
        });

        const mhsSedang = resMhs.data.filter((mhs: any) => {
          if (
            !mhs.lastIdentification._id ||
            !mhs.lastIdentification.problem ||
            mhs.lastIdentification.problem.length === 0
          )
            return;

          return mhs.lastIdentification.problem[0].code === "KG2";
        });

        const mhsTinggi = resMhs.data.filter((mhs: any) => {
          if (
            !mhs.lastIdentification._id ||
            !mhs.lastIdentification.problem ||
            mhs.lastIdentification.problem.length === 0
          )
            return;

          return mhs.lastIdentification.problem[0].code === "KG3";
        });

        console.log("tinggi", mhsTinggi);

        setDataPotensi({
          mhsRendah: mhsRendah?.length,
          mhsSedang: mhsSedang?.length,
          mhsTinggi: mhsTinggi?.length,
        });

        setTotalData(resDashboard.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);
  return (
    <AppLayout title={`Dashboard`}>
      {isLoading ? (
        <LoadingComp />
      ) : !isMhs ? (
        <>
          <Row gutter={[16, 16]}>
            <Col span={24} xl={8} lg={12}>
              <CustomCard onClick={() => navigate(`/mahasiswa`)}>
                <div className="left">
                  <IconWrapper>
                    <TeamOutlined />
                  </IconWrapper>
                  <div className="title">
                    <h4>Total Mahasiswa</h4>
                    <p>{totalData.mahasiswa || 0} Mahasiswa</p>
                  </div>
                </div>
                <div className="right">
                  <Button icon={<RightOutlined />} onClick={() => navigate(`/mahasiswa`)} />
                </div>
              </CustomCard>
            </Col>
            {isAdmin && (
              <Col span={24} xl={8} lg={12}>
                <CustomCard onClick={() => navigate(`/data-admin`)}>
                  <div className="left">
                    <IconWrapper>
                      <UserOutlined />
                    </IconWrapper>
                    <div className="title">
                      <h4>Total Admin</h4>
                      <p>{totalData.users || 0} Admin</p>
                    </div>
                  </div>
                  <div className="right">
                    <Button icon={<RightOutlined />} onClick={() => navigate(`/mahasiswa`)} />
                  </div>
                </CustomCard>
              </Col>
            )}

            <Col span={24} xl={8} lg={12}>
              <CustomCard onClick={() => navigate(`/kategori-do`)}>
                <div className="left">
                  <IconWrapper>
                    <ClusterOutlined />
                  </IconWrapper>
                  <div className="title">
                    <h4>Total Kategori</h4>
                    <p>{totalData.kategori || 0} Kategori</p>
                  </div>
                </div>
                <div className="right">
                  <Button icon={<RightOutlined />} onClick={() => navigate(`/kategori-do`)} />
                </div>
              </CustomCard>
            </Col>
            <Col span={24} xl={8} lg={12}>
              <CustomCard onClick={() => navigate(`/gejala-do`)}>
                <div className="left">
                  <IconWrapper>
                    <ApartmentOutlined />
                  </IconWrapper>
                  <div className="title">
                    <h4>Total Kriteria</h4>
                    <p>{totalData.gejala} Kriteria</p>
                  </div>
                </div>
                <div className="right">
                  <Button icon={<RightOutlined />} onClick={() => navigate(`/gejala-do`)} />
                </div>
              </CustomCard>
            </Col>
            <Col span={24} xl={8} lg={12}>
              <CustomCard onClick={() => navigate(`/rules`)}>
                <div className="left">
                  <IconWrapper>
                    <BorderBottomOutlined />
                  </IconWrapper>
                  <div className="title">
                    <h4>Total Rule</h4>
                    <p>{totalData.rule} Rule</p>
                  </div>
                </div>
                <div className="right">
                  <Button icon={<RightOutlined />} onClick={() => navigate(`/gejala-do`)} />
                </div>
              </CustomCard>
            </Col>
          </Row>
          <div
            style={{
              marginTop: lg ? 70 : 50,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: lg ? "80%" : "90%",
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
                      Overview Potensi DO
                    </Typography.Text>
                  </div>
                </Col>
                <Col span={24} xl={8} lg={12}>
                  <CustomCard2 bgColor="#5e81c7" hoverable>
                    <Typography.Text className="title" strong>
                      Potensi Rendah
                    </Typography.Text>
                    <Typography.Text className="count">{dataPotensi?.mhsRendah}</Typography.Text>
                    <Typography.Text className="subtitle">Mahasiswa</Typography.Text>
                  </CustomCard2>
                </Col>
                <Col span={24} xl={8} lg={12}>
                  <CustomCard2 bgColor="#f8bf28" hoverable>
                    <Typography.Text className="title" strong>
                      Potensi Sedang
                    </Typography.Text>
                    <Typography.Text className="count">{dataPotensi?.mhsSedang}</Typography.Text>
                    <Typography.Text className="subtitle">Mahasiswa</Typography.Text>
                  </CustomCard2>
                </Col>
                <Col span={24} xl={8} lg={12}>
                  <CustomCard2 bgColor="#f59081" hoverable>
                    <Typography.Text className="title" strong>
                      Potensi Tinggi
                    </Typography.Text>
                    <Typography.Text className="count">{dataPotensi?.mhsTinggi}</Typography.Text>
                    <Typography.Text className="subtitle">Mahasiswa</Typography.Text>
                  </CustomCard2>
                </Col>
              </Row>
            </div>
          </div>
        </>
      ) : (
        <ContentDashboard />
      )}
    </AppLayout>
  );
};

const CustomCard2 = styled(Card)<{ bgColor?: string }>`
  height: 200px;

  background-color: ${(props) => props.bgColor ?? "#fff"};

  .ant-card-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff !important;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 12px;

    .title {
      font-size: 20px;
      color: #fff;
      font-weight: 600;
    }

    .count {
      color: #fff;
      font-size: 32px;
      font-weight: 700;
    }

    .subtitle {
      font-size: 16px;
      color: #fff;
      font-weight: 600;
    }
  }
`;

export default Dashboard;
