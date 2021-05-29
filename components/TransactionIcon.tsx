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

const TransactionIcon: React.FC<IconProps> = ({ category }) => (
  <FontAwesomeIcon
    icon={icons[category]}
    color='#AAA'
    style={{ marginRight: '5em', width: '48px', height: '48px' }}
  />
);

export default TransactionIcon;
