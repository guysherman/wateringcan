import { useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import AuthenticationSlice from './slices/AuthenticationSlice';
import {
    FrameworksSlice,
    SectionsSlice,
    CapabilitiesSlice,
    BehaviorsSlice
} from './slices/FrameworksSlice';

const store = configureStore({
    reducer: {
        authentication: AuthenticationSlice,
        frameworks: FrameworksSlice,
        sections: SectionsSlice,
        capabilities: CapabilitiesSlice,
        behaviors: BehaviorsSlice,
    },
    middleware: (getDefaultMiddleware) => {
        const middlewares = getDefaultMiddleware();
        return middlewares;
    },
});

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store;

