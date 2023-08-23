import { Button, Form } from 'antd';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const AuthContainer = styled.div`
  height: 100vh;
  display: flex;
  background-color: #fff;
`;

export const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.primary};
  width: 100%;

  @media only screen and (min-width: 992px) {
    width: 50%;
  }
`;

export const ImageContainer = styled.div`
  justify-content: center;
  align-items: center;
  width: 50%;
  display: none;

  img {
    width: 500px;
    height: 400px;
    object-fit: cover;
    display: none;
  }

  @media only screen and (min-width: 992px) {
    display: flex;
    img {
      display: block;
    }
  }
`;

export const FormWrapper = styled(Form)`
  width: 80%;
  padding: 24px;
  background-color: white;
  box-shadow: ${(props) => props.theme.shadow};
  border-radius: 16px;

  h2 {
    font-size: 30px;
    font-weight: 700;
    letter-spacing: 5px;
    text-align: center;
    text-transform: uppercase;
    color: ${(props) => props.theme.gray700};
  }

  p.or {
    font-size: 14px;
    margin-bottom: 8px !important;

    text-align: center;
  }

  @media only screen and (min-width: 992px) {
    width: 60%;
  }
`;

export const ButtonSubmit = styled(Button)`
  width: 100%;
  height: 35px;
`;

export const ButtonGoogle = styled(Button)`
  width: 100%;
  margin-bottom: 16px;
  font-size: 12px;

  img {
    height: 14px;
    width: 14px;
    /* margin-right: 2px; */
    margin-right: 6px;
  }
`;

export const TextQuestion = styled.p`
  font-size: 14px;
  color: ${(props) => props.theme.gray600};
`;

export const TextLink = styled(Link)`
  color: ${(props) => props.theme.link};
  text-decoration: underline;

  &:hover {
    opacity: 0.7;
  }
`;
