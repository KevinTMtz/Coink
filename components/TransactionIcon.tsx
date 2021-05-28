import React from 'react';

import {
  FontAwesomeIcon,
  FontAwesomeIcon as Icon,
} from '@fortawesome/react-fontawesome';
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
} from '@fortawesome/free-solid-svg-icons';

interface IconProps {
  category: String;
}

const TransactionIcon: React.FC<IconProps> = ({ category }) => {
  let icon = faPiggyBank;
  switch (category) {
    case 'bills':
      icon = faReceipt;
      break;
    case 'food':
      icon = faUtensils;
      break;
    case 'clothes':
      icon = faTshirt;
      break;
    case 'transport':
      icon = faCar;
      break;
    case 'entertainment':
      icon = faFilm;
      break;
    case 'health':
      icon = faHeart;
      break;
    case 'education':
      icon = faUniversity;
      break;
    case 'bonus':
      icon = faHandHoldingUsd;
      break;
    case 'salary':
      icon = faDollarSign;
      break;
    case 'sale':
      icon = faSign;
      break;
  }
  return (
    <FontAwesomeIcon
      icon={icon}
      size='3x'
      color='white'
      style={{ backgroundColor: 'black' }}
    />
  );
};

export default TransactionIcon;
