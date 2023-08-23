import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';

export const ExportToExcel = ({
  apiData,
  fileName,
}: {
  apiData: any;
  fileName: string;
}) => {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const exportToCSV = (apiData: any, fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(apiData);

    // Set the width of the specific column (for example, setting column A to width 20)
    const columnsWidth = [
      { wch: 30 }, // Column A width
      { wch: 15 }, // Column B width
      { wch: 20 }, // Column C width
      { wch: 10 }, // Column D width
      { wch: 15 },
      { wch: 20 },
    ];

    ws['!cols'] = columnsWidth;

    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <Button
      type="primary"
      icon={<PrinterOutlined />}
      onClick={(e) => exportToCSV(apiData, fileName)}
    >
      Export to Excel
    </Button>
  );
};
