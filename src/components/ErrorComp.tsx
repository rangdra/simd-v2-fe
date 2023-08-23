import { Spin } from 'antd';
import React from 'react';

export default function ErrorComp() {
  return (
    <div
      style={{
        height: '50vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spin spinning={true} />
    </div>
  );
}
