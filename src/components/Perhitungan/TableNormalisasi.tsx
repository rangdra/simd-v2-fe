import { Row, Table, Typography } from 'antd';
import React from 'react';
import { IKriteria } from '../../types';

const { Text } = Typography;

function TableNormalisasi({ listKriteria }: { listKriteria: IKriteria[] }) {
  const columnsBobot = listKriteria?.map((item) => ({
    title: item.kode,
    dataIndex: item.kode,
    key: item.kode,
  }));

  const totalBobot = listKriteria?.reduce(
    (acc: any, curr) => acc + curr.bobot,
    0
  );
  let dataSource = [];
  const objBobot = listKriteria?.reduce((acc: any, curr) => {
    acc[curr.kode] = curr.bobot / totalBobot;

    return acc;
  }, {});
  dataSource.push(objBobot);

  return (
    <div>
      <Row style={{ marginBottom: 14 }}>
        <Text style={{ fontWeight: 800, fontSize: 20 }}>
          Normalisasi Bobot Kriteria
        </Text>
      </Row>
      <Table
        bordered
        columns={columnsBobot}
        dataSource={dataSource}
        summary={(val) => {
          const sum: any = Object.values(val[0]).reduce(
            (acc: any, curr) => acc + curr,
            0
          );

          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>
                <Text type="danger">Jumlah</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell
                index={2}
                colSpan={Object.values(val[0]).length - 1}
              >
                <Text>{sum}</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
    </div>
  );
}

export default TableNormalisasi;
