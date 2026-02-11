//const API_URL = 'http://localhost:3000/api';
const API_URL = 'http://10.10.25.5:3000/api';

class ApiService {
    private token: string | null = null;

    setToken(token: string | null) {
        this.token = token;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {

        const headers: HeadersInit = {
            'Content-Type' : 'application/json',
            ...options.headers,
        }

        if(this.token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if(!response.ok) {
            throw new Error(data.error || 'Une erreur est survenue');
        }

        return data;
    }

    async register (email : string, password : string) {
        return this.request<{token : string; user : { id : number; email : string } }>(
            '/auth/register', {
                method: "POST",  
                body: JSON.stringify({ email, password })             
            }
        );
    }

    async login (email : string, password : string) {
        return this.request<{token : string; user : { id : number; email : string } }>(
            '/auth/login', {
                method: "POST",  
                body: JSON.stringify({ email, password })             
            }
        );
    }

    async getMe() {
        return this.request<{
            user : {id : number; email: string; expo_push_token: string | null };
        }>("/auth/me");
    }

    async savePushToken(pushToken : string) {
        return this.request('/auth/push-token', {
            method: "POST",  
            body: JSON.stringify({ pushToken }),           
        });
    }
}
export const api = new ApiService();