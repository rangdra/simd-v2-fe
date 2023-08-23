import { Row, Table, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { IKriteria, IPenilaianAlternatif } from '../../types';
import axios from '../../configs/axios';
import { calculateUtility, transformMatrix } from '../../helpers';

const { Text } = Typography;
function TablePerankingan({
  listKriteria,
  listPenilaianAlternatif,
  isLoading,
}: {
  listKriteria: IKriteria[];
  listPenilaianAlternatif: IPenilaianAlternatif[];
  isLoading?: boolean;
}) {
  const columns = useMemo(() => {
    let data: any = [
      {
        title: 'Alternatif',
        dataIndex: 'alternatifId',
        key: 'alternatifId',
        width: '50%',
        render: (data: any) => {
          return <>{data?.title}</>;
        },
      },
      {
        title: 'Total Nilai',
        dataIndex: 'total_nilai',
        key: 'total_nilai',
        width: '25%',
      },
      {
        title: 'Rankng',
        dataIndex: 'rank',
        key: 'rank',
        width: '25%',
        render: (_: any, __: any, idx: number) => <>{idx + 1}</>,
      },
    ];

    return data;
  }, [listKriteria]);

  console.log(listPenilaianAlternatif);
  return (
    <div>
      <Row style={{ marginBottom: 14 }}>
        <Text style={{ fontWeight: 800, fontSize: 20 }}>Perankingan</Text>
      </Row>
      <Table bordered columns={columns} dataSource={listPenilaianAlternatif} />
    </div>
  );
}

export default TablePerankingan;
