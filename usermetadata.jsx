import React from 'react';
import { Card, Typography } from 'antd';

const { Text } = Typography;

const UserMetadataBox = () => {
  // Sample user metadata
  const userMetadata = {
    Name: 'John Doe',
    Email: 'john.doe@example.com',
    Age: '30',
    Location: 'New York'
  };

  return (
    <Card 
      style={{
        maxWidth: '350px',
        border: '1px solid #000', // 1px border
        borderRadius: '4px',
        boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
      }}
      bodyStyle={{ padding: '1px' }} // Ensures card body padding is 1px
    >
      <div 
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '5px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {Object.entries(userMetadata).map(([key, value]) => (
          <div key={key} style={{ display: 'flex', gap: '2px', padding: '1px' }}> {/* 1px padding */}
            <Text strong>{key}:</Text>
            <Text>{value}</Text>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default UserMetadataBox;
