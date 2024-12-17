// import axios from "axios";

// const baseUrl = "https://r3rxvxnb2j.execute-api.ap-southeast-1.amazonaws.com/test";

// export const getCO2Emissions = async (api_key) => {
//     try {

//         // include the api key under x-api-key
//         const response = await axios.get(`${baseUrl}/co2`, {
//             headers: {
//                 "x-api-key": api_key
//             }
//         });
//         return response.data;

//     } catch (error) {
//         console.error(error);
//     }


// export const getApiKeys = async (user_id) => {
//     try {
//         const response = await axios.get(`${baseUrl}/keys/${user_id}`);
//         return response.data;
//     } catch (error) {
//         console.error(error);
//     }
// }