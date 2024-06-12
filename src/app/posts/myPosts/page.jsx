import React, { Suspense } from 'react';
import Loading from '../loading';
import { MyPostData } from '@/app/components/Client';

const Blog = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <MyPostData/>
      </Suspense>
    </div>
  );
};

export default Blog;
