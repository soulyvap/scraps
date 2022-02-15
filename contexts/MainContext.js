import React, { useState } from "react";

const MainContext = React.createContext({});

const MainProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [update, setUpdate] = useState(false);

  return (
    <MainContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, user, setUser, update, setUpdate }}
    >
      {props.children}
    </MainContext.Provider>
  );
};

export { MainContext, MainProvider };
