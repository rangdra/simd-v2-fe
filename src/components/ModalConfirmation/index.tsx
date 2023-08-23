import { Button, Col, Modal, Row } from 'antd';
import React from 'react';
import { CustomModal, IconWrapper } from './styles';
import { WarningOutlined } from '@ant-design/icons';

interface IProps {
  title: string;
  isVisible: boolean;
  setVisibility: (state: boolean) => void;
  isLoading?: boolean;
  submitHandler?: any;
}

export default function ModalConfirmation(props: IProps) {
  function cancelReject() {
    props.setVisibility(false);
  }

  return (
    <CustomModal
      className="modal"
      open={props.isVisible}
      footer={null}
      closable={false}
    >
      <Row justify="center">
        <IconWrapper>
          <WarningOutlined />
        </IconWrapper>
      </Row>

      <h3>{props.title}</h3>
      <p>Anda yakin ingin menghapus item ini?</p>
      <Row style={{ marginTop: 24 }} gutter={16}>
        <Col span={12}>
          <Button type="text" onClick={cancelReject} className="close">
            Close
          </Button>
        </Col>
        <Col span={12}>
          <Button
            type="primary"
            onClick={props.submitHandler}
            className="action"
          >
            Hapus
          </Button>
        </Col>
      </Row>
    </CustomModal>
  );
}
