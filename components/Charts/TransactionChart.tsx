import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

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

const TransactionChart: React.FC<ChartProps> = ({ type }) => {
  const [series, setSeries] = useState<number[]>();

  const [options, setOptions] = useState<ApexOptions>();

  useEffect(() => {
    (async () => {
      const resExpenses = await fetch(`/api/stats/${type}`);
      let resBody = await resExpenses.json();

      setSeries(
        resBody.map(
          (expense: { _id: string; count: number; amount: number }) =>
            expense.amount,
        ),
      );

      setOptions({
        title: {
          text: type === 'incomes' ? 'Ingresos' : 'Gastos',
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
        labels: resBody.map(
          (expense: { _id: string; count: number; amount: number }) =>
            type === 'incomes'
              ? incomeCategoriesTranslations[expense._id as IncomeCategory]
              : expenseCategoriesTranslations[expense._id as ExpenseCategory],
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
                    return `$ ${val.globals.seriesTotals
                      .reduce(
                        (sum: number, current: number) => sum + current,
                        0,
                      )
                      .toFixed(2)}`;
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
      } as ApexOptions);
    })();
  }, []);

  return (
    <>
      {series && options && (
        <ReactApexChart
          options={options}
          series={series}
          type='donut'
          width={500}
          height={320}
        />
      )}
    </>
  );
};

export default TransactionChart;
