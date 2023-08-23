import { Form, Input } from "antd";
import IllustLogin from "../../assets/illust.png";
import { useGlobalContext } from "../../context/GlobalContext";
import Logo from "../../assets/logo-pranata.png";
import { AuthContainer, ButtonSubmit, FormContainer, FormWrapper, ImageContainer } from "./styles";

export default function LoginScreen() {
  const { login, loading } = useGlobalContext();
  const onFinish = (values: any) => {
    login(values);
  };

  return (
    <AuthContainer>
      <FormContainer>
        <FormWrapper name="basic" onFinish={onFinish} autoComplete="off" layout="vertical">
          <div className="flex justify-center">
            <img src={Logo} alt="logo" className="h-[90px] w-[90px] mb-4" />
          </div>
          <Form.Item
            label="NIM"
            name="username"
            rules={[
              {
                required: true,
                message: "Silahkan masukan nim anda!",
              },
            ]}
          >
            <Input size="large" type="number" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Silahkan masukan password anda!" }]}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }}>
            <ButtonSubmit type="primary" htmlType="submit" loading={loading}>
              Submit
            </ButtonSubmit>
          </Form.Item>
        </FormWrapper>
      </FormContainer>

      <ImageContainer>
        <img src={IllustLogin} alt="" />
      </ImageContainer>
    </AuthContainer>
  );
}
