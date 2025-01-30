
import React from 'react';

const Loading = () => {
  return (
 <main className=' w-full  absolute inset-0 z-30 backdrop-blur-sm flex justify-center'>
        <div className='flex justify-center absolute    top-[40%]  left-[45%]'>
        <img
          src="/images/CircleLoader.gif" // URL for loading gif (you can replace it with your own gif URL)
          alt="Loading..."
          style={{ width: '100px', marginRight: '20px' }}
        />
        {/* <span>Loading...</span> */}
        </div>
        </main>
  );
};

export default Loading;
