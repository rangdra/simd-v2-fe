import { Row, Table, Typography } from 'antd';
import React from 'react';
import { IKriteria } from '../../types';

const { Text } = Typography;

function TableBobotKriteria({ listKriteria }: { listKriteria: IKriteria[] }) {
  const columnsBobot = listKriteria?.map((item) => ({
    title: item.kode,
    dataIndex: item.kode,
    key: item.kode,
  }));

  let dataSource = [];
  const objBobot = listKriteria?.reduce((acc: any, curr) => {
    acc[curr.kode] = curr.bobot;

    return acc;
  }, {});
  dataSource.push(objBobot);

  return (
    <div>
      <Row style={{ marginBottom: 14 }}>
        <Text style={{ fontWeight: 800, fontSize: 20 }}>Bobot Kriteria</Text>
      </Row>
      <Table bordered columns={columnsBobot} dataSource={dataSource} />
    </div>
  );
}

export default TableBobotKriteria;
