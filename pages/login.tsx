import React, { useState } from 'react';
/** @jsxImportSource @emotion/react */ import { css } from '@emotion/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Card, Input, Row, Spacer, Text } from '@geist-ui/react';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';

const ContainerStyle = css({
  margin: 'auto',
  display: 'flex',
  alignItems: 'center',
  alignContent: 'center',
  width: '40%',
  height: '100vh',
  '@media (max-width: 720px)': {
    width: '60%',
  },
  '@media (max-width: 480px)': {
    width: '90%',
  },
});

const LoginButtonStyle = css({
  width: '100% !important',
  'div.text': {
    fontSize: '1rem',
    fontWeight: 400,
  },
});

const LoginPage: React.FC = () => {
  const [view, setView] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const router = useRouter();

  const login = async () => {
    if (view === 'register') {
      if (!isEmail(email)) {
        setErrorMsg('Ingrese un correo electrónico válido');
        return;
      }
      if (!isLength(password, { min: 6 })) {
        setErrorMsg('La contraseña debe de ser de al menos 6 caracteres');
        return;
      }
    }

    const apiUrl = view === 'login' ? '/api/auth/login' : '/api/auth/signup';
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const resBody = await res.json();
    if (resBody.error) {
      setErrorMsg(resBody.error);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <>
      <Head>
        <title>{view === 'login' ? 'Inicia sesión' : 'Regístrate'}</title>
      </Head>
      <div css={ContainerStyle}>
        <Card shadow width='100%'>
          <Row justify='space-around'>
            <Text
              h3
              type={view === 'login' ? 'success' : 'secondary'}
              onClick={() => {
                setView('login');
                setErrorMsg('');
              }}
              style={{ fontWeight: 400, cursor: 'pointer' }}
            >
              Inicia sesión
            </Text>
            <Text
              h3
              type={view === 'register' ? 'success' : 'secondary'}
              onClick={() => {
                setView('register');
                setErrorMsg('');
              }}
              style={{ fontWeight: 400, cursor: 'pointer' }}
            >
              Regístrate
            </Text>
          </Row>
          <Spacer y={0.5} />
          <Input
            size='large'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            width='100%'
          >
            Correo electrónico
          </Input>
          <Spacer />
          <Input
            size='large'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            width='100%'
          >
            Contraseña
          </Input>
          <Spacer y={0.5} />
          {errorMsg && (
            <Text
              type='error'
              style={{
                margin: '0 auto',
                maxWidth: '220px',
                textAlign: 'center',
              }}
            >
              {errorMsg}
            </Text>
          )}
          <Spacer y={0.5} />
          <Button type='success-light' css={LoginButtonStyle} onClick={login}>
            {view === 'login' ? 'Iniciar sesión' : 'Regístrate'}
          </Button>
          <Spacer y={0.5} />
        </Card>
      </div>
    </>
  );
};

export default LoginPage;
