import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';

import Form, { TransactionFields } from '../../components/TransactionForm';

interface EditTransactionPageProps extends ParsedUrlQuery {
  transactionID: string;
}

const EditTransactionPage: React.FC<EditTransactionPageProps> = ({
  transactionID,
}) => {
  const [transaction, setTransaction] = useState<TransactionFields>({
    type: 'income',
    category: '',
    name: '',
    comments: '',
    amount: 0.0,
    date: new Date(),
  });

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/transaction/${transactionID}`);
      if (!res.ok) {
        return router.replace('/dashboard');
      }
      const { type, category, name, comments, amount, date } = await res.json();
      setTransaction({
        type,
        category,
        name,
        comments: comments || '',
        amount,
        date: new Date(date),
      });
    })();
  }, [transactionID]);

  return (
    <Form
      action='edit'
      id={transactionID}
      transaction={transaction}
      setTransaction={setTransaction}
      router={router}
    />
  );
};

export const getServerSideProps: GetServerSideProps<
  EditTransactionPageProps,
  EditTransactionPageProps
> = async (ctx) => {
  const { transactionID } = ctx.params!!;
  return {
    props: { transactionID },
  };
};

export default EditTransactionPage;
