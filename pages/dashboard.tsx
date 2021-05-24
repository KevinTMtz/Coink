import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Loading, Text } from '@geist-ui/react';

import { TransactionType } from '../server/models/Transaction';

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<TransactionType[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [filterBy, setFilterBy] = useState('');
  const [filterSelection, setFilterSelection] = useState('');
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

  const organize = async () => {
    const body = {
      sortBy: sortBy !== '' ? sortBy : undefined,
      filterBy: filterBy !== '' ? filterBy : undefined,
      filterSelection: filterSelection !== '' ? filterSelection : undefined,
    };
    const res = await fetch('/api/transaction/organize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const resBody = await res.json();
    setData(resBody);
    setLoading(false);
  };

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
              {element.name} {element.date} {element.amount} {element.type}{' '}
              {element.category}
            </div>
          ))
        ) : (
          <Loading type='success' size='large' />
        )}
        <div>Add</div>
        <div onClick={() => setSortBy('date')}>By Date</div>
        <div onClick={() => setSortBy('amount')}>By Amount</div>
        <div onClick={() => organize()}>Sort</div>
        <div
          onClick={() => {
            setFilterBy('category'), setFilterSelection('bills');
          }}
        >
          By Category
        </div>
        <div
          onClick={() => {
            setFilterBy('type'), setFilterSelection('expense');
          }}
        >
          By Type
        </div>
        <div onClick={() => organize()}>Filter</div>
      </div>
    </>
  );
};

export default DashboardPage;
