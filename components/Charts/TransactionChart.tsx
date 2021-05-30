import React, { useState, useEffect } from 'react';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

import { formatAmount } from '../../lib/formatAmount';
import {
  expenseCategoriesTranslations,
  incomeCategoriesTranslations,
} from '../../lib/translations';
import {
  ExpenseCategory,
  IncomeCategory,
} from '../../server/models/Transaction';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface ChartProps {
  type: 'incomes' | 'expenses';
}

interface DataPoint {
  _id: string;
  count: number;
  amount: number;
}

const TransactionChart: React.FC<ChartProps> = ({ type }) => {
  const [series, setSeries] = useState<number[]>();

  const [options, setOptions] = useState<ApexOptions>();

  useEffect(() => {
    (async () => {
      const resExpenses = await fetch(`/api/stats/${type}`);
      const resBody = (await resExpenses.json()) as DataPoint[];

      setSeries(resBody.map((datapoint) => datapoint.amount));

      setOptions({
        title: {
          text: type === 'incomes' ? 'Ingresos' : 'Gastos',
          style: {
            fontSize: '16',
            fontWeight: 'bold',
          },
        },
        chart: {
          type: 'donut',
        },
        responsive: [
          {
            breakpoint: 200,
            options: {
              chart: {
                width: 400,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
        labels: resBody.map((datapoint) =>
          type === 'incomes'
            ? incomeCategoriesTranslations[datapoint._id as IncomeCategory]
            : expenseCategoriesTranslations[datapoint._id as ExpenseCategory],
        ),
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                total: {
                  showAlways: true,
                  show: true,
                  formatter: (val: { globals: { seriesTotals: number[] } }) => {
                    const sum = val.globals.seriesTotals.reduce(
                      (sum, val) => sum + val,
                      0,
                    );
                    return formatAmount(sum);
                  },
                },
                value: {
                  color: type === 'incomes' ? '#0070F3' : '#FF4560',
                  fontWeight: 'bold',
                },
              },
            },
          },
        },
      });
    })();
  }, []);

  return (
    <>
      {series && options && (
        <ReactApexChart
          options={options}
          series={series}
          type='donut'
          width='100%'
          height={300}
        />
      )}
    </>
  );
};

export default TransactionChart;
