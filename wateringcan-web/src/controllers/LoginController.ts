export interface LoginSuccess {
    state?: 'success';
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    token?: string;
}

export interface SuccessResponse {
    state?: 'success';
    response: any;
}

export type LoginState = LoginSuccess;

export interface ErrorResponse {
    state: 'error';
    errorMessage: string;
}

export type LoginResponse =
    | LoginSuccess
    | ErrorResponse;

export type ApiResponse = 
    | SuccessResponse
    | ErrorResponse;

    export interface ILoginController {
    login(email: string, password: string) : Promise<LoginResponse>;
    getPermittedObjects(userId: string) : Promise<ApiResponse>;
}

export default class LoginController implements ILoginController {
    private apiUrl: string;
    private userContext: LoginState;

    constructor(apiUrl: string, userContext: LoginState ) {
        this.apiUrl = apiUrl;
        this.userContext = userContext;
    }

    async login(email: string, password: string) : Promise<LoginResponse> {
        const url: string = `${this.apiUrl}/auth/login`;
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const result : LoginSuccess = await response.json();
            return result;
        }

        const result: ErrorResponse = await response.json();
        return result;
    }

    async getPermittedObjects(userId: string) : Promise<ApiResponse> {
        const url: string = `${this.apiUrl}/auth/user/${userId}/permittedObjects`;
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.userContext.token}`
            },
        });

        if (response.ok) {
            const result : SuccessResponse = await response.json();
            return result;
        }

        const result: ErrorResponse = await response.json();
        return result;
    }
}
