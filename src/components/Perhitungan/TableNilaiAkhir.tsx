import { Row, Table, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { IKriteria, IPenilaianAlternatif } from '../../types';
import axios from '../../configs/axios';
import { calculateUtility, transformMatrix } from '../../helpers';

const { Text } = Typography;
function TableNilaiAkhir({
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
          const nilaiAkhir =
            data[idx].nilai_utility &&
            data[idx].nilai_utility *
              (data[idx].subKriteriaId.kriteriaId.bobot / 100);

          console.log('data', nilaiAkhir);
          const update = async () => {
            await axios.put(
              `/keputusan/${kepId}/penilaian-alternatif/${objData._id}/nilai-akhir`,
              {
                subId: data[idx].subKriteriaId._id,
                nilai_akhir: Number(nilaiAkhir?.toFixed(3)),
              }
            );
          };
          update();

          return <>{data[idx].nilai_akhir || Number(nilaiAkhir?.toFixed(3))}</>;
        },
      })
    );

    data.push({
      title: 'Total',
      dataIndex: 'total_nilai',
      key: 'total_nilai',

      render: (data: any, objData: IPenilaianAlternatif, index: number) => {
        const nilai = objData.kriteriaTerpilih
          .map((item) => item.nilai_akhir)
          .reduce((acc, curr) => acc + curr);

        const update = async () => {
          await axios.put(
            `/keputusan/${kepId}/penilaian-alternatif/${objData._id}`,
            { total_nilai: Number(nilai.toFixed(3)) }
          );
        };

        update();
        return <>{data || Number(nilai.toFixed(3)) || '-'}</>;
      },
    });

    return data;
  }, [listKriteria]);

  return (
    <div>
      <Row style={{ marginBottom: 14 }}>
        <Text style={{ fontWeight: 800, fontSize: 20 }}>Nilai Akhir</Text>
      </Row>
      <Table bordered columns={columns} dataSource={listPenilaianAlternatif} />
    </div>
  );
}

export default TableNilaiAkhir;
