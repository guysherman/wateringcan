import { useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import AuthenticationSlice, { AuthenticationState } from './slices/AuthenticationSlice';
import {
    FrameworksSlice,
    FrameworksState,
    SectionsSlice,
    SectionsState,
    CapabilitiesSlice,
    CapabilitiesState,
    BehaviorsSlice,
    BehaviorsState
} from './slices/FrameworksSlice';

export interface RootState {
    authentication: AuthenticationState;
    frameworks: FrameworksState;
    sections: SectionsState;
    capabilities: CapabilitiesState;
    behaviors: BehaviorsState;
}


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

