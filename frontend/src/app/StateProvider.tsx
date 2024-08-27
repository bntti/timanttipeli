import { type Dispatch, type JSX, type ReactNode, type SetStateAction, createContext, useMemo, useState } from 'react';
import { z } from 'zod';

export const UserSchema = z.object({ username: z.string(), admin: z.boolean(), cheats: z.boolean() });
export type User = z.infer<typeof UserSchema>;
type UserContextType = {
    user: User;
    setUser: Dispatch<SetStateAction<User>>;
};
export const UserContext = createContext<UserContextType>({} as UserContextType);

type ThemeContextType = { colorMode: { toggleTheme: () => void } };
export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const GlobalStateProvider = ({ children }: { children: ReactNode }): JSX.Element => {
    const [user, setUser] = useState<User>({ username: '', admin: false, cheats: false });
    const providerState = useMemo(() => ({ user, setUser }), [user]);
    return <UserContext.Provider value={providerState}>{children}</UserContext.Provider>;
};
