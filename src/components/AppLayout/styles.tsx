import { Layout } from 'antd';
import styled from 'styled-components';

export const SiderCustom = styled(Layout.Sider)`
  div.ant-layout-sider-trigger {
    background-color: #2046ad !important;

    span.anticon {
      color: #fff;
    }
  }
`;

export const SiderHeader = styled.div`
  margin: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 50px;
    height: 50px;
    object-fit: cover;
  }

  h1 {
    font-size: 24px;
    color: ${(props) => props.theme.gray700};
    font-weight: 800;
    letter-spacing: 5px;
    margin: 0;
  }
`;

export const Header = styled.div`
  background-color: white;
  padding: 16px;

  .header-menu {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      display: flex;
      align-items: center;
      gap: 8px;

      h2 {
        margin: 0px;
        font-size: 22px;
        font-weight: bold;
        /* width: 90%; */
        /* letter-spacing: 3px; */
        color: ${(props) => props.theme.gray700};
      }
    }
  }

  @media only screen and (min-width: 992px) {
    .header-menu {
      .left {
        h2 {
          font-size: 28px;
        }
      }
    }
  }
`;

export const Content = styled(Layout.Content)`
  margin: 16px;
  background-color: white;
  padding: 24px;
  min-height: 360px;
  border-radius: 8px;
`;
