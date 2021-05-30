import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { Global } from '@emotion/react';

class MyDocument extends Document {
  render() {
    return (
      <Html lang='en' style={{ padding: 0, margin: 0 }}>
        <Head>
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1.0'
          />
          <meta name='description' content='Personal financial manager' />
          <link rel='icon' href='/favicon.ico' />
          <link rel='preconnect' href='https://fonts.gstatic.com' />
          <link
            href='https://fonts.googleapis.com/css2?family=Work+Sans:wght@200;300;400&display=swap'
            rel='stylesheet'
          />
          <link
            rel='stylesheet'
            href='https://cdnjs.cloudflare.com/ajax/libs/react-datepicker/2.14.1/react-datepicker.min.css'
          />
        </Head>

        <Global
          styles={{
            '*': {
              boxSizing: 'border-box',
              fontFamily:
                'Work Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Ubuntu, Fira Sans, Helvetica Neue, sans-serif !important',
              fontWeight: 300,
            },
          }}
        />

        <body style={{ padding: 0, margin: 0 }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
