import React from 'react';
/** @jsxImportSource @emotion/react */ import { css } from '@emotion/react';
import { Button, Card } from '@geist-ui/react';
import { Plus } from '@geist-ui/react-icons';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Title from '../components/Title';
import TimelineChart from '../components/Charts/TimelineChart';
import TransactionChart from '../components/Charts/TransactionChart';
import TransactionList from '../components/TransactionList';

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

const DashboardPage: React.FC = () => {
  const router = useRouter();

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

          <TransactionList router={router} />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
