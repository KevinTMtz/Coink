import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { getRequest } from '../lib/fetch';
import { Loading, Text } from '@geist-ui/react';
import Transaction from '../server/models/Transaction';

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<Transaction[]>([]);
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getRequest('/api/transaction', router).then((response) => {
      setData(response);
      setLoading(false);
    });
  }, []);
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className='container'>
        <Text h1>Dashboard</Text>
        {!isLoading ? (
          data.map((element, index) => (
            <div key={`Data-${index}`}>{element.date}</div>
          ))
        ) : (
          <Loading type='success' size='large' />
        )}
      </div>
    </>
  );
};

export default DashboardPage;
