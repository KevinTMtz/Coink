import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
import Subtitle from './Subtitle';
import isLength from 'validator/lib/isLength';
import isNumeric from 'validator/lib/isNumeric';
import ReactDatePicker from 'react-datepicker';

import { postRequest } from '../lib/fetch';

type operationType = 'add' | 'edit';

interface TransactionFormProps {
  action: operationType;
}

const TransactionFormPage: React.FC<TransactionFormProps> = ({ action }) => {
  const [operation, _] = useState<operationType>(action);
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [comments, setComments] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [date, setDate] = useState(new Date());

  const router = useRouter();
  const { transactionID } = router.query;

  let categoriesMap: { [key: string]: string } =
    type === 'income'
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

  useEffect(() => {
    if (operation === 'edit' && transactionID) {
      // TODO: Get transaction info
    }
  }, [transactionID]);

  const categoryHandler = (val: string | string[]) => {
    if (typeof val === 'string') setCategory(val);
  };

  const finishOperation = async () => {
    if (!isLength(name, { min: 1 })) {
      setErrorMsg('Ingrese el nombre');
      return;
    }
    if (!isLength(category, { min: 1 })) {
      setErrorMsg('Ingrese la categoría');
      return;
    }
    if (!isLength(amountStr, { min: 1 }) || !isNumeric(amountStr)) {
      setErrorMsg('Ingrese una cantidad válida');
      return;
    }
    setErrorMsg('');

    const apiUrl = '/api/transaction/add';
    const amount = Number(amountStr);
    const id = operation === 'edit' ? transactionID : undefined;
    const body = {
      name,
      comments,
      amount,
      date,
      type,
      category,
      id,
    };

    const resBody = await postRequest(apiUrl, body, router);
    if (resBody?.error) {
      setErrorMsg(resBody.error);
    }
  };

  const cancelOperation = () => {
    // TODO: Return to last page
  };

  return (
    <>
      <Head>
        <title>
          {operation === 'add' ? 'Añadir' : 'Editar'}
          {type === 'income' ? ' ingreso' : ' gasto'}
        </title>
      </Head>
      <Grid.Container
        justify='center'
        alignItems='center'
        style={{ minHeight: '100vh', padding: '0 0.5rem' }}
      >
        <Card hoverable width='auto'>
          <Subtitle>
            {operation === 'add'
              ? 'Añadir'
              : `Editar ${type === 'income' ? 'ingreso' : 'gasto'}`}
          </Subtitle>
          {operation === 'add' && (
            <Row justify='space-around'>
              <Text
                h3
                type={type === 'income' ? 'success' : 'secondary'}
                onClick={() => {
                  setType('income');
                  setCategory('');
                  setErrorMsg('');
                }}
                style={{ fontWeight: 400, cursor: 'pointer' }}
              >
                Ingreso
              </Text>
              <Text
                h3
                type={type === 'expense' ? 'success' : 'secondary'}
                onClick={() => {
                  setType('expense');
                  setCategory('');
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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Spacer y={0.5} />

          <Text>Categoría</Text>
          <Select
            width='100%'
            placeholder='Seleccionar'
            onChange={categoryHandler}
            value={category}
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
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
          />
          <Spacer y={0.5} />

          <Text>Fecha</Text>
          <ReactDatePicker
            selected={date}
            onChange={(newDate) => newDate instanceof Date && setDate(newDate)}
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
            value={comments}
            onChange={(e) => setComments(e.target.value)}
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
              {`${operation === 'add' ? 'Añadir' : 'Editar'} ${
                type === 'income' ? 'ingreso' : 'gasto'
              }`}
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

export default TransactionFormPage;
