import React, { Suspense } from 'react';
import { PostData } from '../components/Client';
import Loading from './loading';

const Blog = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <PostData />
      </Suspense>
    </div>
  );
};

export default Blog;
