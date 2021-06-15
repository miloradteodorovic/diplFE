import { awsClientId, awsUrl } from '../config';
import axios from 'axios';

export interface GetTokenData {
    access_token: string;
    expires_in: number;
    id_token: string;
    refresh_token: string;
    token_type: string;
}

export async function getIdToken(code: string): Promise<GetTokenData> {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', awsClientId);
    params.append('code', code);
    params.append('redirect_uri', 'http://localhost:8080/home');

    const response = await axios.post(awsUrl, params);
    return {
        access_token: response.data.access_token,
        expires_in: response.data.expires_in,
        id_token: response.data.id_token,
        refresh_token: response.data.refresh_token,
        token_type: response.data.token_type,
    };

}

export async function refreshToken(refreshToken: string): Promise<GetTokenData> {
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('client_id', awsClientId);
    params.append('refresh_token', refreshToken);
    console.log("refreshing with: ", refreshToken);

    const response = await axios.post(awsUrl, params);
    return {
        access_token: response.data.access_token,
        expires_in: response.data.expires_in,
        id_token: response.data.id_token,
        refresh_token: response.data.refresh_token,
        token_type: response.data.token_type,
    };
}