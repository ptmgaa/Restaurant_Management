import React, { createContext, useReducer } from "react";
import MyUserReducer from "../reducers/MyUserReducer";

export const MyUserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(MyUserReducer, null);

  return (
    <MyUserContext.Provider value={{ user, dispatch }}>
      {children}
    </MyUserContext.Provider>
  );
};
