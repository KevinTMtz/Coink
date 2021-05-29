import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, ButtonDropdown, Grid, Loading } from '@geist-ui/react';

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

const ControlsStyle = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

const BttnsStyle = css({
  display: 'flex',
  width: '90%',
  justifyContent: 'space-evenly',
  '.Bttn': {
    display: 'flex',
    margin: '1em',
    alignItems: 'center',
    h3: {
      marginRight: '2em',
    },
  },
});

const ListStyle = css({
  display: 'flex',
  flexDirection: 'column',
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
  useEffect(() => {
    organize();
  }, [sortBy, filterBy, filterSelection]);
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Title>Dashboard</Title>
      <div>
        <div css={ControlsStyle}>
          <Button
            onClick={() => router.push('/add-transaction')}
            icon={<Plus />}
            type='success'
            ghost
            size='large'
          >
            Añadir
          </Button>
          <div css={BttnsStyle}>
            <div className='Bttn'>
              <h3>Filtrar por:</h3>
              <ButtonDropdown>
                {categories.map(([category, translation]) => (
                  <ButtonDropdown.Item
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
              <ButtonDropdown>
                <ButtonDropdown.Item onClick={() => setSortBy('date')}>
                  Por Fecha
                </ButtonDropdown.Item>
                <ButtonDropdown.Item onClick={() => setSortBy('amount')}>
                  Por Monto
                </ButtonDropdown.Item>
              </ButtonDropdown>
            </div>
            <div className='Bttn'>
              <h3>Mostrar:</h3>
              <ButtonDropdown>
                {types.map(([type, translation]) => (
                  <ButtonDropdown.Item
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
        </div>
        <div css={ListStyle}>
          {isLoading ? (
            <Loading type='success' size='large' />
          ) : (
            data.map((element) => (
              <TransactionCell
                data={element}
                key={element._id}
                router={router}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
