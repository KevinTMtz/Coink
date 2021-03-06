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

  const logout = async () => {
    const res = await fetch('/api/auth/logout');
    if (res.ok) {
      return router.push('/login');
    }
  };

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
          <Tabs.Item label='Tablero' value='1'>
            <Spacer />
            <TimelineChart type='amount' router={router} />
            <TransactionChart type='incomes' router={router} />
            <TransactionChart type='expenses' router={router} />
            <Spacer y={3} />
          </Tabs.Item>

          <Tabs.Item label='Transacciones' value='2'>
            <TransactionList router={router} />
          </Tabs.Item>
        </Tabs>

        <Button
          onClick={logout}
          type='error-light'
          size='large'
          ghost
          style={{ width: '100%', marginBottom: '16px' }}
        >
          Cerrar sesión
        </Button>
      </div>
    </>
  );
};

export default DashboardPage;
