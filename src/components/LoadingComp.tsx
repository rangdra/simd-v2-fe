import { Spin } from 'antd';
import React from 'react';

export default function LoadingComp() {
  return (
    <div
      style={{
        height: 300,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spin spinning />
    </div>
  );
}
