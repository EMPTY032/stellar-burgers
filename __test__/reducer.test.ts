import { rootReducer } from '../src/services/store';
import IngridientsReducer, {
  fetchIngridients,
  TingridientsState
} from '../src/services/ingridientsSlice';
import FeedReducer, {
  feedState,
  fetchFeeds,
  fetchOrdersCurentUser
} from '../src/services/feedSlice';
import UserReducer, {
  getUser,
  loginUser,
  registerUser,
  updateUser
} from '../src/services/userSlice';
import ConstructorReducer, {
  TConstructorType,
  addIngredient,
  removeIngridient
} from '../src/services/constructorSlice';
import OrderReducer, {
  clearNewOrder,
  createOrder,
  fetchOrderByNumber
} from '../src/services/orderSlice';

describe('тест редусера', () => {
  it('проверка правильной инициализации rootReducer', () => {
    const initial = rootReducer(undefined, { type: '@@INIT' });

    expect(initial).toEqual({
      ingridients: IngridientsReducer(undefined, { type: '@@INIT' }),
      feed: FeedReducer(undefined, { type: '@@INIT' }),
      user: UserReducer(undefined, { type: '@@INIT' }),
      burgerConstructor: ConstructorReducer(undefined, { type: '@@INIT' }),
      order: OrderReducer(undefined, { type: '@@INIT' })
    });
  });

  it('должен вернуть начальное состояние при неизвестном экшене', () => {
    const initial = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(initial).toEqual(rootReducer(undefined, { type: '@@INIT' }));
  });
});

describe('Проверяют редьюсер слайса burgerConstructor', () => {
  const initialState: TConstructorType = {
    bun: null,
    ingredients: []
  };

  const bun = {
    _id: '643d69a5c3f7b9001cfa093d',
    name: 'Флюоресцентная булка R2-D3',
    type: 'bun',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/bun-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
    __v: 0
  };

  const ingredient = {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
    __v: 0
  };

  it('добовление ингридиента', () => {
    const state = ConstructorReducer(initialState, addIngredient(bun));

    expect(state.bun).toMatchObject(bun);
  });
  it('удаление ингридиента', () => {
    const stateWithBun = ConstructorReducer(
      initialState,
      addIngredient(ingredient)
    );
    const stateAfterRemove = ConstructorReducer(
      stateWithBun,
      removeIngridient({ id: stateWithBun.ingredients[0].id })
    );

    expect(stateAfterRemove.ingredients).toEqual([]);
  });
});

describe('IngridientsReducer тест', () => {
  const initialState: TingridientsState = {
    ingridients: [],
    isloading: false,
    error: null
  };

  it('pending', () => {
    const state = IngridientsReducer(initialState, {
      type: fetchIngridients.pending.type
    });

    expect(state).toEqual({
      ingridients: [],
      isloading: true,
      error: null
    });
  });

  it('fulfilled', () => {
    const mockData = [
      {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
        __v: 0
      },
      {
        _id: '643d69a5c3f7b9001cfa0941',
        name: 'Биокотлета из марсианской Магнолии',
        type: 'main',
        proteins: 420,
        fat: 142,
        carbohydrates: 242,
        calories: 4242,
        price: 424,
        image: 'https://code.s3.yandex.net/react/code/meat-01.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
        __v: 0
      }
    ];

    const state = IngridientsReducer(initialState, {
      type: fetchIngridients.fulfilled.type,
      payload: mockData
    });

    expect(state).toEqual({
      ingridients: mockData,
      isloading: false,
      error: null
    });
  });

  it('rejected', () => {
    const errorMessage = 'Server error';

    const state = IngridientsReducer(initialState, {
      type: fetchIngridients.rejected.type,
      error: { message: errorMessage }
    });

    expect(state).toEqual({
      ingridients: [],
      isloading: false,
      error: errorMessage
    });
  });
});

