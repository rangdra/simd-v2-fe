import React, { ReactNode, useState } from "react";
import {
  ClusterOutlined,
  ApartmentOutlined,
  TeamOutlined,
  UserOutlined,
  DashboardOutlined,
  LogoutOutlined,
  CalculatorOutlined,
  ArrowLeftOutlined,
  BarChartOutlined,
  BorderBottomOutlined,
  HistoryOutlined,
  QuestionOutlined,
  RiseOutlined,
  MenuOutlined,
} from "@ant-design/icons";

import { Button, Divider, Dropdown, Grid, MenuProps, Row } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import Logo from "../../assets/logo-pranata.png";
import { useGlobalContext } from "../../context/GlobalContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SiderCustom, SiderHeader, Header, Content } from "./styles";
import UserAvatar from "../UserAvatar";

const { Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const AppLayout = ({ title = "Dashboard", children }: { children: ReactNode; title?: string }) => {
  const { lg, md } = Grid.useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout, isAdmin, isSuperAdmin } = useGlobalContext();

  function checkTimeOfDay() {
    let currentHour = new Date().getHours();

    if (currentHour < 12) {
      return "Pagi";
    } else if (currentHour < 18) {
      return "Sore";
    } else {
      return "Malam";
    }
  }

  const items = [
    getItem(
      "Admin Area",
      "grp",
      <UserOutlined />,
      [
        getItem("Dashboard", "/dashboard", <DashboardOutlined />),
        isAdmin ? getItem("Data Admin", "/data-admin", <UserOutlined />) : null,
        getItem("Mahasiswa", "/mahasiswa", <TeamOutlined />),
        isAdmin ? getItem("Daftar Masuk", "/log", <RiseOutlined />) : null,
      ],
      "group"
    ),
    getItem(
      "SPK Area",
      "grp-spk",
      <CalculatorOutlined />,
      [
        getItem("Kategori", "/kategori", <ClusterOutlined />),
        getItem("Kriteria", "/kriteria", <ApartmentOutlined />),
        getItem("Rule", "/rules", <BorderBottomOutlined />),
        // getItem('Pertanyaan', '/pertanyaan', <QuestionOutlined />),
        getItem("Identifikasi", "/identifikasi", <BarChartOutlined />),
        getItem("Hasil Identifikasi", "/hasil", <HistoryOutlined />),
      ],
      "group"
    ),
    getItem("Lainnya", "lainnya", <CalculatorOutlined />, [getItem("Keluar", "logout", <LogoutOutlined />)], "group"),
  ];

  const itemsMhs = [
    getItem(
      "Menu",
      "grp",
      <UserOutlined />,
      [
        getItem("Dashboard", "/dashboard", <DashboardOutlined />),
        // getItem('Identifikasi', '/identifikasi', <BarChartOutlined />),
        getItem("Hasil", "/hasil-potensi", <HistoryOutlined />),
        getItem("Keluar", "logout", <LogoutOutlined />),
      ],
      "group"
    ),
  ];

  const handleClickMenu = ({ key }: { key: any }) => {
    if (key === "logout") {
      logout();
      return;
    }
    navigate(`${key}`);
  };

  const itemsMenuMobile: MenuProps["items"] = [
    {
      key: "1",
      type: "group",
      label: "Admin Area",
      children: [
        getItem("Dashboard", "/dashboard", <DashboardOutlined />),
        isAdmin ? getItem("Data Admin", "/data-admin", <UserOutlined />) : null,
        getItem("Mahasiswa", "/mahasiswa", <TeamOutlined />),
        isAdmin ? getItem("Daftar Masuk", "/log", <RiseOutlined />) : null,
      ],
    },
    {
      key: "2",
      type: "group",
      label: "SPK Area",
      children: [
        getItem("Kategori", "/kategori", <ClusterOutlined />),
        getItem("Kriteria", "/kriteria", <ApartmentOutlined />),
        getItem("Rule", "/rules", <BorderBottomOutlined />),
        getItem("Identifikasi", "/identifikasi", <BarChartOutlined />),
        getItem("Hasil Identifikasi", "/hasil", <HistoryOutlined />),
      ],
    },
    {
      key: "3",
      type: "group",
      label: "Lainnya",
      children: [getItem("Keluar", "logout", <LogoutOutlined />)],
    },
  ];

  const itemsMenuMhsMobile: MenuProps["items"] = [
    {
      key: "1",
      type: "group",
      label: "Menu",
      children: [
        getItem("Dashboard", "/dashboard", <DashboardOutlined />),
        getItem("Identifikasi", "/identifikasi", <BarChartOutlined />),
        getItem("Hasil Identifikasi", "/hasil", <HistoryOutlined />),
        getItem("Keluar", "logout", <LogoutOutlined />),
      ],
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {md ? (
        <SiderCustom
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          // style={{
          //   overflow: 'auto',
          //   height: '100vh',
          //   position: 'fixed',
          //   left: 0,
          //   top: 0,
          //   bottom: 0,
          // }}
          // trigger={null}
        >
          <SiderHeader>
            <img src={Logo} alt="logo" />
          </SiderHeader>
          <Divider style={{ margin: "16px 0px" }} />
          <Menu
            theme="light"
            defaultSelectedKeys={[location?.pathname]}
            mode="inline"
            items={isAdmin || isSuperAdmin ? items : itemsMhs}
            onClick={handleClickMenu}
          />
        </SiderCustom>
      ) : null}

      {/* <Layout style={{ marginLeft: !collapsed ? 200 : 80 }}> */}
      <Layout>
        <Header>
          <div className="header-menu">
            <div className="left">
              <Row>
                {md ? null : (
                  <Dropdown
                    menu={{
                      items: isAdmin || isSuperAdmin ? itemsMenuMobile : itemsMenuMhsMobile,
                      onClick: handleClickMenu,
                    }}
                  >
                    <Button type="primary" icon={<MenuOutlined />}></Button>
                  </Dropdown>
                )}

                {lg && location.pathname !== "/dashboard" && (
                  <Button
                    type="ghost"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                    style={{ marginRight: 8 }}
                  />
                )}
              </Row>

              <h2>{title || "Dashboard"}</h2>
            </div>

            {currentUser ? (
              <UserAvatar isDashboard />
            ) : (
              <div>
                <Button type="primary" style={{ marginRight: 8 }}>
                  Login
                </Button>
              </div>
            )}
          </div>
        </Header>
        <Content>{children}</Content>
        <Footer style={{ textAlign: "center" }}>Sistem Identifikasi Dini Mahasiswa Drop Out</Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
