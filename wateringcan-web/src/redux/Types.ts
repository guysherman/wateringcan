import { SerializedError } from '@reduxjs/toolkit';
import { User } from '../controllers/LoginController';
import {
    TFramework, TSection, TCapability, TBehavior,
} from '../controllers/FrameworkController';

export type RequestStatus = 'idle' | 'loading' | 'saving' | 'success' | 'failure';

export interface BaseState {
    requestStatus: RequestStatus;
    error?: SerializedError;
}

export interface AuthenticationState {
    user?: User;
    requestStatus: 'idle' | 'loading' | 'saving' | 'success' | 'failure';
    isLoggedIn: boolean;
    error?: SerializedError;
}

export interface FrameworksState extends BaseState {
    frameworks: TFramework[];
}

export interface SectionsState extends BaseState {
    sections: TSection[];
}

export interface CapabilitiesState extends BaseState {
    capabilities: TCapability[];
}

export interface BehaviorsState extends BaseState {
    behaviors: TBehavior[];
}

export interface RootState {
    authentication: AuthenticationState;
    frameworks: FrameworksState;
    sections: SectionsState;
    capabilities: CapabilitiesState;
    behaviors: BehaviorsState;
}
