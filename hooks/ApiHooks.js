import { useEffect, useState } from "react";
import { baseUrl } from "../utils/variables";

const doFetch = async (url, options = {}) => {
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

const useMedia = () => {
  const [mediaArray, setMediaArray] = useState([]);
  const loadMedia = async (start = 0, limit = 100) => {
    try {
      const response = await fetch(
        `${baseUrl}media?start=${start}&limit${limit}`
      );
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const json = await response.json();
      const media = await Promise.all(
        json.map(async (item) => {
          const response = await fetch(baseUrl + "media/" + item.file_id);
          const mediaData = await response.json();
          return mediaData;
        })
      );
      setMediaArray(media);
      console.log(mediaArray);
    } catch (error) {
      console.error("Problem fetching the data from API", error);
    }
  };
  // call loadMedia() only once when the component is loaded
  useEffect(() => {
    loadMedia();
  }, []);

  return { mediaArray };
};

const useUser = () => {
  const getUserById = async (userId, token) => {
    const options = {
      method: "GET",
      headers: { "x-access-token": token },
    };
    return await doFetch(`${baseUrl}users/${userId}`, options);
  };

  return { getUserById };
};

const useTag = () => {
  const getFilesByTag = async (tag) => {
    return await doFetch(baseUrl + "tags/" + tag);
  };

  return { getFilesByTag };
};

export { useMedia, useUser, useTag };
