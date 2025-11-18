import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getIngredientsByID } from '../../services/ingridientsSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();

  /** TODO: взять переменную из стора */
  const ingredientData = useSelector((state) => getIngredientsByID(state, id!));

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
