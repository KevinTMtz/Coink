import React from 'react';
/** @jsxImportSource @emotion/react */ import { css } from '@emotion/react';
import { Button, Spacer, Tabs } from '@geist-ui/react';
import { Plus } from '@geist-ui/react-icons';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Title from '../components/Title';
import TimelineChart from '../components/Charts/TimelineChart';
import TransactionChart from '../components/Charts/TransactionChart';
import TransactionList from '../components/TransactionList';

const ContainerStyle = css({
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

const TabsStyle = css({
  width: '100% !important',
  header: { justifyContent: 'center' },
});

const DashboardPage: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Spacer />
      <Title>Coink</Title>
      <div css={ContainerStyle}>
        <Button
          onClick={() => router.push('/add-transaction')}
          icon={<Plus />}
          type='success-light'
          size='large'
          style={{ width: '100%' }}
        >
          Añadir
        </Button>
        <Spacer />

        <Tabs initialValue='1' css={TabsStyle}>
          <Tabs.Item label='Gráficas' value='1'>
            <Spacer />
            <TimelineChart type='amount' />
            <TimelineChart type='count' />
            <TransactionChart type='incomes' />
            <TransactionChart type='expenses' />
            <Spacer y={3} />
          </Tabs.Item>

          <Tabs.Item label='Tus transacciones' value='2'>
            <TransactionList router={router} />
          </Tabs.Item>
        </Tabs>
      </div>
    </>
  );
};

export default DashboardPage;
