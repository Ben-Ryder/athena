import {Navigate, Outlet, useLocation} from "react-router-dom";
import { useAthena } from "./use-athena";

/**
 * A route wrapper that can redirect users if they are not logged in or haven't entered their encryption key.
 * @constructor
 */
export function AthenaRestrictedRoute() {
    let { checkEncryptionKey } = useAthena();
    const location = useLocation();

    if (!checkEncryptionKey()) {
        return <Navigate to="/user/enter-encryption-key" state={{ from: location }} />;
    }

    return <Outlet />
}
