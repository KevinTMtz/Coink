import React, { useState } from 'react';
import { useRouter } from 'next/router';

import Form, { TransactionFields } from '../components/TransactionForm';

const AddTransactionPage: React.FC = () => {
  const [transaction, setTransaction] = useState<TransactionFields>({
    type: 'income',
    category: '',
    name: '',
    comments: '',
    amount: 0.0,
    date: new Date(),
  });

  const router = useRouter();

  return (
    <Form
      action='add'
      transaction={transaction}
      setTransaction={setTransaction}
      router={router}
    />
  );
};

export default AddTransactionPage;
