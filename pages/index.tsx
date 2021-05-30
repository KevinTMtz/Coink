import React from 'react';
/** @jsxImportSource @emotion/react */ import { css } from '@emotion/react';
import { Button } from '@geist-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Title from '../components/Title';

const ContainerStyle = css({
  minHeight: '100vh',
  maxWidth: '900px',
  margin: '0 auto',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const HeaderStyle = css({
  display: 'flex',
  alignItems: 'center',
  img: {
    height: '100px',
  },
  '@media (max-width: 720px)': {
    img: {
      height: '80px',
    },
  },
});

const ButtonStyle = css({
  margin: '12px',
  'div.text': {
    fontSize: '1.2rem',
    fontWeight: 500,
  },
});

const FeatureContainerStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-evenly',
});

const FeatureDivStyle = css({
  maxWidth: '300px',
  margin: '0 20px 12px',
  img: {
    display: 'block',
    height: '120px',
    margin: '10px auto',
  },
  h3: {
    margin: 0,
    fontWeight: 500,
    textAlign: 'center',
  },
  p: {
    margin: 0,
    textAlign: 'center',
  },
  '@media (max-width: 480px)': {
    img: {
      height: '25vw',
    },
  },
});

const HomePage: React.FC = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>coink</title>
      </Head>
      <div css={ContainerStyle}>
        <header css={HeaderStyle}>
          <img src='/coinkLogo.svg' alt='coink logo' />
          <Title>coink</Title>
        </header>

        <Button
          onClick={() => router.push('/login')}
          type='success-light'
          size='large'
          css={ButtonStyle}
        >
          Regístrate
        </Button>

        <div css={FeatureContainerStyle}>
          <div css={FeatureDivStyle}>
            <img src='/images/bank.svg' />
            <h3>Organiza tus finanzas</h3>
            <p>
              Administrar tu dinero puede ser tedioso, coink te ayuda a juntar
              todos tus gastos e ingresos en un solo lugar
            </p>
          </div>

          <div css={FeatureDivStyle}>
            <img src='/images/education.svg' />
            <h3>Aprende algo nuevo</h3>
            <p>
              Visualiza tus hábitos de gasto, tus hábitos de ahorro y tus
              ingresos fácilmente - sin complicadas hojas de cálculo
            </p>
          </div>

          <div css={FeatureDivStyle}>
            <img src='/images/analysis.svg' />
            <h3>Optimiza tu dinero</h3>
            <p>
              Nuestras herramientas están diseñadas para ayudarle a ver su
              dinero con claridad y tomar decisiones financieras
            </p>
          </div>

          <div css={FeatureDivStyle}>
            <img src='/images/smartphone.svg' />
            <h3>Crea una cuenta gratis</h3>
            <p>
              Regístrate en coink con sólo tu correo y disfruta de nuestro sitio
              web desde tu navegador o tu teléfono
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
