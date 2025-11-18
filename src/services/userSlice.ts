import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  TUserResponse,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { log } from 'console';
import { deleteCookie, getCookie, setCookie } from '../utils/cookie';
import { AppDispatch } from './store';

type TUserState = {
  isAuthCheked: boolean;
  data: TUser | null;
  loginUserRequest: boolean;
  error: string | null;
};

const initialState: TUserState = {
  isAuthCheked: false,
  data: null,
  loginUserRequest: false,
  error: null
};

export const chekUserAuth = () => (dispatch: AppDispatch) => {
  if (getCookie('accessToken')) {
    dispatch(getUser()).finally(() => {
      dispatch(authCheked());
    });
  } else {
    dispatch(authCheked());
  }
};

export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: any }
>('user/loginUser', async ({ email, password }, { rejectWithValue }) => {
  try {
    const data = await loginUserApi({ email, password });
    if (!data?.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: any }
>(
  'user/registerUser',
  async ({ email, password, name }: TRegisterData, { rejectWithValue }) => {
    try {
      const data = await registerUserApi({ email, password, name });
      if (!data?.success) {
        return rejectWithValue(data);
      }
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data.user;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getUser = createAsyncThunk<TUser, void, { rejectValue: any }>(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserApi();
      if (!data?.success) {
        return rejectWithValue(data);
      }
      return data.user;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: any }
>('user/updateUser', async (user, { rejectWithValue }) => {
  try {
    const data = await updateUserApi(user);
    if (!data?.success) {
      return rejectWithValue(data);
    }
    return data.user;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { dispatch }) => {
    logoutApi().then(() => {
      localStorage.clear();
      deleteCookie('accessToken');
      dispatch(userLogout());
    });
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authCheked(state) {
      state.isAuthCheked = true;
    },
    userLogout(state) {
      state.data = null;
      state.isAuthCheked = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.data = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loginUserRequest = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.data = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.error = action.payload;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.error = action.payload;
        state.data = null;
      })
      .addCase(updateUser.pending, (state) => {
        state.loginUserRequest = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.data = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.error = action.payload;
      });
  }
});
export const { authCheked, userLogout } = userSlice.actions;
export default userSlice.reducer;
