

import { LoginState } from './LoginController';

export interface TBehavior {
    id: number;
    name: string;
    description: string;
    level: number;
}

export interface TCapability {
    id: number;
    name: string;
    description: string;
    behaviors?: TBehavior[];
}

export interface TSection {
    id: number;
    name: string;
    description: string;
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
        },
        {
            id: 2,
            name: 'Throw things',
            description: '',
            level: 1,
        },
        {
            id: 3,
            name: 'Talks about whatnot',
            description: '',
            level: 1,
        },
        {
            id: 4,
            name: 'Thinks about many things',
            description: '',
            level: 2,
        },
    ],
]

const capabilities: TCapability[][] = [
    [
        {
            id: 1,
            name: 'Foo',
            description: 'Stuff, Things and Whatnot',
        },
        {
            id: 2,
            name: 'Grooming',
            description: 'Shaving, Hair-brushing, Clothes, and Dental care',
        },
        {
            id: 3,
            name: 'Transport',
            description: 'Driving, Flying, Swimming, Riding',
        },
    ]
]

const frameworks = [
    {
        id: 1,
        name: 'Test Framework - Seed 1',
        sections: [
            {
                id: 1,
                name: 'Section 1',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in commodo felis, in sodales velit.',
            },
            {
                id: 2,
                name: 'Section 2',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec consectetur tincidunt ligula ut commodo. Praesent. ',
            },
            {
                id: 3,
                name: 'Section 3',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In euismod risus erat, id malesuada purus.',
            },
        ]
    },
    {
        id: 2,
        name: 'Test Framework - Seed 2'
    },
];


function getData(): TFramework[] {
    return frameworks;
}

export default class FrameworkController {
    private apiUrl: string;
    private userContext: LoginState;

    constructor(apiUrl: string, userContext: LoginState ) {
        this.apiUrl = apiUrl;
        this.userContext = userContext;
    }

    async getFrameworks(): Promise<TFramework[]> {
        return getData();
    }

    async getFramework(id: number): Promise<TFramework> {
        return getData().find(f => f.id === id)!;
    }

    async getCapabilities(sectionId: number): Promise<TCapability[]> {
        return capabilities[sectionId - 1] || [];
    }

    async getBehaviors(capabilityId: number): Promise<TBehavior[]> {
        return behaviors[capabilityId - 1] || [];
    }
}