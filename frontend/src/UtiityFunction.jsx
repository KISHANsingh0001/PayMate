import axios from 'axios';
import { BACKEND_URL } from './config';

export async function GetBalance({token}){
    try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/account/balance`, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the request headers
            },
        });
        if(!response || !response.data) return 0;
        return response.data.balance; // Return the data fetched from the endpoint
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrow the error for the caller to handle
    }
}