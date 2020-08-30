

export interface TBehavior {
    id: number;
    name: string;
    description: string;
    capabilityId: number,
    level: number;
}

export interface TCapability {
    id: number;
    name: string;
    description: string;
    sectionId: number;
    behaviors?: TBehavior[];
}

export interface TSection {
    id: number;
    name: string;
    description: string;
    frameworkId: number;
    capabilities?: TCapability[];
}

export interface TFramework {
    id: number;
    name: string;
    sections?: TSection[];
}

const behaviors: TBehavior[][] = [
    [
        {
            id: 1,
            name: 'Do stuff',
            description: '',
            level: 1,
            capabilityId: 1,
        },
        {
            id: 2,
            name: 'Throw things',
            description: '',
            level: 1,
            capabilityId: 1,
        },
        {
            id: 3,
            name: 'Talks about whatnot',
            description: '',
            level: 1,
            capabilityId: 1,
        },
        {
            id: 4,
            name: 'Thinks about many things',
            description: '',
            level: 2,
            capabilityId: 1,
        },
    ],
]

const capabilities: TCapability[][] = [
    [
        {
            id: 1,
            name: 'Foo',
            description: 'Stuff, Things and Whatnot',
            sectionId: 1,
        },
        {
            id: 2,
            name: 'Grooming',
            description: 'Shaving, Hair-brushing, Clothes, and Dental care',
            sectionId: 1,
        },
        {
            id: 3,
            name: 'Transport',
            description: 'Driving, Flying, Swimming, Riding',
            sectionId: 1,
        },
    ]
]

const sections: TSection[][] = [
    [
        {
            id: 1,
            name: 'Section 1',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in commodo felis, in sodales velit.',
            frameworkId: 1,
        },
        {
            id: 2,
            name: 'Section 2',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec consectetur tincidunt ligula ut commodo. Praesent. ',
            frameworkId: 1,
        },
        {
            id: 3,
            name: 'Section 3',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In euismod risus erat, id malesuada purus.',
            frameworkId: 1,
        },
    ],
    [],
];

const frameworks = [
    {
        id: 1,
        name: 'Test Framework - Seed 1',
    },
    {
        id: 2,
        name: 'Test Framework - Seed 2'
    },
];

const timeout = async(time: number) => {
    const p = new Promise(resolve => setTimeout(resolve, time));
    return p;
}


function getData(): TFramework[] {
    return frameworks;
}

export interface IFrameworkController {
    getFrameworks(): Promise<TFramework[]>;
    getSections(frameworkId: number): Promise<TSection[]>;
    getCapabilities(sectionId: number): Promise<TCapability[]>;
    getBehaviors(capabilityId: number): Promise<TBehavior[]>;
}

export default class FrameworkController implements IFrameworkController{
    // private apiUrl: string;

    // constructor(apiUrl: string) {
    //     this.apiUrl = apiUrl;
    // }

    async getFrameworks(): Promise<TFramework[]> {
        return getData();
    }

    async getSections(frameworkId: number): Promise<TSection[]> {
        return sections[frameworkId - 1] || [];
    }

    async getCapabilities(sectionId: number): Promise<TCapability[]> {
        return capabilities[sectionId - 1] || [];
    }

    async getBehaviors(capabilityId: number): Promise<TBehavior[]> {
        return behaviors[capabilityId - 1] || [];
    }
}