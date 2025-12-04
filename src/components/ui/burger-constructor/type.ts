import { TOrder } from '@utils-types';
import { TConstructorType } from '../../../services/constructorSlice';

export type BurgerConstructorUIProps = {
  constructorItems: TConstructorType;
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
