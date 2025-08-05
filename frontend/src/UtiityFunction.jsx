import axios from 'axios';

export async function GetBalance({token}){
    try {
        const response = await axios.get('http://localhost:3000/api/v1/account/balance', {
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