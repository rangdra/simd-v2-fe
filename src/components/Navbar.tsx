import styled from 'styled-components';
import theme from '../theme';
import Logo from '../assets/logo-pranata.png';
import { Link } from 'react-router-dom';
import { Button, Space } from 'antd';
import UserAvatar from './UserAvatar';
import { useGlobalContext } from '../context/GlobalContext';

export default function Navbar() {
  const { currentUser } = useGlobalContext();
  return (
    <Nav>
      <Link to="/" className="logo">
        <img src={Logo} alt="logo" />
        <h1>SIMD</h1>
      </Link>
      <div className="nav-menu">
        <Space size="large">
          <Link to="/identifikasi">Identifikasi</Link>
          {currentUser ? (
            <UserAvatar />
          ) : (
            <Link to="/login">
              <Button>Masuk</Button>
            </Link>
          )}
        </Space>
      </div>
    </Nav>
  );
}

const Nav = styled.nav`
  background-color: ${theme.primary};
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .logo {
    display: flex;
    align-items: center;

    img {
      width: 50px;
      height: 50px;
      object-fit: cover;
      margin-right: 4px;
    }

    h1 {
      font-size: 24px;
      color: ${(props) => props.theme.white};
      font-weight: 800;
      letter-spacing: 5px;
      margin: 0;
    }
  }

  .nav-menu {
    a {
      color: ${theme.white};
      font-weight: 500;
    }

    /* .ant-btn {
      background-color: ${theme.white};
    } */
  }
`;