describe('FeedReducer тест', () => {
  const initialState: feedState = {
    orders: [],
    total: 0,
    totalToday: 0,
    ordersAuth: [],
    isLoading: false,
    error: null
  };

  it('fetchFeeds.pending', () => {
    const state = FeedReducer(initialState, { type: fetchFeeds.pending.type });

    expect(state).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      ordersAuth: [],
      isLoading: true,
      error: null
    });
  });

  it('fetchFeeds.fulfilled', () => {
    const payload = { orders: [{ _id: '1' }], total: 10, totalToday: 5 };

    const state = FeedReducer(initialState, {
      type: fetchFeeds.fulfilled.type,
      payload: payload
    });

    expect(state).toEqual({
      orders: [{ _id: '1' }],
      total: 10,
      totalToday: 5,
      ordersAuth: [],
      isLoading: false,
      error: null
    });
  });

  it('fetchFeeds.rejected', () => {
    const errorMessage = 'ERROR';

    const state = FeedReducer(initialState, {
      type: fetchFeeds.rejected.type,
      payload: errorMessage
    });

    expect(state).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      ordersAuth: [],
      isLoading: false,
      error: errorMessage
    });
  });

  it('fetchOrdersCurentUser.pending', () => {
    const state = FeedReducer(initialState, {
      type: fetchOrdersCurentUser.pending.type
    });

    expect(state).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      ordersAuth: [],
      isLoading: false,
      error: null
    });
  });

  it('fetchOrdersCurentUser.fulfilled', () => {
    const state = FeedReducer(initialState, {
      type: fetchOrdersCurentUser.fulfilled.type,
      payload: [
        {
          _id: '691b99bfa64177001b31f2ae',
          ingredients: [
            '643d69a5c3f7b9001cfa093d',
            '643d69a5c3f7b9001cfa093e',
            '643d69a5c3f7b9001cfa093d'
          ],
          status: 'done',
          name: 'Флюоресцентный люминесцентный бургер',
          createdAt: '2025-11-17T21:55:11.423Z',
          updatedAt: '2025-11-17T21:55:11.623Z',
          number: 94537
        },
        {
          _id: '691b99fca64177001b31f2af',
          ingredients: [
            '643d69a5c3f7b9001cfa093d',
            '643d69a5c3f7b9001cfa093e',
            '643d69a5c3f7b9001cfa093d'
          ],
          status: 'done',
          name: 'Флюоресцентный люминесцентный бургер',
          createdAt: '2025-11-17T21:56:12.424Z',
          updatedAt: '2025-11-17T21:56:12.703Z',
          number: 94538
        }
      ]
    });

    expect(state).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      ordersAuth: [
        {
          _id: '691b99bfa64177001b31f2ae',
          ingredients: [
            '643d69a5c3f7b9001cfa093d',
            '643d69a5c3f7b9001cfa093e',
            '643d69a5c3f7b9001cfa093d'
          ],
          status: 'done',
          name: 'Флюоресцентный люминесцентный бургер',
          createdAt: '2025-11-17T21:55:11.423Z',
          updatedAt: '2025-11-17T21:55:11.623Z',
          number: 94537
        },
        {
          _id: '691b99fca64177001b31f2af',
          ingredients: [
            '643d69a5c3f7b9001cfa093d',
            '643d69a5c3f7b9001cfa093e',
            '643d69a5c3f7b9001cfa093d'
          ],
          status: 'done',
          name: 'Флюоресцентный люминесцентный бургер',
          createdAt: '2025-11-17T21:56:12.424Z',
          updatedAt: '2025-11-17T21:56:12.703Z',
          number: 94538
        }
      ],
      isLoading: false,
      error: null
    });
  });
});

