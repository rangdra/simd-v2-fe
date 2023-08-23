import { Modal } from 'antd';
import styled from 'styled-components';

export const TitleButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  h2 {
    margin: 0;
    text-transform: uppercase;
    font-size: ${(props: any) => (props.sub ? '24px' : '30px')};
    font-weight: bold;
    letter-spacing: 3px;
    color: ${(props) => props.theme.gray700};
  }

  .btn-action {
    font-weight: 600;
    /* height: 42px; */
    display: flex;
    align-items: center;
  }
`;

export const ModalAdd = styled(Modal)`
  h3 {
    margin: 0;
    text-align: center;
    text-transform: uppercase;
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 3px;
    color: ${(props) => props.theme.gray700};
    margin-bottom: 8px;
  }

  .close {
    width: 100%;
    background-color: ${(props) => props.theme.gray100};
    font-weight: 600;
  }

  .action {
    width: 100%;
    font-weight: 600;
  }
`;

export const Title = styled.h2`
  margin: 0;
  text-transform: uppercase;
  font-size: 30px;
  font-weight: bold;
  letter-spacing: 3px;
  color: ${(props) => props.theme.gray700};
`;

export const CustomCard = styled.div`
  border: 1px solid ${(props) => props.theme.gray200};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${(props) => props.theme.primary};

    button.ant-btn {
      border-color: ${(props) => props.theme.primary};

      span.anticon {
        color: ${(props) => props.theme.primary};
      }
    }
  }

  .left {
    display: flex;
    align-items: center;

    .title {
      margin-left: 12px;
      h4 {
        font-size: 18px;
        font-weight: 600;
        color: ${(props) => props.theme.gray600};
        margin-bottom: 4px;
      }

      p {
        font-size: 14px;
        color: ${(props) => props.theme.gray400};
        margin: 0;
      }
    }
  }
`;

export const IconWrapper = styled.div`
  height: 50px;
  width: 50px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;

  span.anticon {
    font-size: 20px;
    color: #fff;
  }
`;
