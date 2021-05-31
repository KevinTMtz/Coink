import React, { useState, useEffect } from 'react';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import { NextRouter } from 'next/router';

import { formatAmount } from '../../lib/formatAmount';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface ChartProps {
  type: 'amount' | 'count';
  router: NextRouter;
}

const TimelineChart: React.FC<ChartProps> = ({ type, router }) => {
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>();

  const [options, setOptions] = useState<ApexOptions>();

  useEffect(() => {
    (async () => {
      const resTimeline = await fetch('/api/stats/timeline');
      if (resTimeline.status === 401) {
        return router.replace('/login');
      }
      const resBody = await resTimeline.json();

      setSeries([
        {
          name: 'Gasto',
          data: (type === 'amount'
            ? resBody.expenseAmounts
            : resBody.expenseCounts
          ).map((expense: number) => expense * -1),
        },
        {
          name: 'Ingreso',
          data:
            type === 'amount' ? resBody.incomeAmounts : resBody.incomeCounts,
        },
      ]);

      const maxNumber =
        type === 'amount'
          ? Math.max(...resBody.expenseAmounts, ...resBody.incomeAmounts)
          : Math.max(...resBody.expenseCounts, ...resBody.incomeCounts);
      const magnitude = Math.floor(Math.log10(maxNumber));
      const chartLimit = 5 ** magnitude * Math.ceil(maxNumber / 5 ** magnitude);
      setOptions({
        chart: {
          type: 'bar',
          height: 400,
          stacked: true,
        },
        colors: ['#FF4560', '#0070F3'],
        plotOptions: {
          bar: {
            horizontal: false,
            barHeight: '90%',
          },
        },
        dataLabels: {
          enabled: false,
        },
        grid: {
          xaxis: {
            lines: {
              show: false,
            },
          },
        },
        title: {
          text:
            type === 'amount'
              ? 'Ingreso y gasto mensual'
              : 'Conteo de gastos e ingresos',
          style: {
            fontSize: '16',
            fontWeight: 'bold',
          },
        },
        yaxis: {
          min: -1 * chartLimit,
          max: chartLimit,
          labels: {
            formatter: (val: number) =>
              type === 'amount' ? formatAmount(val) : val.toString(),
          },
        },
        xaxis: {
          categories: resBody.dates.map((dateStr: string) => {
            const date = new Date(dateStr);
            return `${date.getMonth() + 1}-${date.getFullYear()}`;
          }),
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
          type='bar'
          width='99%'
          height={320}
        />
      )}
    </>
  );
};

export default TimelineChart;
