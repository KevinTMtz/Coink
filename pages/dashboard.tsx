import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, ButtonDropdown, Card, Loading } from '@geist-ui/react';

import Title from '../components/Title';
import TransactionCell from '../components/TransactionCell';
import {
  expenseCategoriesTranslations,
  incomeCategoriesTranslations,
  typeTranslations,
} from '../lib/translations';
import { TransactionType } from '../server/models/Transaction';
import { Plus } from '@geist-ui/react-icons';
/** @jsxImportSource @emotion/react */ import { css } from '@emotion/react';
import TimelineChart from '../components/Charts/TimelineChart';
import TransactionChart from '../components/Charts/TransactionChart';

const ControlsStyle = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  margin: 'auto',
  width: '70%',
  '@media (max-width: 600px)': {
    width: '95%',
  },
});

const BttnsStyle = css({
  display: 'flex',
  width: '100%',
  boxSizing: 'border-box',
  justifyContent: 'space-evenly',
  '.Bttn': {
    display: 'flex',
    flexDirection: 'column',
    margin: '8px',
    alignItems: 'center',
  },

  '@media (max-width: 600px)': {
    flexDirection: 'column',
    marginTop: '8px',
    '.Bttn': {
      flexDirection: 'row',
      margin: '0',
      justifyContent: 'space-between',
      '.BttnDrop': {
        width: '60%',
      },
    },
  },
});

const ListStyle = css({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

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

  const dateFormatter = new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    weekday: 'long',
    month: 'long',
    year: 'numeric',
  });

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

  useEffect(() => {
    organize();
  }, []);

  useEffect(() => {
    organize();
  }, [sortBy, filterBy, filterSelection]);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Title>Coink</Title>
      <div>
        <div css={ControlsStyle}>
          <Card hoverable width='100%' style={{ margin: '12px 0px' }}>
            <TimelineChart type='amount' />
            <TimelineChart type='count' />
            <TransactionChart type='incomes' />
            <TransactionChart type='expenses' />
          </Card>

          <Button
            onClick={() => router.push('/add-transaction')}
            icon={<Plus />}
            type='success-light'
            size='large'
            style={{ width: '100%' }}
          >
            Añadir
          </Button>

          <div css={BttnsStyle}>
            <div className='Bttn'>
              <h3>Filtrar por:</h3>
              <ButtonDropdown className='BttnDrop'>
                {categories.map(([category, translation]) => (
                  <ButtonDropdown.Item
                    type='success'
                    key={category}
                    onClick={() => {
                      setFilterBy('category');
                      setFilterSelection(category);
                    }}
                  >
                    Por {translation}
                  </ButtonDropdown.Item>
                ))}
              </ButtonDropdown>
            </div>
            <div className='Bttn'>
              <h3>Ordenar por:</h3>
              <ButtonDropdown className='BttnDrop'>
                <ButtonDropdown.Item
                  type='success'
                  onClick={() => setSortBy('date')}
                >
                  Por Fecha
                </ButtonDropdown.Item>
                <ButtonDropdown.Item
                  type='success'
                  onClick={() => setSortBy('amount')}
                >
                  Por Monto
                </ButtonDropdown.Item>
              </ButtonDropdown>
            </div>
            <div className='Bttn'>
              <h3>Mostrar:</h3>
              <ButtonDropdown className='BttnDrop'>
                {types.map(([type, translation]) => (
                  <ButtonDropdown.Item
                    type='success'
                    key={type}
                    onClick={() => {
                      setFilterBy('type');
                      setFilterSelection(type.toLowerCase());
                    }}
                  >
                    Solo {translation}s
                  </ButtonDropdown.Item>
                ))}
                <ButtonDropdown.Item
                  type='success'
                  onClick={() => {
                    setFilterBy('type');
                    setFilterSelection('');
                  }}
                >
                  Ambos
                </ButtonDropdown.Item>
              </ButtonDropdown>
            </div>
          </div>

          <div css={ListStyle}>
            {isLoading ? (
              <Loading type='success' size='large' />
            ) : (
              data.map((element) => (
                <TransactionCell
                  data={element}
                  dateFormatter={dateFormatter}
                  key={element._id}
                  onClick={() =>
                    router.push(`/edit-transaction/${element._id}`)
                  }
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
