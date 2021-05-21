import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { getRequest, postRequest } from '../lib/fetch';
import { Button, Loading, Tabs, Text } from '@geist-ui/react';
import Transaction from '../server/models/Transaction';
//import { Plus } from '@geist-ui/react-icons';

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState('');
  const [data, setData] = useState<Transaction[]>([]);
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getRequest('/api/trans/', router).then((response) => {
      setData(response);
      //setLoading(false);
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
          data.map((element) => <div>{element.date}</div>)
        ) : (
          <Loading type='success' size='large' />
        )}
      </div>
    </>
  );
};

export default DashboardPage;
