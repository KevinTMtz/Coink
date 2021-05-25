import { Card, Grid } from '@geist-ui/react';
import React from 'react';
import { TransactionType } from '../server/models/Transaction';
/** @jsxImportSource @emotion/react */ import { css } from '@emotion/react';
const CardStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  h1: { fontSize: '1.5rem', fontWeight: 500 },
  h2: { fontSize: '1.25rem' },
  h3: { fontSize: '1rem', color: 'white', fontWeight: 300 },
  maxHeight: '50px',
});

const DivStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  width: '20%',
  textAlign: 'center',
});

interface TransactionProps {
  data: TransactionType;
}

const Transaction: React.FC<TransactionProps> = ({ data }) => {
  return (
    <Grid sm={24} style={{ width: '90%', margin: 'auto' }}>
      <Card hoverable type='cyan'>
        <div css={CardStyle}>
          <div css={DivStyle}>
            {/*Icon*/}
            <h1>Icon</h1>
            <div>
              <h2>{data.name}</h2>
              <h3>{new Date(data.date).toISOString().split('T')[0]}</h3>
            </div>
          </div>
          <div css={DivStyle}>
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
