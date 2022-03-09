import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useAthena} from "../../helpers/use-athena";

export function LogoutPage() {
    const navigate = useNavigate();
    const { deleteEncryptionKey } = useAthena();

    useEffect(() => {
        async function logout() {
            deleteEncryptionKey();
            await navigate("/");
        }
        logout();
    }, []);

    return (
        <>
            <h1>You are now being logged out.</h1>
            <p>You will be redirected shortly...</p>
        </>
    );
}

