import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Card, Input, Row, Spacer, Text } from '@geist-ui/react';
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
      <div className="container">
        <Card shadow>
          <Row justify="space-around">
            <Text
              h3
              type={view === 'login' ? 'success' : 'secondary'}
              onClick={() => {
                setView('login');
                setErrorMsg('');
              }}
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
            >
              Regístrate
            </Text>
          </Row>
          <Spacer y={0.5} />
          <Input
            size="large"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          >
            Correo electrónico
          </Input>
          <Spacer />
          <Input
            size="large"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          >
            Contraseña
          </Input>
          <Spacer y={0.5} />
          {errorMsg && (
            <Text type="error" className="error-msg">
              {errorMsg}
            </Text>
          )}
          <Spacer y={0.5} />
          <Button type="success-light" size="large" onClick={login}>
            {view === 'login' ? 'Iniciar sesión' : 'Regístrate'}
          </Button>
          <Spacer y={0.5} />
        </Card>

        <style jsx global>{`
          .container {
            min-height: 100vh;
            padding: 0 0.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          div.card {
            width: auto !important;
          }

          div.content {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          h3 {
            font-weight: 400;
            cursor: pointer;
          }

          p.error-msg {
            margin: 0 auto;
            max-width: 220px;
            text-align: center;
          }

          * {
            box-sizing: border-box;
          }
        `}</style>
      </div>
    </>
  );
};

export default LoginPage;
