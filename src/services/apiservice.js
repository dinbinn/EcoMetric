import axios from 'axios';

const API_BASE_URL = 'https://mwkjwose45.execute-api.ap-southeast-1.amazonaws.com/test';

export const getTables = async () => {
    try {
        const userSub = sessionStorage.getItem('userSub');

        if (!userSub) {
            throw new Error('userSub is missing or not set in sessionStorage');
        }

        const response = await axios.get(`${API_BASE_URL}/getAllData`, {
            headers: {
                'x-user-sub': userSub 
            }
        });

        const parsedBody = response.data.body ? JSON.parse(response.data.body) : response.data;
        return parsedBody.data;
    } catch (error) {
        console.error('Error in getTables:', error.message, error.response?.data);
        throw error;
    }
};

export const getTableContents = async (tableName) => {
    try {
        const userSub = sessionStorage.getItem('userSub');

        if (!userSub) {
            throw new Error('userSub is missing or not set in sessionStorage');
        }

        const response = await axios.get(`${API_BASE_URL}/getAllData/${tableName}`, {
            headers: {
                'x-user-sub': userSub  
            }
        });

        const parsedBody = response.data.body ? JSON.parse(response.data.body) : response.data;

        if (!parsedBody.data) {
            throw new Error('Unexpected data structure or no data found.');
        }

        return parsedBody.data;
    } catch (error) {
        console.error('Error fetching table contents:', error);
        throw error;
    }
};
const API_POST_BASE_URL = 'https://ma3la05bq1.execute-api.ap-southeast-1.amazonaws.com/Post/';

export const submitCustomDataRequest = async (data) => {
    try {
        const response = await axios.post(`${API_POST_BASE_URL}customrequest`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response; 
    } catch (error) {
        console.error('Error submitting custom data request:', error);
        throw error; 
    }
};

