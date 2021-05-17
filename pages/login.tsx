import React, { useState } from 'react';
import { Button, Card, Input, Spacer, Text } from '@geist-ui/react';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div className="container">
      <Card shadow>
        <Input
          size="large"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        >
          Usuario
        </Input>
        <Spacer />
        <Input
          size="large"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        >
          Contraseña
        </Input>
        <Spacer />
        <Button type="success-light" size="large">
          Iniciar sesión
        </Button>
        <Spacer y={0.5} />
        <Button type="success" ghost size="large">
          Regístrate
        </Button>
      </Card>
      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        div.card {
          width: auto !important;
        }

        div.content {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
