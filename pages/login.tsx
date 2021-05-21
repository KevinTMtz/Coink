import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Card, Grid, Input, Row, Spacer, Text } from '@geist-ui/react';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';

import { postRequest } from '../lib/fetch';

const LoginPage: React.FC = () => {
  const [view, setView] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const router = useRouter();

  const login = async () => {
    if (view === 'register') {
      if (!isEmail(email)) {
        setErrorMsg('Ingrese un correo electrónico es válido');
        return;
      }
      if (!isLength(password, { min: 6 })) {
        setErrorMsg('La contraseña debe de ser de al menos 6 caracteres');
        return;
      }
    }
    const apiUrl = view === 'login' ? '/api/auth/login' : '/api/auth/signup';
    const body = { email, password };
    const resBody = await postRequest(apiUrl, body, router);
    if (resBody.error) {
      setErrorMsg(resBody.error);
    }
  };

  return (
    <>
      <Head>
        <title>{view === 'login' ? 'Inicia sesión' : 'Regístrate'}</title>
      </Head>
      <Grid.Container
        justify='center'
        alignItems='center'
        style={{ minHeight: '100vh', padding: '0 0.5rem' }}
      >
        <Card shadow width='auto'>
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
          >
            Correo electrónico
          </Input>
          <Spacer />
          <Input
            size='large'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          <Button type='success-light' size='large' onClick={login}>
            {view === 'login' ? 'Iniciar sesión' : 'Regístrate'}
          </Button>
          <Spacer y={0.5} />
        </Card>
      </Grid.Container>
    </>
  );
};

export default LoginPage;
