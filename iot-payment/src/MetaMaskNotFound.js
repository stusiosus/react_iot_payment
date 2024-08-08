import React from 'react';
import { Button, Alert, Typography, Space } from 'antd';

const { Text, Title } = Typography;

const MetaMaskNotFound = () => {
  return (
    <div style={styles.container}>
      <Alert
        message="MetaMask Not Found"
        description="It seems like MetaMask is not installed or not enabled in your browser."
        type="error"
        showIcon
        style={styles.alert}
      />
      <Space direction="vertical" style={styles.content}>
        <Title level={4}>Install MetaMask</Title>
        <Text>To use this application, you need to install MetaMask, a digital wallet and dApp browser extension. Only supported by chrome, Firefox , Brave , Edge and Opera browser </Text>
        <Button type="primary" href="https://metamask.io/download.html" target="_blank" rel="noopener noreferrer">
          Install MetaMask
        </Button>
      </Space>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '20px',
  },
  alert: {
    maxWidth: '600px',
    marginBottom: '20px',
  },
  content: {
    textAlign: 'center',
    maxWidth: '600px',
  },
};

export default MetaMaskNotFound;
