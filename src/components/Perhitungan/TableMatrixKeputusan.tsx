import { Row, Table, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { IKriteria, IPenilaianAlternatif } from '../../types';
import axios from '../../configs/axios';
import { transformMatrix } from '../../helpers';

const { Text } = Typography;
function TableMatrixKeputusan({
  listKriteria,
  listPenilaianAlternatif,
  isLoading,
}: {
  listKriteria: IKriteria[];
  listPenilaianAlternatif: IPenilaianAlternatif[];
  isLoading: boolean;
}) {
  const columns = useMemo(() => {
    let data: any = [
      {
        title: 'No',
        dataIndex: 'no',
        key: 'no',
        width: '5%',
      },

      {
        title: 'Alternatif',
        dataIndex: 'alternatifId',
        key: 'alternatifId',
        render: (data: any) => {
          return <>{data?.title}</>;
        },
      },
    ];
    listKriteria.map((item, idx) =>
      data.push({
        title: `${item.title} (${item.kode})`,
        dataIndex: 'kriteriaTerpilih',
        key: 'kriteriaTerpilih',
        render: (data: any, arrData: any) => {
          return <>{data[idx]?.subKriteriaId.nilai}</>;
        },
      })
    );

    return data;
  }, [listKriteria]);

  return (
    <div>
      <Row style={{ marginBottom: 14 }}>
        <Text style={{ fontWeight: 800, fontSize: 20 }}>Matrix Keputusan</Text>
      </Row>
      <Table
        loading={isLoading}
        bordered
        columns={columns}
        dataSource={listPenilaianAlternatif}
        summary={(pageData) => {
          const arr =
            pageData &&
            pageData?.map((item) =>
              item.kriteriaTerpilih.map((el) => el.subKriteriaId.nilai)
            );
          const tr = arr && transformMatrix(arr);

          return (
            <>
              <Table.Summary.Row className="bg-gray-100">
                <Table.Summary.Cell index={0} colSpan={2}>
                  <Text type="danger">Min</Text>
                </Table.Summary.Cell>
                {tr?.map((item: number[], idx: number) => {
                  const min = Math.min(...item);
                  return (
                    <Table.Summary.Cell index={idx + 1} key={idx}>
                      {min}
                    </Table.Summary.Cell>
                  );
                })}
              </Table.Summary.Row>
              <Table.Summary.Row className="bg-gray-100">
                <Table.Summary.Cell index={0} colSpan={2}>
                  <Text type="danger">Max</Text>
                </Table.Summary.Cell>
                {tr?.map((item: number[], idx: number) => {
                  const max = Math.max(...item);
                  return (
                    <Table.Summary.Cell index={idx + 1} key={idx}>
                      {max}
                    </Table.Summary.Cell>
                  );
                })}
              </Table.Summary.Row>
            </>
          );
        }}
      />
    </div>
  );
}

export default TableMatrixKeputusan;
