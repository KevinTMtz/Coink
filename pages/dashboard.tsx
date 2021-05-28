import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Grid, Loading, Text } from '@geist-ui/react';

import { TransactionType } from '../server/models/Transaction';
import Transaction from '../components/TransactionCell';
import Title from '../components/Title';

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<TransactionType[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [filterBy, setFilterBy] = useState('');
  const [filterSelection, setFilterSelection] = useState('');
  const router = useRouter();

  const categories = [
    'Bills',
    'Food',
    'Clothes',
    'Transport',
    'Entertainment',
    'Health',
    'Education',
    'Bonus',
    'Salary',
    'Sale',
    'Other',
  ];

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
      <Title>Dashboard</Title>
      <Grid.Container
        justify='center'
        gap={4}
        alignItems='center'
        style={{ maxWidth: '90vw', margin: 'auto', padding: '1em' }}
      >
        {!isLoading ? (
          data.map((element) => (
            <Transaction data={element} key={element._id} />
          ))
        ) : (
          <Loading type='success' size='large' />
        )}

        <Button onClick={() => router.push('/add-transaction')}>Añadir</Button>
        <Grid justify='space-evenly' sm={24} alignItems='center'>
          <Button onClick={() => setSortBy('date')} size='small'>
            By Date
          </Button>
          <Button onClick={() => setSortBy('amount')} size='small'>
            By Amount
          </Button>
        </Grid>
        <Grid.Container justify='center'>
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => {
                setFilterBy('category'),
                  setFilterSelection(category.toLowerCase());
              }}
              size='small'
            >
              By {category}
            </Button>
          ))}
        </Grid.Container>
        <Grid justify='space-evenly' sm={24} alignItems='center'>
          {['Expense', 'Income'].map((type) => (
            <Button
              key={type}
              onClick={() => {
                setFilterBy('type'), setFilterSelection(type.toLowerCase());
              }}
              size='small'
            >
              By {type}
            </Button>
          ))}
        </Grid>

        <Button
          onClick={() => organize()}
          disabled={sortBy !== '' || filterBy !== '' ? false : true}
        >
          Organize
        </Button>
      </Grid.Container>
    </>
  );
};

export default DashboardPage;
