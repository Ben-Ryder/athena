import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useAthena} from "../../helpers/use-athena";

export function LogoutPage() {
    const navigate = useNavigate();
    const { apiClient } = useAthena();

    useEffect(() => {
        async function logout() {
            await apiClient.logout();
            await navigate("/");
        }
        logout();
    }, [apiClient, navigate]);

    return (
        <>
            <h1>You are now being logged out.</h1>
            <p>You will be redirected shortly...</p>
        </>
    );
}

