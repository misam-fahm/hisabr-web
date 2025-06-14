import { decodeToken } from "./decodeToken";

export const sendApiRequest = async (jsonData: any, apiRoute: string = 'apiCallV1') => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const userData: any = decodeToken(token);
      userData ? jsonData.userid = userData.userid : null;
    }
    const response: any = await fetch(`/api/${apiRoute}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    });

    if (!response.ok) {
      const errorData: any = await response.json();
      console.error('Error:', errorData.error || response.statusText);
      throw new Error(errorData.error || response.statusText);  // Rethrow the error to be handled by the caller
    }

    const result: any = await response.json();
    return result; // Return the result of the API call
  } catch (error) {
    console.error('Request failed:', error);
    throw error;  // Rethrow the error so that the calling function can handle it
  }
};
  