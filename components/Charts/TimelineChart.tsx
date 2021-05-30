import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface ChartProps {
  type: 'amount' | 'count';
}

const TimelineChart: React.FC<ChartProps> = ({ type }) => {
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>();

  const [options, setOptions] = useState<ApexOptions>();

  useEffect(() => {
    (async () => {
      const resTimeline = await fetch('/api/stats/timeline');
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

      const maxTransaction =
        type === 'amount'
          ? Math.max(...resBody.expenseAmounts, ...resBody.incomeAmounts)
          : Math.max(...resBody.expenseCounts, ...resBody.incomeCounts);
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
          min: -1 * maxTransaction,
          max: maxTransaction,
          labels: {
            formatter:
              type === 'amount'
                ? (val: number) =>
                    `$ ${val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                : undefined,
          },
        },
        xaxis: {
          categories: resBody.dates.map((dateStr: string) => {
            const date = new Date(dateStr);
            return `${date.getMonth() + 1}-${date.getFullYear()}`;
          }),
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
          type='bar'
          width='100%'
          height={320}
        />
      )}
    </>
  );
};

export default TimelineChart;