describe('UserReducer тест', () => {
  const initialState = {
    isAuthCheked: false,
    data: null,
    loginUserRequest: false,
    error: null
  };

  it('loginUser.pending', () => {
    const state = UserReducer(initialState, { type: loginUser.pending.type });

    expect(state).toEqual({
      isAuthCheked: false,
      data: null,
      loginUserRequest: true,
      error: null
    });
  });

  it('loginUser.fulfilled', () => {
    const payload = {
      email: 'komiksmr99@gmail.com',
      name: 'Вернись ОКС'
    };

    const state = UserReducer(initialState, {
      type: loginUser.fulfilled.type,
      payload: payload
    });

    expect(state).toEqual({
      isAuthCheked: false,
      data: payload,
      loginUserRequest: false,
      error: null
    });
  });

  it('loginUser.rejected', () => {
    const errorMessage = 'ERROR';

    const state = UserReducer(initialState, {
      type: loginUser.rejected.type,
      payload: errorMessage
    });

    expect(state).toEqual({
      isAuthCheked: false,
      data: null,
      loginUserRequest: false,
      error: errorMessage
    });
  });

  it('registerUser.pending', () => {
    const state = UserReducer(initialState, {
      type: registerUser.pending.type
    });

    expect(state).toEqual({
      isAuthCheked: false,
      data: null,
      loginUserRequest: true,
      error: null
    });
  });

  it('registerUser.fulfilled', () => {
    const payload = {
      email: 'komiksmr99@gmail.com',
      name: 'Вернись ОКС'
    };

    const state = UserReducer(initialState, {
      type: registerUser.fulfilled.type,
      payload: payload
    });

    expect(state).toEqual({
      isAuthCheked: false,
      data: payload,
      loginUserRequest: false,
      error: null
    });
  });

  it('registerUser.rejected', () => {
    const errorMessage = 'ERROR';

    const state = UserReducer(initialState, {
      type: registerUser.rejected.type,
      payload: errorMessage
    });

    expect(state).toEqual({
      isAuthCheked: false,
      data: null,
      loginUserRequest: false,
      error: errorMessage
    });
  });

  it('getUser.fulfilled', () => {
    const payload = {
      email: 'komiksmr99@gmail.com',
      name: 'Вернись ОКС'
    };

    const state = UserReducer(initialState, {
      type: getUser.fulfilled.type,
      payload: payload
    });

    expect(state).toEqual({
      isAuthCheked: false,
      data: payload,
      loginUserRequest: false,
      error: null
    });
  });

  it('getUser.rejected', () => {
    const errorMessage = 'ERROR';

    const state = UserReducer(initialState, {
      type: getUser.rejected.type,
      payload: errorMessage
    });

    expect(state).toEqual({
      isAuthCheked: false,
      data: null,
      loginUserRequest: false,
      error: errorMessage
    });
  });

  it('updateUser.pending', () => {
    const state = UserReducer(initialState, { type: updateUser.pending.type });

    expect(state).toEqual({
      isAuthCheked: false,
      data: null,
      loginUserRequest: true,
      error: null
    });
  });

  it('updateUser.fulfilled', () => {
    const payload = {
      email: 'komiksmr99@gmail.com',
      name: 'Вернись ОКС'
    };

    const state = UserReducer(initialState, {
      type: updateUser.fulfilled.type,
      payload: payload
    });

    expect(state).toEqual({
      isAuthCheked: false,
      data: payload,
      loginUserRequest: false,
      error: null
    });
  });

  it('updateUser.rejected', () => {
    const errorMessage = 'ERROR';

    const state = UserReducer(initialState, {
      type: updateUser.rejected.type,
      payload: errorMessage
    });

    expect(state).toEqual({
      isAuthCheked: false,
      data: null,
      loginUserRequest: false,
      error: errorMessage
    });
  });
});

describe('orderSlice reducer', () => {
  const initialState = {
    newOrder: null,
    newOrderRequest: false,
    currentOrder: null,
    currentOrderRequest: false
  };

  it('createOrder.pending', () => {
    const state = OrderReducer(initialState, {
      type: createOrder.pending.type
    });

    expect(state).toEqual({
      ...initialState,
      newOrderRequest: true,
      newOrder: null
    });
  });

  it('createOrder.fulfilled', () => {
    const payload = { _id: '123' };

    const state = OrderReducer(initialState, {
      type: createOrder.fulfilled.type,
      payload
    });

    expect(state).toEqual({
      ...initialState,
      newOrderRequest: false,
      newOrder: payload
    });
  });

  it('createOrder.rejected', () => {
    const state = OrderReducer(initialState, {
      type: createOrder.rejected.type
    });

    expect(state).toEqual({
      ...initialState,
      newOrderRequest: false
    });
  });

  it('fetchOrderByNumber.pending', () => {
    const state = OrderReducer(initialState, {
      type: fetchOrderByNumber.pending.type
    });

    expect(state).toEqual({
      ...initialState,
      currentOrderRequest: true,
      currentOrder: null
    });
  });

  it('fetchOrderByNumber.fulfilled', () => {
    const payload = { _id: '777' };

    const state = OrderReducer(initialState, {
      type: fetchOrderByNumber.fulfilled.type,
      payload
    });

    expect(state).toEqual({
      ...initialState,
      currentOrderRequest: false,
      currentOrder: payload
    });
  });

  it('fetchOrderByNumber.rejected', () => {
    const state = OrderReducer(initialState, {
      type: fetchOrderByNumber.rejected.type
    });

    expect(state).toEqual({
      ...initialState,
      currentOrderRequest: false
    });
  });

  it('clearNewOrder', () => {
    const startState = {
      ...initialState,
      newOrder: { _id: 'xyz' }
    };

    const state = OrderReducer(startState, clearNewOrder());

    expect(state.newOrder).toBe(null);
  });
});
