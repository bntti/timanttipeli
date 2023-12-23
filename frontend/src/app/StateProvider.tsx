import { createContext, useState } from 'react';
import { z } from 'zod';

export const UserSchema = z.object({ username: z.string(), admin: z.boolean() });
export type User = z.infer<typeof UserSchema>;
type UserContext = {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
};
export const UserContext = createContext<UserContext>({} as UserContext);

type ThemeContext = { colorMode: { toggleTheme: () => void } };
export const ThemeContext = createContext<ThemeContext>({} as ThemeContext);

export const GlobalStateProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const [user, setUser] = useState<User>({ username: '', admin: false });
    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
