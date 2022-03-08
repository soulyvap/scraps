import { useContext, useEffect, useState } from "react";
import { baseUrl, foodPostTag, userFileTag } from "../utils/variables";
import { MainContext } from "../contexts/MainContext";

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

  const getUserByToken = async (token) => {
    const options = {
      method: "GET",
      headers: { "x-access-token": token },
    };
    const userData = await doFetch(baseUrl + "users/user", options);
    return userData;
  };

  return { postUser, checkUsername, getUserById, getUserByToken };
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

const useMedia = (tagSelected) => {
  const [mediaArray, setMediaArray] = useState([]);
  const [userMediaArray, setUserMediaArray] = useState([]);
  const { user, update, setUpdate } = useContext(MainContext);
  const [scrapsMediaArray, setScrapsMediaArray] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const getMediaById = async (fileId) => {
    return await doFetch(baseUrl + "media/" + fileId);
  };

  const deleteMediaById = async (fileId, token) => {
    const options = {
      method: "DELETE",
      headers: {
        "x-access-token": token,
      },
    };
    return await doFetch(baseUrl + "media/" + fileId, options);
  };

  const loadMedia = async () => {
    setLoading(true);
    try {
      let json = await useTag().getFilesByTag(tagSelected);
      const media = await Promise.all(
        json.map(async (item) => {
          const response = await fetch(baseUrl + "media/" + item.file_id);
          const mediaData = await response.json();
          return mediaData;
        })
      );
      setMediaArray(media);
    } catch (error) {
      console.error("Problem fetching the data from API", error);
    } finally {
      setLoading(false);
    }
  };

  //fetch only user's files
  const loadUserMedia = async () => {
    setLoading(true);
    try {
      let json = await useTag().getFilesByTag(foodPostTag);
      json = json.filter((file) => file.user_id === user.user_id);
      const media = await Promise.all(
        json.map(async (item) => {
          const response = await fetch(baseUrl + "media/" + item.file_id);
          const mediaData = await response.json();
          return mediaData;
        })
      );
      setUserMediaArray(media) && setUpdate(update + 1);
    } catch (error) {
      console.error("Problem fetching user files from API", error);
    } finally {
      setLoading(false);
    }
  };

  const loadScrapsMedia = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}tags/${foodPostTag}`);
      if (!response.ok) {
        throw Error(response.statusText);
      }
      let json = await response.json();
      const media = await Promise.all(
        json.map(async (item) => {
          const response = await fetch(baseUrl + "media/" + item.file_id);
          const mediaData = await response.json();
          return mediaData;
        })
      );
      setScrapsMediaArray(media);
    } catch (error) {
      console.error("Problem fetching the data from API", error);
    } finally {
      setLoading(false);
    }
  };

  const getMediaByFileId = async (fileId) => {
    return await doFetch(baseUrl + "media/" + fileId);
  };

  useEffect(() => {
    loadMedia();
    loadUserMedia();
    // loadScrapsMedia();
  }, [update]);

  return {
    postMedia,
    mediaArray,
    getMediaById,
    userMediaArray,
    scrapsMediaArray,
    deleteMediaById,
    getMediaByFileId,
  };
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

  const getFilesByTag = async (tag) => {
    return await doFetch(baseUrl + "tags/" + tag);
  };

  const getTagsByFileId = async (fileId) => {
    return await doFetch(baseUrl + "tags/file/" + fileId);
  };

  return { postTag, getFilesByTag, getTagsByFileId };
};

const useRating = () => {
  const getRatingsById = async (userFileId) => {
    return await doFetch(baseUrl + "ratings/file/" + userFileId);
  };

  const getRatingsByFileId = async (fileId) => {
    return await doFetch(`${baseUrl}ratings/file/${fileId}`);
  };

  const postRating = async (fileId, rating, token) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify({ file_id: fileId, rating: rating }),
    };
    return await doFetch(baseUrl + "ratings/", options);
  };

  const deleteRating = async (ratingId, token) => {
    const options = {
      method: "DELETE",
      headers: {
        "x-access-token": token,
      },
    };
    return await doFetch(`${baseUrl}ratings/file/${ratingId}`, options);
  };

  return { getRatingsById, getRatingsByFileId, postRating, deleteRating };
};

const useComment = () => {
  const getCommentsById = async (fileId) => {
    return await doFetch(baseUrl + "comments/file/" + fileId);
  };

  const postComment = async (commentData, token) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify(commentData),
    };
    return doFetch(baseUrl + "comments", options);
  };

  const deleteComment = async (commentId, token) => {
    const options = {
      method: "DELETE",
      headers: {
        "x-access-token": token,
      },
    };
    return await doFetch(`${baseUrl}comments/file/${commentId}`, options);
  };

  return { getCommentsById, postComment, deleteComment };
};

export { useMedia, useLogin, useUser, useTag, useRating, useComment };
