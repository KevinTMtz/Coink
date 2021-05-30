import React, { useState } from 'react';
/** @jsxImportSource @emotion/react */ import { css } from '@emotion/react';
import { NextRouter } from 'next/router';
import Head from 'next/head';
import {
  Button,
  Card,
  Input,
  Row,
  Spacer,
  Text,
  Textarea,
  Select,
  Modal,
} from '@geist-ui/react';
import ReactDatePicker from 'react-datepicker';
import isLength from 'validator/lib/isLength';
import isNumeric from 'validator/lib/isNumeric';

import Subtitle from './Subtitle';
import {
  expenseCategoriesTranslations,
  incomeCategoriesTranslations,
} from '../lib/translations';
import { IncomeCategory, ExpenseCategory } from '../server/models/Transaction';

const ContainerStyle = css({
  margin: 'auto',
  display: 'flex',
  alignItems: 'center',
  alignContent: 'center',
  width: '40%',
  minHeight: '100vh',
  '@media (max-width: 600px)': {
    width: '95%',
  },
});

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

  const [state, setState] = useState(false);
  const handler = () => setState(true);

  const closeHandler = () => {
    setState(false);
  };

  const categoriesMap: { [key: string]: string } =
    transaction.type === 'income'
      ? incomeCategoriesTranslations
      : expenseCategoriesTranslations;

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

  const deleteTransaction = async () => {
    const res = await fetch('/api/transaction/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.status === 200) cancelOperation();
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
      <div css={ContainerStyle}>
        <Card hoverable width='100%'>
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
                  padding: '12px',
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
            <Button
              type='success-light'
              size='large'
              style={{ width: '100%' }}
              onClick={finishOperation}
            >
              {action === 'add' ? 'Añadir' : 'Guardar'}
              {transaction.type === 'income' ? ' ingreso' : ' gasto'}
            </Button>
          </Row>
          {action === 'edit' && (
            <>
              <Spacer y={0.5} />
              <Row justify='center'>
                <Button
                  type='error'
                  ghost
                  size='large'
                  style={{ width: '100%' }}
                  onClick={handler}
                >
                  Eliminar{' '}
                  {transaction.type === 'income' ? ' ingreso' : ' gasto'}
                </Button>
              </Row>
              <Modal open={state} onClose={closeHandler}>
                <Modal.Title>
                  Eliminar{' '}
                  {transaction.type === 'income' ? ' ingreso' : ' gasto'}
                </Modal.Title>
                <Modal.Content>
                  <p>
                    ¿Estás seguro de que quieres eliminar este
                    {transaction.type === 'income' ? ' ingreso' : ' gasto'}?
                  </p>
                </Modal.Content>
                <Modal.Action passive onClick={() => setState(false)}>
                  Cancelar
                </Modal.Action>
                <Modal.Action
                  onClick={() => deleteTransaction()}
                  style={{ color: 'red' }}
                >
                  Eliminar
                </Modal.Action>
              </Modal>
            </>
          )}

          <Spacer y={0.5} />
          <Row justify='center'>
            <Button
              type='abort'
              size='large'
              style={{ width: '100%' }}
              onClick={cancelOperation}
            >
              Cancelar
            </Button>
          </Row>
          <Spacer y={0.5} />
        </Card>
      </div>
    </>
  );
};

export default TransactionForm;
