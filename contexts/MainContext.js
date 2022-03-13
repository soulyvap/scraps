import PropTypes from "prop-types";
import React, { useState } from "react";

const MainContext = React.createContext({});

const MainProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [owner, setOwner] = useState({});
  const [isCategorySelected, setIsCategorySelected] = useState(false);
  const [categorySelected, setCategorySelected] = useState("");
  const [update, setUpdate] = useState(0);
  const [coords, setCoords] = useState({});

  return (
    <MainContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        owner,
        setOwner,
        categorySelected,
        setCategorySelected,
        isCategorySelected,
        setIsCategorySelected,
        update,
        setUpdate,
        coords,
        setCoords,
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
