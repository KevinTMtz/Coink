import React from 'react';
import { Card, Grid } from '@geist-ui/react';
import TimelineChart from './Charts/TimelineChart';
import ExpensesChart from './Charts/ExpensesChart';
import IncomesChart from './Charts/IncomesChart';

const Charts: React.FC = () => {
  return (
    <Grid.Container
      justify='center'
      alignItems='center'
      style={{ margin: '12px 0px' }}
    >
      <Card hoverable width='auto'>
        <TimelineChart />
        <IncomesChart />
        <ExpensesChart />
      </Card>
    </Grid.Container>
  );
};

export default Charts;
