import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

import { BaseState, RequestStatus } from '../Types';
import { apiUrl } from '../../config';
import FrameworkController, { TFramework, TSection, TCapability, TBehavior } from '../../controllers/FrameworkController';

const frameworkController: FrameworkController = new FrameworkController(apiUrl);

export interface FrameworksState extends BaseState {
    frameworks: TFramework[];
}

const initialFrameworksState: FrameworksState = {
    frameworks: [],
    requestStatus: 'idle',
};

export const getFrameworks = createAsyncThunk(
    'frameworks/get',
    async (): Promise<TFramework[]> => {
        const frameworks = await frameworkController.getFrameworks();
        return frameworks;
    }
);

const frameworksSlice = createSlice({
    name: 'frameworks',
    initialState: initialFrameworksState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getFrameworks.pending, (state) => {
            state.requestStatus = 'loading';
        });
        builder.addCase(getFrameworks.fulfilled, (state, action) => {
            state.frameworks = action.payload;
            state.requestStatus = 'success';
        });
        builder.addCase(getFrameworks.rejected, (state, action) => {
            state.requestStatus = 'failure';
            state.error = action.error;
        });
    }
});

export const frameworkListSelector = createSelector(
    (state): FrameworksState => state.frameworks,
    (slice): [TFramework[], any] => [slice.frameworks, slice.requestStatus]
);

export const frameworkSelector = createSelector(
    [
        (state): FrameworksState => state.frameworks,
        (_, frameworkId: number): number => frameworkId
    ],
    (slice: FrameworksState, frameworkId: number): TFramework | null =>
        slice.frameworks.find(f => f.id === frameworkId) || null
)

export const FrameworksSlice = frameworksSlice.reducer;

export interface SectionsState extends BaseState {
    sections: TSection[];
}

const initialSectionsState: SectionsState = {
    sections: [],
    requestStatus: 'idle',
};

export const getSectionsForFramework = createAsyncThunk(
    'sections/getForFramework',
    async (frameworkId: number): Promise<TSection[]> => {
        const sections = await frameworkController.getSections(frameworkId);
        return sections;
    }
);

const sectionsSlice = createSlice({
    name: 'sections',
    initialState: initialSectionsState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getSectionsForFramework.pending, (state) => {
            state.requestStatus = 'loading';
        });
        builder.addCase(getSectionsForFramework.fulfilled, (state, action) => {
            state.sections = action.payload;
            state.requestStatus = 'success';
        });
        builder.addCase(getSectionsForFramework.rejected, (state, action) => {
            state.requestStatus = 'failure';
            state.error = action.error;
        });
    }
});

export const sectionsSelector = createSelector(
    [
        (state): SectionsState => state.sections,
        (_, frameworkId: number): number => frameworkId
    ],
    (slice: SectionsState, frameworkId: number): [TSection[], RequestStatus] => 
        [
            slice.sections.filter((s: TSection) => s.frameworkId === frameworkId),
            slice.requestStatus
        ]
);

export const frameworkDetailSelector = createSelector(
    [frameworkSelector, sectionsSelector],
    (framework: TFramework | null,
        [sections, requestStatus]: [TSection[], RequestStatus])
     : [TFramework | null, TSection[], RequestStatus] =>
        [framework, sections, requestStatus]
);

export const SectionsSlice = sectionsSlice.reducer;

export interface CapabilitiesState extends BaseState {
    capabilities: TCapability[];
}

const initialCapabilitiesState: CapabilitiesState = {
    capabilities: [],
    requestStatus: 'loading',
};

export const getCapabilitiesForSection = createAsyncThunk(
    'capabilities/getForSection',
    async (sectionId: number): Promise<TCapability[]> => {
        const capabilities = await frameworkController.getCapabilities(sectionId);
        return capabilities;
    }
);

const capabilitiesSlice = createSlice({
    name: 'capabilities',
    initialState: initialCapabilitiesState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCapabilitiesForSection.pending, (state) => {
            state.requestStatus = 'loading';
        });
        builder.addCase(getCapabilitiesForSection.fulfilled, (state, action) => {
            const newCaps = [...state.capabilities].filter(c => c.sectionId !== action.meta.arg);

            state.capabilities = [...newCaps, ...action.payload];
            state.requestStatus = 'success';
        });
        builder.addCase(getCapabilitiesForSection.rejected, (state, action) => {
            state.requestStatus = 'failure';
            state.error = action.error;
        });
    }
});

export const capabilitiesSelector = createSelector(
    [
        (state): CapabilitiesState => state.capabilities,
        (_, sectionId: number): number => sectionId
    ],
    (slice: CapabilitiesState, sectionId: number): [TCapability[], RequestStatus] => 
        [
            slice.capabilities.filter((c: TCapability) => c.sectionId === sectionId),
            slice.requestStatus
        ]
);

export const CapabilitiesSlice = capabilitiesSlice.reducer;

export interface BehaviorsState extends BaseState {
    behaviors: TBehavior[];
}

const initialBehaviorsState: BehaviorsState = {
    behaviors: [],
    requestStatus: 'loading',
};

export const getBehaviorsForCapability = createAsyncThunk(
    'behaviors/getForCapability',
    async (capabilityId: number): Promise<TBehavior[]> => {
        const behaviors = await frameworkController.getBehaviors(capabilityId);
        return behaviors;
    }
);

const behaviorsSlice = createSlice({
    name: 'behaviors',
    initialState: initialBehaviorsState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getBehaviorsForCapability.pending, (state) => {
            state.requestStatus = 'loading';
        });
        builder.addCase(getBehaviorsForCapability.fulfilled, (state, action) => {
            const newBehavs = [...state.behaviors].filter(b => b.capabilityId !== action.meta.arg);

            state.behaviors = [...newBehavs, ...action.payload];
            state.requestStatus = 'success';
        });
        builder.addCase(getBehaviorsForCapability.rejected, (state, action) => {
            state.requestStatus = 'failure';
            state.error = action.error;
        });
    }
});

export const behaviorsSelector = createSelector(
    [
        (state): BehaviorsState => state.behaviors,
        (_, capabilityId: number): number => capabilityId
    ],
    (slice: BehaviorsState, capabilityId: number): [TBehavior[], RequestStatus] => 
        [
            slice.behaviors.filter((b: TBehavior) => b.capabilityId === capabilityId),
            slice.requestStatus
        ]
);

export const BehaviorsSlice = behaviorsSlice.reducer;