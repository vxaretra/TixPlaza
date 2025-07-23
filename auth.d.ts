import type { $Enums } from "@prisma/client";

declare module '#auth-utils' {
    interface User {
        id: number;
        name: string;
        email: string;
        role: $Enums.Role;
    }

    interface UserSession {
        // Add your own fields
    }

    interface SecureSessionData {
        // Add your own fields
    }
}

export { }
