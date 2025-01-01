import React from 'react';

const Loading = ({ numberOfColumns }) => {
  return (
    <tr>
      <td colSpan={numberOfColumns} style={{ 
            textAlign: 'center', 
            verticalAlign: 'middle', 
            padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img
          src="/images/loading.gif" // URL for loading gif (you can replace it with your own gif URL)
          alt="Loading..."
          style={{ width: '100px', marginRight: '20px' }}
        />
        {/* <span>Loading...</span> */}
        </div>
      </td>
    </tr>
  );
};

export default Loading;
