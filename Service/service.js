import axios from 'axios';

export const fetchCityAndState = async (pin) => {
  try {
    const response = await axios.get(`http://postalpincode.in/api/pincode/${pin}`);
    console.log(response)
    if (response.data) {
      const city = response.data["PostOffice"][0]["District"];
      const state = response.data["PostOffice"][0]["State"];
      return { city, state };
    }
    throw new Error('Invalid response data');
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};
