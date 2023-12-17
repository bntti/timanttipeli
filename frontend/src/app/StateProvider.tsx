import { createContext, useState } from 'react';

type UserContext = { user: string; setUser: React.Dispatch<React.SetStateAction<string>> };
export const UserContext = createContext<UserContext>({} as UserContext);

type ThemeContext = { colorMode: { toggleTheme: () => void } };
export const ThemeContext = createContext<ThemeContext>({} as ThemeContext);

export const GlobalStateProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const [user, setUser] = useState<string>('');
    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
