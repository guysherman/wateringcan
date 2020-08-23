import Cookies from 'js-cookie';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    token: string;
    permittedObjects?: string;
}

export interface ILoginController {
    login(email: string, password: string) : Promise<User>;
    getPermittedObjects(userId: string) : Promise<String>;
}

export default class LoginController implements ILoginController {
    private apiUrl: string;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    async login(email: string, password: string) : Promise<User> {
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

        if (!response.ok) {
            const responseMessage = await response.json();
            throw Error(responseMessage.errorMessage);
        }

        const result : User = await response.json();
        Cookies.set('x-jwt-token', result.token);
        return result;

    }

    async getPermittedObjects(userId: string) : Promise<String> {
        const url: string = `${this.apiUrl}/auth/user/${userId}/permittedObjects`;
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('x-jwt-token') || ''}`
            },
        });

        if (!response.ok) {
            const responseMessage = await response.json();
            throw Error(responseMessage.errorMessage);
        }

        const result : string = await response.json();
        return result;
    }
}
