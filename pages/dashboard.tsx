import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { getRequest } from '../lib/fetch';

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState('');
  const router = useRouter();

  useEffect(() => {
    getRequest('/api/auth/hello', router).then((res) => setUser(res.user));
  }, []);
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className="container">
        <main>
          <h1 className="title">Dashboard</h1>
          <p className="description">Usuario {user}</p>
        </main>

        <style jsx>{`
          .container {
            min-height: 100vh;
            padding: 0 0.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          main {
            padding: 5rem 0;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          .title {
            margin: 0;
            line-height: 1.15;
            font-size: 4rem;
          }

          .title,
          .description {
            text-align: center;
          }

          .description {
            line-height: 1.5;
            font-size: 1.5rem;
          }
        `}</style>
      </div>
    </>
  );
};

export default DashboardPage;
