import AppLayout from '../../components/AppLayout';
import { Table, Tag, message } from 'antd';
import { useEffect, useState } from 'react';
import axios from '../../configs/axios';
import moment from 'moment';
import { ERoleType } from '../../types';

import 'moment/locale/id';
import { useGlobalContext } from '../../context/GlobalContext';
import { useNavigate } from 'react-router-dom';

moment.updateLocale('en', {
  weekdays: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
});
const LoginLog = () => {
  const [listLogin, setListLogin] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { isMhs } = useGlobalContext();
  const navigate = useNavigate();
  if (isMhs) {
    navigate('/dashboard');
  }

  const columns = [
    {
      title: 'Nama',
      dataIndex: 'fullname',
      key: 'fullname',
      render: (text: string, record: any) => (
        <>{record?.user?.fullname || record?.user?.username}</>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (text: string, record: any) => (
        <>
          <Tag
            color={record?.user?.role === ERoleType.admin ? 'red' : 'orange'}
          >
            {record?.user?.role?.split('_')?.join(' ')}
          </Tag>
        </>
      ),
    },

    {
      title: 'Masuk Sistem',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: any) => (
        <>{moment(date).format('dddd, DD MMM YYYY, HH:mm:ss')}</>
      ),
    },
  ];

  const getKategori = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/auth/login-log');
      setListLogin(res.data);
    } catch (error: any) {
      message.error('Something went wrong!');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getKategori();
  }, []);

  return (
    <AppLayout title="Daftar Login">
      <Table
        dataSource={listLogin}
        columns={columns}
        loading={isLoading}
        scroll={{ x: true }}
      />
    </AppLayout>
  );
};

export default LoginLog;
