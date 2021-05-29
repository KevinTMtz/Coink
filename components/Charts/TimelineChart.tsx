import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const TimelineChart: React.FC = () => {
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>();

  const [options, setOptions] = useState<ApexOptions>();

  useEffect(() => {
    (async () => {
      const resTimeline = await fetch('/api/stats/timeline');
      const resBody = await resTimeline.json();

      setSeries([
        {
          name: 'Gasto',
          data: resBody.expenseAmounts.map((expense: number) => expense * -1),
        },
        {
          name: 'Ingreso',
          data: resBody.incomeAmounts,
        },
      ]);

      const maxTransaction = Math.max(
        ...resBody.expenseAmounts,
        ...resBody.incomeAmounts,
      );
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
          text: 'Ingreso y gasto mensual',
        },
        yaxis: {
          min: -1 * (maxTransaction + maxTransaction * 0.05),
          max: maxTransaction + maxTransaction * 0.05,
        },
        xaxis: {
          categories: resBody.dates.map((dateStr: string) => {
            const date = new Date(dateStr);
            return `${date.getMonth()}-${date.getFullYear()}`;
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
          width={500}
          height={320}
        />
      )}
    </>
  );
};

export default TimelineChart;
