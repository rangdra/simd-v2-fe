import { Form, Input } from 'antd';
import IllustRegister from '../../assets/illust-register.jpg';
import GoogleIcon from '../../assets/google-icon.png';
import { useGlobalContext } from '../../context/GlobalContext';
import {
  AuthContainer,
  ButtonGoogle,
  ButtonSubmit,
  FormContainer,
  FormWrapper,
  ImageContainer,
  TextLink,
  TextQuestion,
} from './styles';

export default function RegisterScreen() {
  const [form] = Form.useForm();

  const { register, loading, loginWithGoogle } = useGlobalContext();
  const onFinish = (values: any) => {
    register(values);
  };

  return (
    <AuthContainer>
      <ImageContainer>
        <img src={IllustRegister} alt="" />{' '}
      </ImageContainer>

      <FormContainer>
        <FormWrapper
          form={form}
          name="basic"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <h2>Daftar</h2>
          <Form.Item
            label="Nama"
            name="fullname"
            rules={[{ required: true, message: 'Silahkan masukan nama anda!' }]}
          >
            <Input size="large" placeholder="Ex: John Doe" />
          </Form.Item>
          {/* <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input size="large" />
          </Form.Item> */}

          <Form.Item
            label="Nama Pengguna atau NIM"
            name="username"
            rules={[
              {
                required: true,
                message: 'Silahkan masukan nama pengguna atau nim anda!',
              },
            ]}
          >
            <Input size="large" placeholder="Ex: johndoe" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Silahkan masukan password anda!' },
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 8 }}>
            <ButtonSubmit type="primary" htmlType="submit" loading={loading}>
              Submit
            </ButtonSubmit>
          </Form.Item>
          {/* <p className="or">Or</p>
          <ButtonGoogle onClick={loginWithGoogle}>
            <img src={GoogleIcon} alt="google-icon" /> Log In With Google
          </ButtonGoogle> */}
          <TextQuestion>
            Sudah punya akun? <TextLink to="/">Masuk</TextLink>
          </TextQuestion>
        </FormWrapper>
      </FormContainer>
    </AuthContainer>
  );
}
