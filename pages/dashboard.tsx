import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Loading, Text } from '@geist-ui/react';

import { TransactionType } from '../server/models/Transaction';

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<TransactionType[]>([]);
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/transaction');
      if (res.status === 401) {
        return router.replace('/login');
      }
      const resBody = await res.json();
      setData(resBody);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className='container'>
        <Text h1>Dashboard</Text>
        {!isLoading ? (
          data.map((element) => (
            <div key={element._id}>
              {element._id} {element.name}
            </div>
          ))
        ) : (
          <Loading type='success' size='large' />
        )}
      </div>
    </>
  );
};

export default DashboardPage;
