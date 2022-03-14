import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useAthena} from "../../helpers/use-athena";

export function LogoutPage() {
    const navigate = useNavigate();
    const { deleteEncryptionPhrase } = useAthena();

    useEffect(() => {
        async function logout() {
            await deleteEncryptionPhrase();
            await navigate("/");
        }
        logout();
    }, [deleteEncryptionPhrase, navigate]);

    return (
        <>
            <h1>You are now being logged out.</h1>
            <p>You will be redirected shortly...</p>
        </>
    );
}

