import React from 'react';
import { ProductStatus } from '../types/database';

interface StatusBadgeProps {
  status: ProductStatus;
  availableQuantity?: number;
  unit?: string;
  preorderRemaining?: number | null;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  availableQuantity,
  unit = 'ks',
  className = '',
}) => {
  switch (status) {
    case 'available':
      return (
        <span
          id={`status-badge-${status}`}
          className={`bg-[#E6F4EA] text-[#1E7E34] text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider ${className}`}
        >
          Skladem {availableQuantity !== undefined && availableQuantity > 0 ? `(${availableQuantity} ${unit})` : ''}
        </span>
      );

    case 'preorder':
      return (
        <span
          id={`status-badge-${status}`}
          className={`bg-[#FFF4E5] text-[#B25E09] text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider ${className}`}
        >
          Předobjednávka
        </span>
      );

    case 'made_to_order':
      return (
        <span
          id={`status-badge-${status}`}
          className={`bg-[#F1F3F4] text-[#5F6368] text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider ${className}`}
        >
          Na zakázku
        </span>
      );

    case 'coming_soon':
      return (
        <span
          id={`status-badge-${status}`}
          className={`bg-[#E8F0FE] text-[#1967D2] text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider ${className}`}
        >
          Připravujeme
        </span>
      );

    case 'sold_out':
      return (
        <span
          id={`status-badge-${status}`}
          className={`bg-[#F1F3F4] text-[#8A8A80] text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider ${className}`}
        >
          Vyprodáno
        </span>
      );

    case 'out_of_season':
      return (
        <span
          id={`status-badge-${status}`}
          className={`bg-[#FFF0E8] text-[#C2410C] text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider ${className}`}
        >
          Mimo sezónu
        </span>
      );

    case 'unavailable':
    default:
      return (
        <span
          id={`status-badge-${status}`}
          className={`bg-[#F1F3F4] text-[#8A8A80] text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider ${className}`}
        >
          Nedostupné
        </span>
      );
  }
};
