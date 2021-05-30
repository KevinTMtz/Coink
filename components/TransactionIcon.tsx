import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCar,
  faDollarSign,
  faFilm,
  faHandHoldingUsd,
  faHeart,
  faPiggyBank,
  faReceipt,
  faSign,
  faTshirt,
  faUniversity,
  faUtensils,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

interface IconProps {
  type: string;
  category: string;
}

const icons: { [key: string]: IconDefinition } = {
  bills: faReceipt,
  food: faUtensils,
  clothes: faTshirt,
  transport: faCar,
  entertainment: faFilm,
  health: faHeart,
  education: faUniversity,
  bonus: faHandHoldingUsd,
  salary: faDollarSign,
  sale: faSign,
  other: faPiggyBank,
};

const TransactionIcon: React.FC<IconProps> = ({ type, category }) => (
  <FontAwesomeIcon
    icon={icons[category]}
    color='#AAA'
    style={{
      height: '36px',
      width: '36px',
      color: type === 'income' ? '#0070F3' : '#FF0000',
      marginRight: '16px',
    }}
  />
);

export default TransactionIcon;
