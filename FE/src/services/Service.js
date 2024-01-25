import { useSelector, useDispatch } from "react-redux";
import { getAccessToken, logout, setAccessToken } from "../stores/slices/authSlice";
import { refreshTokenApi } from "./Auth";
import axios from "axios";
import { useEffect } from "react";

const useService = (dispatch, auth) => {

    const Service = axios.create({
        baseURL: `http://localhost:8080`,
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
    });

    Service.interceptors.request.use(
        async config => {
            if (!auth) {
                try {
                    const res = await refreshTokenApi();
                    dispatch(setAccessToken(res.data.accessToken))
                    if (!config.headers['Authorization']) {
                        config.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
                    }
                } catch (error) {
                    dispatch(logout())
                }
            } else if (!config.headers['Authorization']) {
                config.headers['Authorization'] = `Bearer ${auth}`;
            }
            return config;
        }, (error) => {
            Promise.reject(error)
        }
    );

    Service.interceptors.response.use(
        response => response,
        async (error) => {
            const prevRequest = error?.config;
            if (error?.response?.status === 403 && !prevRequest?.sent) {
                prevRequest.sent = true;
                try {
                    const res = await refreshTokenApi();
                    dispatch(setAccessToken(res.data.accessToken))
                    prevRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
                    return Service(prevRequest);
                } catch (error) {
                    dispatch(logout())
                }
            }
            return Promise.reject(error);
        }
    );

    return Service
}
export default useService;