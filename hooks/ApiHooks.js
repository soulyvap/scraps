import { baseUrl } from "../utils/variables";

const doFetch = async (url, options) => {
  try {
    const response = await fetch(url, options);
    const json = await response.json();
    if (response.ok) {
      return json;
    } else {
      const message = json.error
        ? `${json.message}: ${json.error}`
        : json.message;
      throw new Error(message || response.statusText);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const useUser = () => {
  const postUser = async (data) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const json = await doFetch(baseUrl + "users", options);
    return json;
  };

  const checkUsername = async (userName) => {
    const response = await doFetch(baseUrl + "users/username/" + userName);
    return await response;
  };

  const getUserById = async (userId, token) => {
    const options = {
      method: "GET",
      headers: { "x-access-token": token },
    };
    const userData = await doFetch(baseUrl + "users/" + userId, options);
    return userData;
  };

  return { postUser, checkUsername, getUserById };
};

const useLogin = () => {
  const postLogin = async (userCredentials) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userCredentials),
    };
    const json = await doFetch(baseUrl + "login", options);
    return json;
  };
  return { postLogin };
};

const useMedia = () => {
  const postMedia = async (formData, token) => {
    const options = {
      method: "POST",
      headers: {
        "x-access-token": token,
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    };
    const result = await doFetch(baseUrl + "media", options);
    return result;
  };

  return { postMedia };
};

const useTag = () => {
  const postTag = async (tagData, token) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify(tagData),
    };
    return await doFetch(baseUrl + "tags/", options);
  };

  return { postTag };
};

export { useMedia, useLogin, useUser, useTag };
