import React, { useState } from "react";
import PropTypes from "prop-types";

const MainContext = React.createContext({});

const MainProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [update, setUpdate] = useState(false);
  const [owner, setOwner] = useState({});
  const [isCategorySelected, setIsCategorySelected] = useState(false);
  const [categorySelected, setCategorySelected] = useState({});

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
        categorySelected,
        setCategorySelected,
        isCategorySelected,
        setIsCategorySelected,
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
