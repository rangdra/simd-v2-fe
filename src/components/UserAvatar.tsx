import { Avatar, Dropdown, MenuProps, Space, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import theme from '../theme';
import { useGlobalContext } from '../context/GlobalContext';
import { Link } from 'react-router-dom';

export default function UserAvatar({ isDashboard }: { isDashboard?: boolean }) {
  const { logout } = useGlobalContext();
  const items: MenuProps['items'] = [
    {
      key: '2',
      label: <Link to="/change-password">Ganti Password</Link>,
    },
    {
      key: '3',
      label: <a onClick={logout}>Keluar</a>,
    },
  ];

  const { currentUser } = useGlobalContext();
  return (
    <Dropdown menu={{ items }} placement="bottomLeft">
      <Space style={{ cursor: 'pointer' }}>
        {currentUser?.avatar ? (
          <Avatar src={currentUser?.avatar} />
        ) : (
          <Avatar icon={<UserOutlined />} />
        )}

        <Typography.Text
          style={{
            color: isDashboard ? theme.gray800 : theme.white,
            fontWeight: 600,
          }}
        >
          Hi, {currentUser?.fullname}
        </Typography.Text>
      </Space>
    </Dropdown>
  );
}
