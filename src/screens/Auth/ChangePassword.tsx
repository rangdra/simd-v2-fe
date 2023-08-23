import { Button, Card, Form, Input, message } from 'antd';
import axios from '../../configs/axios';
import { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import theme from '../../theme';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/GlobalContext';

export default function ChangePassword() {
  const { currentUser } = useGlobalContext();
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values: any) => {
    console.log(values);

    if (values.newPassword !== values.reTypePassword) {
      message.error('Password tidak sama!');
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.put(
        `/auth/${currentUser?._id}/change-password`,
        values
      );

      form.resetFields();

      message.success(res.data.message);
    } catch (error: any) {
      console.log(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <AppLayout title={'Ganti Password'}>
      <Form
        style={{ width: '50%' }}
        name="basic"
        autoComplete="off"
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Password Baru"
          name="newPassword"
          rules={[
            { required: true, message: 'Silahkan masukan password baru anda!' },
          ]}
        >
          <Input.Password
            placeholder="Masukan password baru"
            // onChange={(e) => setData({ ...data, newPassword: e.target.value })}
            // value={data.newPassword}
          />
        </Form.Item>
        <Form.Item
          label="Masukan Ulang Password Anda"
          name="reTypePassword"
          rules={[
            {
              required: true,
              message: 'Silahkan masukan ulang password baru anda!',
            },
          ]}
        >
          <Input.Password placeholder="Masukan ulang password" />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" loading={isLoading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
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
