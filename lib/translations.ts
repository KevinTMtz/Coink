import { ExpenseCategory, IncomeCategory } from '../server/models/Transaction';

export const typeTranslations = {
  income: 'ingreso',
  expense: 'gasto',
};

export const incomeCategoriesTranslations: {
  [key in IncomeCategory]: string;
} = {
  bonus: 'Bono',
  salary: 'Salario',
  sale: 'Venta',
  other: 'Otro',
};

export const expenseCategoriesTranslations: {
  [key in ExpenseCategory]: string;
} = {
  food: 'Alimento',
  education: 'Educación',
  entertainment: 'Entretenimiento',
  bills: 'Recibo',
  health: 'Salud',
  transport: 'Transporte',
  clothes: 'Vestimenta',
  other: 'Otro',
};
