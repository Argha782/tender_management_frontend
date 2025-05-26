import { createContext, useState } from "react";

export const Context = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  user: null,
  setUser: () => {},
});

export const ContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  return (
    <Context.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser }}>
      {children}
    </Context.Provider>
  );
};
