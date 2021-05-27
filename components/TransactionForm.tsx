import React, { useState } from 'react';
import { NextRouter } from 'next/router';
import Head from 'next/head';
import {
  Button,
  Card,
  Grid,
  Input,
  Row,
  Spacer,
  Text,
  Textarea,
  Select,
} from '@geist-ui/react';
import ReactDatePicker from 'react-datepicker';
import isLength from 'validator/lib/isLength';
import isNumeric from 'validator/lib/isNumeric';

import Subtitle from './Subtitle';
import { IncomeCategory, ExpenseCategory } from '../server/models/Transaction';

interface BaseTransactionFields {
  name: string;
  comments: string;
  amount: number;
  date: Date;
}

interface IncomeFields extends BaseTransactionFields {
  type: 'income';
  category: IncomeCategory | '';
}

interface ExpenseFields extends BaseTransactionFields {
  type: 'expense';
  category: ExpenseCategory | '';
}

export type TransactionFields = IncomeFields | ExpenseFields;

interface TransactionFormProps {
  action: 'add' | 'edit';
  id?: string;
  transaction: TransactionFields;
  setTransaction: React.Dispatch<React.SetStateAction<TransactionFields>>;
  router: NextRouter;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  action,
  id,
  transaction,
  setTransaction,
  router,
}) => {
  const [errorMsg, setErrorMsg] = useState<string>('');

  const categoriesMap: { [key: string]: string } =
    transaction.type === 'income'
      ? {
          bonus: 'Bono',
          salary: 'Salario',
          sale: 'Venta',
          other: 'Otro',
        }
      : {
          food: 'Alimento',
          education: 'Educación',
          entertainment: 'Entretenimiento',
          bills: 'Recibo',
          health: 'Salud',
          transport: 'Transporte',
          clothes: 'Vestimenta',
          other: 'Otro',
        };

  const finishOperation = async () => {
    if (!isLength(transaction.name, { min: 1 })) {
      setErrorMsg('Ingrese el nombre');
      return;
    }
    if (!isLength(transaction.category, { min: 1 })) {
      setErrorMsg('Ingrese la categoría');
      return;
    }
    setErrorMsg('');

    const res = await fetch('/api/transaction/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...transaction, id }),
    });
    if (res.status === 401) {
      router.replace('/login');
    } else if (res.ok) {
      router.push('/dashboard');
    }
  };

  const cancelOperation = () => router.back();

  return (
    <>
      <Head>
        <title>
          {action === 'add' ? 'Añadir' : 'Editar'}
          {transaction.type === 'income' ? ' ingreso' : ' gasto'}
        </title>
      </Head>
      <Grid.Container
        justify='center'
        alignItems='center'
        style={{ minHeight: '100vh', padding: '0 0.5rem' }}
      >
        <Card hoverable width='auto'>
          <Subtitle>
            {action === 'add'
              ? 'Añadir'
              : `Editar ${transaction.type === 'income' ? 'ingreso' : 'gasto'}`}
          </Subtitle>
          {action === 'add' && (
            <Row justify='space-around'>
              <Text
                h3
                type={transaction.type === 'income' ? 'success' : 'secondary'}
                onClick={() => {
                  setTransaction({
                    ...transaction,
                    type: 'income',
                    category: '',
                  });
                  setErrorMsg('');
                }}
                style={{ fontWeight: 400, cursor: 'pointer' }}
              >
                Ingreso
              </Text>
              <Text
                h3
                type={transaction.type === 'expense' ? 'success' : 'secondary'}
                onClick={() => {
                  setTransaction({
                    ...transaction,
                    type: 'expense',
                    category: '',
                  });
                  setErrorMsg('');
                }}
                style={{ fontWeight: 400, cursor: 'pointer' }}
              >
                Gasto
              </Text>
            </Row>
          )}

          <Text>Nombre</Text>
          <Input
            width='100%'
            value={transaction.name}
            onChange={(e) =>
              setTransaction({ ...transaction, name: e.target.value })
            }
          />
          <Spacer y={0.5} />

          <Text>Categoría</Text>
          <Select
            width='100%'
            placeholder='Seleccionar'
            onChange={(val) =>
              setTransaction({
                ...transaction,
                category: val,
              } as TransactionFields)
            }
            value={transaction.category}
          >
            {Object.keys(categoriesMap).map((key, index) => (
              <Select.Option value={key} key={index}>
                {categoriesMap[key]}
              </Select.Option>
            ))}
          </Select>
          <Spacer y={0.5} />

          <Text>Cantidad</Text>
          <Input
            type='number'
            width='100%'
            value={'' + transaction.amount}
            onChange={(e) => {
              const amountStr = e.target.value;
              if (isNumeric(amountStr)) {
                setTransaction({
                  ...transaction,
                  amount: parseFloat(amountStr),
                });
              }
            }}
          />
          <Spacer y={0.5} />

          <Text>Fecha</Text>
          <ReactDatePicker
            selected={transaction.date}
            onChange={(date) =>
              date instanceof Date && setTransaction({ ...transaction, date })
            }
            customInput={
              <input
                style={{
                  padding: '12px 102px 12px 12px',
                  margin: '0px auto',
                  borderRadius: '5px',
                  border: '1px solid #eaeaea',
                  fontSize: '.875rem',
                }}
              ></input>
            }
          />

          <Spacer y={0.5} />

          <Text>Comentarios</Text>
          <Textarea
            width='100%'
            value={transaction.comments}
            onChange={(e) =>
              setTransaction({ ...transaction, comments: e.target.value })
            }
          />
          <Spacer y={0.5} />

          {errorMsg && (
            <Text
              type='error'
              style={{
                margin: '0 auto',
                maxWidth: '220px',
                textAlign: 'center',
              }}
            >
              {errorMsg}
            </Text>
          )}
          <Spacer y={0.5} />
          <Row justify='center'>
            <Button type='success-light' size='large' onClick={finishOperation}>
              {action === 'add' ? 'Añadir' : 'Guardar'}
              {transaction.type === 'income' ? ' ingreso' : ' gasto'}
            </Button>
          </Row>
          <Spacer y={0.5} />
          <Row justify='center'>
            <Button type='abort' size='large' onClick={cancelOperation}>
              Cancelar
            </Button>
          </Row>
          <Spacer y={0.5} />
        </Card>
      </Grid.Container>
    </>
  );
};

export default TransactionForm;
