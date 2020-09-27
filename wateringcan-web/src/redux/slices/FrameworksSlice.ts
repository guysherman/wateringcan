import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

import {
    RequestStatus, FrameworksState, SectionsState, CapabilitiesState, BehaviorsState, RootState,
} from '../Types';
// import { apiUrl } from '../../config';
import FrameworkController, {
    TFramework, TSection, TCapability, TBehavior,
} from '../../controllers/FrameworkController';

const frameworkController: FrameworkController = new FrameworkController();

const initialFrameworksState: FrameworksState = {
    frameworks: [],
    requestStatus: 'idle',
};

export const getFrameworks = createAsyncThunk(
    'frameworks/get',
    async (): Promise<TFramework[]> => {
        const frameworks = await frameworkController.getFrameworks();
        return frameworks;
    },
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
    },
});

export const frameworkListSelector = createSelector(
    (state: RootState): FrameworksState => state.frameworks,
    (slice): [TFramework[], any] => [slice.frameworks, slice.requestStatus],
);

export const frameworkSelector = createSelector(
    [
        (state: RootState): FrameworksState => state.frameworks,
        (_: any, frameworkId: number): number => frameworkId,
    ],
    (slice: FrameworksState, frameworkId: number):
        TFramework | null => slice.frameworks.find((f) => f.id === frameworkId) || null,
);

export const FrameworksSlice = frameworksSlice.reducer;

const initialSectionsState: SectionsState = {
    sections: [],
    requestStatus: 'idle',
};

export const getSectionsForFramework = createAsyncThunk(
    'sections/getForFramework',
    async (frameworkId: number): Promise<TSection[]> => {
        const sections = await frameworkController.getSections(frameworkId);
        return sections;
    },
);

export const addSectionToFramework = createAsyncThunk(
    'sections/addToFramework',
    async (arg: {frameworkId: number, section: TSection}): Promise<TSection> => {
        const section = await frameworkController.addSection(arg.frameworkId, arg.section);
        return section;
    },
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

        builder.addCase(addSectionToFramework.pending, (state, action) => {
            state.requestStatus = 'saving';
            state.sections = [...state.sections, action.meta.arg.section];
        });
        builder.addCase(addSectionToFramework.fulfilled, (state, action) => {
            const newSections = [...state.sections, action.payload]
                .filter((s) => s.id !== action.meta.arg.section.id);

            state.sections = newSections;
            state.requestStatus = 'success';
        });
        builder.addCase(addSectionToFramework.rejected, (state, action) => {
            state.requestStatus = 'failure';
            state.error = action.error;
        });
    },
});

export const sectionsSelector = createSelector(
    [
        (state: RootState): SectionsState => state.sections,
        (_: any, frameworkId: number): number => frameworkId,
    ],
    (slice: SectionsState, frameworkId: number): [TSection[], RequestStatus] => [
        slice.sections.filter((s: TSection) => s.frameworkId === frameworkId),
        slice.requestStatus,
    ],
);

export const frameworkDetailSelector = createSelector(
    [frameworkSelector, sectionsSelector],
    (framework: TFramework | null,
        [sections, requestStatus]: [TSection[], RequestStatus])
     : [TFramework | null, TSection[], RequestStatus] => [framework, sections, requestStatus],
);

export const SectionsSlice = sectionsSlice.reducer;

const initialCapabilitiesState: CapabilitiesState = {
    capabilities: [],
    requestStatus: 'loading',
};

export const getCapabilitiesForSection = createAsyncThunk(
    'capabilities/getForSection',
    async (sectionId: number): Promise<TCapability[]> => {
        const capabilities = await frameworkController.getCapabilities(sectionId);
        return capabilities;
    },
);

export const addCapabilityToSection = createAsyncThunk(
    'capabilities/addToSection',
    async (arg: {sectionId: number, capability: TCapability}): Promise<TCapability> => {
        const newCap = await frameworkController.addCapability(arg.sectionId, arg.capability);
        return newCap;
    },
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
            const newCaps = [...state.capabilities].filter((c) => c.sectionId !== action.meta.arg);

            state.capabilities = [...newCaps, ...action.payload];
            state.requestStatus = 'success';
        });
        builder.addCase(getCapabilitiesForSection.rejected, (state, action) => {
            state.requestStatus = 'failure';
            state.error = action.error;
        });

        builder.addCase(addCapabilityToSection.pending, (state, action) => {
            state.requestStatus = 'saving';
            state.capabilities = [...state.capabilities, action.meta.arg.capability];
        });
        builder.addCase(addCapabilityToSection.fulfilled, (state, action) => {
            const newCaps = [...state.capabilities, action.payload]
                .filter((c) => c.id !== action.meta.arg.capability.id);
            state.capabilities = newCaps;
            state.requestStatus = 'success';
        });
        builder.addCase(addCapabilityToSection.rejected, (state, action) => {
            state.requestStatus = 'failure';
            state.error = action.error;
        });
    },
});

export const capabilitiesSelector = createSelector(
    [
        (state: RootState): CapabilitiesState => state.capabilities,
        (_: any, sectionId: number): number => sectionId,
    ],
    (slice: CapabilitiesState, sectionId: number): [TCapability[], RequestStatus] => [
        slice.capabilities.filter((c: TCapability) => c.sectionId === sectionId),
        slice.requestStatus,
    ],
);

export const CapabilitiesSlice = capabilitiesSlice.reducer;

const initialBehaviorsState: BehaviorsState = {
    behaviors: [],
    requestStatus: 'loading',
};

export const getBehaviorsForCapability = createAsyncThunk(
    'behaviors/getForCapability',
    async (capabilityId: number): Promise<TBehavior[]> => {
        const behaviors = await frameworkController.getBehaviors(capabilityId);
        return behaviors;
    },
);

export const addBehaviorToCapability = createAsyncThunk(
    'behaviors/addToCapability',
    async (arg: {capabilityId: number, behavior: TBehavior}) : Promise<TBehavior> => {
        const { capabilityId, behavior } = arg;
        const retBehavior = await frameworkController.addBehavior(capabilityId, behavior);
        return retBehavior;
    },
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
            const newBehavs = [...state.behaviors]
                .filter((b) => b.capabilityId !== action.meta.arg);

            state.behaviors = [...newBehavs, ...action.payload];
            state.requestStatus = 'success';
        });
        builder.addCase(getBehaviorsForCapability.rejected, (state, action) => {
            state.requestStatus = 'failure';
            state.error = action.error;
        });

        builder.addCase(addBehaviorToCapability.pending, (state, action) => {
            state.requestStatus = 'saving';
            state.behaviors = [...state.behaviors, action.meta.arg.behavior];
        });
        builder.addCase(addBehaviorToCapability.fulfilled, (state, action) => {
            const newBehavs = [...state.behaviors, action.payload]
                .filter((b) => b.id !== action.meta.arg.behavior.id);
            state.behaviors = newBehavs;
            state.requestStatus = 'success';
        });
        builder.addCase(addBehaviorToCapability.rejected, (state, action) => {
            state.requestStatus = 'failure';
            state.error = action.error;
        });
    },
});

export const behaviorsSelector = createSelector(
    [
        (state: RootState): BehaviorsState => state.behaviors,
        (_: any, capabilityId: number): number => capabilityId,
    ],
    (slice: BehaviorsState, capabilityId: number): [TBehavior[], RequestStatus] => [
        slice.behaviors.filter((b: TBehavior) => b.capabilityId === capabilityId),
        slice.requestStatus,
    ],
);

export const BehaviorsSlice = behaviorsSlice.reducer;
