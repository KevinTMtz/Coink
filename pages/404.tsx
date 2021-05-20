import React from 'react';
import Head from 'next/head';
import { Grid, Spacer } from '@geist-ui/react';

import Subtitle from '../components/Subtitle';
import Title from '../components/Title';

const Error404Page: React.FC = () => (
  <>
    <Head>
      <title>404</title>
    </Head>
    <Grid.Container
      justify="center"
      direction="column"
      alignItems="center"
      style={{ minHeight: '100vh', padding: '5rem 0.5rem' }}
    >
      <Title>Error 404</Title>
      <Spacer y={0.5} />
      <Subtitle>La página que buscas no fue encontrada</Subtitle>
    </Grid.Container>
  </>
);

export default Error404Page;
