//#2 2:48:00   makes Axios automatically prefix EVERY request with baseURL
import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";
import { useNavigate } from "react-router-dom"; // you may need a custom redirect function if outside React

const Axios = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

//sending access token in the header  #2 4:34:00
Axios.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accesstoken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//incase access token expired , extend the life span of access token with
// the help refreshtoken
Axios.interceptors.request.use(
  (response) => {
    return response;
  },
  async (error) => {
    let originRequest = error.config;

    // Inside your Axios interceptor for 401
    if (error.response.status === 401 && !originRequest.retry) {
      originRequest.retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        const newAccessToken = await refreshAccessToken(refreshToken);

        if (newAccessToken) {
          originRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return Axios(originRequest);
        } else {
          // No new access token, session expired
          localStorage.clear();
          window.location.href = "/login?sessionExpired=true"; // Redirect with query
          return;
        }
      } else {
        // No refresh token, session expired
        localStorage.clear();
        window.location.href = "/login?sessionExpired=true";
        return;
      }
    }

    return Promise.reject(error);
  }
);
//#2 4:46:00
const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await Axios({
      ...SummaryApi.refreshToken,
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const accessToken = response.data.data.accessToken;
    localStorage.setItem("accesstoken", accessToken);
    return accessToken;
  } catch (error) {
    console.log(error);
  }
};

export default Axios;
