import { createContext, useState } from "react";

export const userContext = createContext();

const UseContext = ({ children }) => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com"
  });

  return (
    <userContext.Provider value={{ user, setUser }}>
      {children}
    </userContext.Provider>
  );
};

export default UseContext;
 