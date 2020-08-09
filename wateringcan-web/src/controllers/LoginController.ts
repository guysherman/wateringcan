export interface LoginSuccess {
    state?: 'success';
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    token?: string;
}

export type LoginState = LoginSuccess;

export interface LoginError {
    state: 'error';
    errorMessage: string;
}

export type LoginResponse =
    | LoginSuccess
    | LoginError;

export interface ILoginController {
    login(email: string, password: string) : Promise<LoginResponse>;
}

export default class LoginController implements ILoginController {
    private apiUrl: string;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
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

        const result: LoginError = await response.json();
        return result;
    }
}
