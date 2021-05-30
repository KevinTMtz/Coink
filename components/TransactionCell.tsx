import React from 'react';
/** @jsxImportSource @emotion/react */ import { css } from '@emotion/react';
import { Card } from '@geist-ui/react';
import { ChevronRight } from '@geist-ui/react-icons';

import { formatAmount } from '../lib/formatAmount';
import TransactionIcon from './TransactionIcon';
import { TransactionType } from '../server/models/Transaction';

const CardStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  h1: { fontSize: '1.5rem' },
  h2: { fontSize: '1.25rem', fontWeight: 500 },
  h3: { fontSize: '1rem', fontWeight: 300 },
  width: '100%',
  cursor: 'pointer',
  '@media (max-width: 600px)': {
    h2: {
      fontSize: '5vw',
      width: 'auto',
    },
    h3: {
      fontSize: '4vw',
    },
  },
});

const InfoStyle = css({
  display: 'flex',
  alignItems: 'center',
  textAlign: 'left',
  boxSizing: 'border-box',
  '@media (max-width: 600px)': {
    maxWidth: '50%',
  },
});

const NoMargin = css({ margin: '0px' });

interface TransactionProps {
  data: TransactionType;
  dateFormatter: Intl.DateTimeFormat;
  onClick: React.MouseEventHandler<any>;
}

const TransactionCell: React.FC<TransactionProps> = ({
  data,
  dateFormatter,
  onClick,
}) => (
  <Card
    hoverable
    type='lite'
    onClick={onClick}
    style={{
      width: '100%',
      margin: '8px auto',
      border: '1px solid #eaeaea',
    }}
  >
    <Card.Content style={{ padding: '12px 0px 12px 12px' }}>
      <div css={CardStyle}>
        <div css={InfoStyle}>
          <TransactionIcon type={data.type} category={data.category} />
          <div>
            <h2 style={{ margin: '0 0 6px 0' }}>{data.name}</h2>
            <h3 css={NoMargin}>{dateFormatter.format(new Date(data.date))}</h3>
          </div>
        </div>
        <div css={InfoStyle}>
          <h2
            style={{
              color: data.type === 'income' ? 'black' : 'red',
              margin: ' 0 0.25em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {formatAmount(data.amount, data.type === 'expense')}
          </h2>
          <ChevronRight color='black' size={36} />
        </div>
      </div>
    </Card.Content>
  </Card>
);

export default TransactionCell;
