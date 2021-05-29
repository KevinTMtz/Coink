import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Grid, Loading } from '@geist-ui/react';

import Title from '../components/Title';
import TransactionCell from '../components/TransactionCell';
import {
  expenseCategoriesTranslations,
  incomeCategoriesTranslations,
  typeTranslations,
} from '../lib/translations';
import { TransactionType } from '../server/models/Transaction';

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<TransactionType[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [filterBy, setFilterBy] = useState('');
  const [filterSelection, setFilterSelection] = useState('');
  const router = useRouter();

  const categoryTranslations = {
    ...incomeCategoriesTranslations,
    ...expenseCategoriesTranslations,
  };
  const categories = Object.entries(categoryTranslations);
  const types = Object.entries(typeTranslations);

  useEffect(() => {
    organize();
  }, []);

  const organize = async () => {
    const body = {
      sortBy: sortBy !== '' ? sortBy : 'date',
      filterBy: filterBy !== '' ? filterBy : undefined,
      filterSelection: filterSelection !== '' ? filterSelection : undefined,
    };
    const res = await fetch('/api/transaction/', {
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
        <Button onClick={() => router.push('/add-transaction')}>Añadir</Button>
        <Grid justify='space-evenly' sm={24} alignItems='center'>
          <Button onClick={() => setSortBy('date')} size='small'>
            Por Fecha
          </Button>
          <Button onClick={() => setSortBy('amount')} size='small'>
            Por Monto
          </Button>
        </Grid>
        <Grid.Container justify='center'>
          {categories.map(([category, translation]) => (
            <Button
              key={category}
              onClick={() => {
                setFilterBy('category');
                setFilterSelection(category);
              }}
              size='small'
            >
              Por {translation}
            </Button>
          ))}
        </Grid.Container>
        <Grid justify='space-evenly' sm={24} alignItems='center'>
          {types.map(([type, translation]) => (
            <Button
              key={type}
              onClick={() => {
                setFilterBy('type');
                setFilterSelection(type.toLowerCase());
              }}
              size='small'
            >
              Por {translation}
            </Button>
          ))}
        </Grid>

        <Button
          onClick={() => organize()}
          disabled={sortBy !== '' || filterBy !== '' ? false : true}
        >
          Organizar
        </Button>

        {isLoading ? (
          <Loading type='success' size='large' />
        ) : (
          data.map((element) => (
            <TransactionCell data={element} key={element._id} router={router} />
          ))
        )}
      </Grid.Container>
    </>
  );
};

export default DashboardPage;
