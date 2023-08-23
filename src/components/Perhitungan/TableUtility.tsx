import { Row, Table, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { IKriteria, IPenilaianAlternatif } from '../../types';
import axios from '../../configs/axios';
import { calculateUtility, transformMatrix } from '../../helpers';

const { Text } = Typography;
function TableUtility({
  listKriteria,
  listPenilaianAlternatif,
  isLoading,
  kepId,
}: {
  listKriteria: IKriteria[];
  listPenilaianAlternatif: IPenilaianAlternatif[];
  isLoading?: boolean;
  kepId: any;
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
        render: (data: any, objData: any) => {
          const arr =
            listPenilaianAlternatif &&
            listPenilaianAlternatif?.map((item: any) =>
              item.kriteriaTerpilih.map((el: any) => ({
                nilai: el.subKriteriaId.nilai,
              }))
            );

          const tr = arr && transformMatrix(arr);

          const min = Math.min(...tr[idx].map((el: any) => el.nilai));
          const max = Math.max(...tr[idx].map((el: any) => el.nilai));

          const utility = calculateUtility({
            min: min / 100,
            max: max / 100,
            type: data[idx].subKriteriaId.kriteriaId.tipe,
            value: data[idx].subKriteriaId.nilai / 100,
          });

          const update = async () => {
            await axios.put(
              `/keputusan/${kepId}/penilaian-alternatif/${objData._id}/nilai-utility`,
              {
                subId: data[idx].subKriteriaId._id,
                nilai_utility: Number(utility?.toFixed(3)),
              }
            );
          };
          update();

          return <>{data[idx].nilai_utility || Number(utility?.toFixed(3))}</>;
        },
      })
    );

    return data;
  }, [listKriteria]);

  const dataBobot = listKriteria?.map((item) => item.bobot);

  return (
    <div>
      <Row style={{ marginBottom: 14 }}>
        <Text style={{ fontWeight: 800, fontSize: 20 }}>Nilai Utility</Text>
      </Row>
      <Table
        bordered
        columns={columns}
        dataSource={listPenilaianAlternatif}
        summary={(pageData) => {
          return (
            <>
              <Table.Summary.Row className="bg-gray-100">
                <Table.Summary.Cell index={0} colSpan={2}>
                  <Text type="danger">Bobot</Text>
                </Table.Summary.Cell>
                {dataBobot?.map((item: any, idx: number) => {
                  return (
                    <Table.Summary.Cell index={idx + 1} key={idx}>
                      {item / 100}
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

export default TableUtility;
