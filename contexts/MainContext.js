import React, { useState } from "react";
import PropTypes from "prop-types";

const MainContext = React.createContext({});

const MainProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser, owner, setOwner] = useState({});
  const [update, setUpdate] = useState(false);

  return (
    <MainContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        owner,
        setOwner,
        update,
        setUpdate,
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
};

MainProvider.propTypes = {
  children: PropTypes.node,
};

export { MainContext, MainProvider };
