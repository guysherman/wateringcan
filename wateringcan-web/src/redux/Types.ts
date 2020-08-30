import { SerializedError } from '@reduxjs/toolkit';

export type RequestStatus = 'idle' | 'loading' | 'success' | 'failure';

export interface BaseState {
    requestStatus: RequestStatus;
    error?: SerializedError;
}