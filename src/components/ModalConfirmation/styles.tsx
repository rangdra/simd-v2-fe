import { Modal } from 'antd';
import styled from 'styled-components';

export const CustomModal = styled(Modal)`
  /* display: flex;
  align-items: center;
  flex-direction: column; */

  h3 {
    margin-bottom: 16px;
    text-align: center;
    text-transform: uppercase;
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 3px;
    color: ${(props) => props.theme.gray700};
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

export const IconWrapper = styled.div`
  height: 50px;
  width: 50px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.gray200};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;

  span.anticon {
    font-size: 20px;
  }
`;
