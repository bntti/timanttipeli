import { createContext, useState } from 'react';

export type User = { username: string; admin: boolean };
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
