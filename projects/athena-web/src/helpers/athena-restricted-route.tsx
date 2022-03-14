import {Navigate, Outlet, useLocation} from "react-router-dom";
import { useAthena } from "./use-athena";
import { useEffect, useState } from 'react';

enum EncryptionKeyStatus {
    CHECKING = 'checking',
    SET = 'set',
    NOT_SET = 'not-set',
}

/**
 * A route wrapper that can redirect users if they are not logged in or haven't entered their encryption key.
 * @constructor
 */
export function AthenaRestrictedRoute() {
    let { checkEncryptionPhrase } = useAthena();
    const location = useLocation();
    const [ encryptionKeyStatus, setEncryptionKeyStatus ] = useState(EncryptionKeyStatus.CHECKING);

    useEffect(() => {
        async function checkEncryptionKey() {
            const encryptionKeyPresent = await checkEncryptionPhrase();
            if (encryptionKeyPresent) {
                setEncryptionKeyStatus(EncryptionKeyStatus.SET)
            }
            else {
                setEncryptionKeyStatus(EncryptionKeyStatus.NOT_SET)
            }
        }
        checkEncryptionKey();
    }, [checkEncryptionPhrase, setEncryptionKeyStatus]);

    if (encryptionKeyStatus === EncryptionKeyStatus.CHECKING) {
        return null;
    }
    else if (encryptionKeyStatus === EncryptionKeyStatus.NOT_SET) {
        return <Navigate to="/user/enter-encryption-key" state={{ from: location }} />;
    }
    else {
        return <Outlet />
    }
}
