import React, { useEffect, useState } from 'react';
/** @jsxImportSource @emotion/react */ import { css } from '@emotion/react';
import { Select, Loading, Spacer } from '@geist-ui/react';
import { NextRouter } from 'next/router';

import TransactionCell from '../components/TransactionCell';
import {
  expenseCategoriesTranslations,
  incomeCategoriesTranslations,
  typeTranslations,
} from '../lib/translations';
import { TransactionType } from '../server/models/Transaction';
import TimelineChart from './Charts/TimelineChart';

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
        justifyContent: 'flex-end',
      },
    },
  },
});

const ListStyle = css({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

interface TransactionListProps {
  router: NextRouter;
}

const TransactionList: React.FC<TransactionListProps> = ({ router }) => {
  const [data, setData] = useState<TransactionType[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [filterBy, setFilterBy] = useState('');
  const [filterSelection, setFilterSelection] = useState('');

  const categoryTranslations = {
    all: 'Ninguno',
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
    setLoading(true);
    organize();
  }, [sortBy, filterBy, filterSelection]);

  return (
    <>
      <TimelineChart type='count' />
      <div css={BttnsStyle}>
        <div className='Bttn'>
          <h3>Filtrar por:</h3>
          <Select className='BttnDrop' value='Ninguno'>
            {categories.map(([category, translation]) => (
              <Select.Option
                value={`${translation}`}
                key={category}
                onClickCapture={() => {
                  console.log(category);
                  setFilterBy('category');
                  setFilterSelection(category === 'all' ? '' : category);
                }}
              >
                {translation}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className='Bttn'>
          <h3>Ordenar por:</h3>
          <Select className='BttnDrop' value='Fecha'>
            <Select.Option
              value='Fecha'
              onClickCapture={() => setSortBy('date')}
            >
              Fecha
            </Select.Option>
            <Select.Option
              value='Monto'
              onClickCapture={() => setSortBy('amount')}
            >
              Monto
            </Select.Option>
          </Select>
        </div>
        <div className='Bttn'>
          <h3>Mostrar:</h3>
          <Select className='BttnDrop' value='Ambos'>
            {types.map(([type, translation]) => (
              <Select.Option
                value={`Solo ${translation}s`}
                key={type}
                onClickCapture={() => {
                  setFilterBy('type');
                  setFilterSelection(type.toLowerCase());
                }}
              >
                Solo {translation}s
              </Select.Option>
            ))}
            <Select.Option
              value='Ambos'
              onClickCapture={() => {
                setFilterBy('type');
                setFilterSelection('');
              }}
            >
              Ambos
            </Select.Option>
          </Select>
        </div>
      </div>

      <div css={ListStyle}>
        {isLoading ? (
          <>
            <Spacer />
            <Loading type='success' size='large' />
          </>
        ) : (
          data.map((element) => (
            <TransactionCell
              data={element}
              dateFormatter={dateFormatter}
              key={element._id}
              onClick={() => router.push(`/edit-transaction/${element._id}`)}
            />
          ))
        )}
      </div>
    </>
  );
};

export default TransactionList;
