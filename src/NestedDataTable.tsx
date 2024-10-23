// NestedDataTable.tsx

import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';

interface DataType {
  key: string;
  fileName?: string;
  [key: string]: any;
  children?: DataType[];
}

const NestedDataTable: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from your API endpoint running on port 3010
    axios
      .get('http://localhost:3012/data') // Updated URL with port 3010
      .then((response) => {
        // Process and structure your data
        const structuredData = processData(response.data);
        setData(structuredData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
        setLoading(false);
      });
  }, []);

  const processData = (rawData: any): DataType[] => {
    const processedData: DataType[] = [];

    Object.keys(rawData).forEach((fileName, index) => {
      const fileData = rawData[fileName];
      const { data } = fileData;

      const children = data.map((item: any, idx: number) => ({
        key: `${index}-${idx}`,
        ...item,
      }));

      processedData.push({
        key: `${index}`,
        fileName: fileData.filename,
        children,
      });
    });

    return processedData;
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'File Name',
      dataIndex: 'fileName',
      key: 'fileName',
      // Only display this column for parent rows
      render: (text, record) => (record.children ? text : null),
    },
    {
      title: 'Vessel Name',
      dataIndex: 'VESSEL NAME',
      key: 'VESSEL NAME',
    },
    {
      title: 'Voyage',
      dataIndex: 'VOYAGE',
      key: 'VOYAGE',
    },
    {
      title: 'ETA',
      dataIndex: 'ETA',
      key: 'ETA',
    },
    {
      title: 'ETD',
      dataIndex: 'ETD',
      key: 'ETD',
    },
    {
      title: 'Berth',
      dataIndex: 'BERTH',
      key: 'BERTH',
    },
    // Add more columns as needed based on your data structure
  ];

  if (loading) {
    return <Spin tip="Loading data..." />;
  }

  if (error) {
    return (
      <Alert message="Error" description={error} type="error" showIcon />
    );
  }

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 10 }}
      expandable={{ defaultExpandAllRows: true }}
      rowKey="key"
    />
  );
};

export default NestedDataTable;