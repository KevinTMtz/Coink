import React from 'react';
import { AppProps } from 'next/app';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => (
  <div className="page-layout">
    <Component {...pageProps} />
    <style jsx global>{`
      html,
      body {
        padding: 0;
        margin: 0;
      }

      * {
        box-sizing: border-box;
        font-family: Work Sans, -apple-system, BlinkMacSystemFont, Segoe UI,
          Ubuntu, Fira Sans, Helvetica Neue, sans-serif !important;
        font-weight: 300;
      }
    `}</style>
  </div>
);

export default MyApp;
