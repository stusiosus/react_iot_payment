import React from 'react';
import { Card, Progress } from 'antd';

export const DynamicCardsCampaign = ({ items, handleMoreClick }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
      {items.map((item, index) => (
        <Card
          size='small'
          title={item.description}
          extra={<a onClick={() => handleMoreClick(item)}>More</a>}
          style={{ width: 300 }}
          key={index}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Progress percent={parseFloat(((Number(item.totalAmount) / Number(item.targetAmount)) * 100).toFixed(1))} />
          </div>
        </Card>
      ))}
    </div>
  );
};
