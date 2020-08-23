import { useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import AuthenticationSlice from './slices/AuthenticationSlice';

const store = configureStore({
    reducer: {
        authentication: AuthenticationSlice,
    }
});

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store;

