import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'antd/dist/reset.css';
import { ConfigProvider } from 'antd';
import { ThemeProvider } from 'styled-components';
import theme from './theme';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: theme.primary,
        },
      }}
    >
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </ConfigProvider>
  </React.StrictMode>
);
