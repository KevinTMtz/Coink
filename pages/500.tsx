import React from 'react';
import Head from 'next/head';
import { Grid, Spacer } from '@geist-ui/react';

import Subtitle from '../components/Subtitle';
import Title from '../components/Title';

const Error500Page: React.FC = () => (
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
      <Title>Error 500</Title>
      <Spacer y={0.5} />
      <Subtitle>Nuestro servidor tuvo un problema</Subtitle>
    </Grid.Container>
  </>
);

export default Error500Page;
