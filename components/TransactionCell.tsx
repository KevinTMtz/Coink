import React from 'react';
/** @jsxImportSource @emotion/react */ import { css } from '@emotion/react';
import { Card, Grid } from '@geist-ui/react';
import { ChevronRight } from '@geist-ui/react-icons';
import { NextRouter } from 'next/router';

import TransactionIcon from './TransactionIcon';
import { TransactionType } from '../server/models/Transaction';

const CardStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  h1: { fontSize: '1.5rem' },
  h2: { fontSize: '1.25rem', fontWeight: 500 },
  h3: { fontSize: '1rem', fontWeight: 300 },
  maxHeight: '50px',
  width: '95%',
  cursor: 'pointer',
});

const InfoStyle = css({
  display: 'flex',
  alignItems: 'center',
  textAlign: 'left',
});

interface TransactionProps {
  data: TransactionType;
  router: NextRouter;
}

const TransactionCell: React.FC<TransactionProps> = ({ data, router }) => (
  <Card
    hoverable
    type='lite'
    onClick={() => router.push(`/edit-transaction/${data._id}`)}
    style={{ width: '90%', margin: '1em auto' }}
  >
    <div css={CardStyle}>
      <div css={InfoStyle}>
        <TransactionIcon category={data.category} />
        <div>
          <h2>{data.name}</h2>
          <h3>{new Date(data.date).toISOString().split('T')[0]}</h3>
        </div>
      </div>
      <div css={InfoStyle}>
        <h1
          style={{
            color: data.type === 'income' ? 'black' : 'red',
            marginRight: '2em',
          }}
        >
          {data.type === 'expense' && '-'} ${' '}
          {data.amount
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </h1>
        <ChevronRight color='black' size={42} />
      </div>
    </div>
  </Card>
);

export default TransactionCell;
