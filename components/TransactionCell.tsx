import React from 'react';
import { Card, Grid } from '@geist-ui/react';
import { TransactionType } from '../server/models/Transaction';
/** @jsxImportSource @emotion/react */ import { css } from '@emotion/react';
import { useRouter } from 'next/router';
import { Book } from '@geist-ui/react-icons';
import TransactionIcon from './TransactionIcon';

const CardStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  h1: { fontSize: '1.5rem', fontWeight: 500 },
  h2: { fontSize: '1.25rem' },
  h3: { fontSize: '1rem', color: 'white', fontWeight: 300 },
  maxHeight: '50px',
});

const InfoStyle = css({
  display: 'flex',
  alignItems: 'center',
  textAlign: 'right',
  justifyContent: 'space-around',
  width: '25%',
  backgroundColor: 'red',
});

interface TransactionProps {
  data: TransactionType;
}

const Transaction: React.FC<TransactionProps> = ({ data }) => {
  const router = useRouter();
  return (
    <Grid sm={24} style={{ width: '90%', margin: 'auto' }}>
      <Card
        hoverable
        type='cyan'
        onClick={() => {
          return router.push('/edit-transaction/' + data._id);
        }}
      >
        <div css={CardStyle}>
          <div css={InfoStyle}>
            <TransactionIcon category={data.category} />
            <div>
              <h2>{data.name}</h2>
              <h3>{new Date(data.date).toISOString().split('T')[0]}</h3>
            </div>
          </div>
          <div>
            <h1 style={{ color: data.type === 'income' ? 'black' : 'red' }}>
              {data.type === 'expense' && '-'} $ {data.amount.toFixed(2)}
            </h1>
            {/*Detail Button*/}
            <h1>{'>'}</h1>
          </div>
        </div>
      </Card>
    </Grid>
  );
};

export default Transaction;
