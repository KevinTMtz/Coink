import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const ExpensesChart: React.FC = () => {
  const [series, setSeries] = useState<number[]>();

  const [options, setOptions] = useState<ApexOptions>();

  useEffect(() => {
    (async () => {
      const resExpenses = await fetch('/api/stats/expenses');
      let resBody = await resExpenses.json();

      setSeries(
        resBody.map(
          (expense: { _id: string; count: number; amount: number }) =>
            expense.amount,
        ),
      );

      setOptions({
        title: {
          text: 'Gastos',
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
            ({
              food: 'Alimento',
              education: 'Educación',
              entertainment: 'Entretenimiento',
              bills: 'Recibo',
              health: 'Salud',
              transport: 'Transporte',
              clothes: 'Vestimenta',
              other: 'Otro',
            }[expense._id]),
        ),
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                total: {
                  showAlways: true,
                  show: true,
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

export default ExpensesChart;
