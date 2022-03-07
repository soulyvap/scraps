const baseUrl = "https://media.mw.metropolia.fi/wbma/";
const uploadsUrl = "https://media.mw.metropolia.fi/wbma/uploads/";
const appId = "scraps_final";
const avatarTag = `${appId}_avatar_`;
const userFileTag = `${appId}_`;
const chatTag = `${appId}_chat`;
const foodPostTag = `${appId}_post`;
const defaultAvatar =
  "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";

const defaultTags = [
  { id: 1, text: "all" },
  { id: 2, text: "dairy-free" },
  { id: 3, text: "egg-free" },
  { id: 4, text: "gluten-free" },
  { id: 5, text: "keto" },
  { id: 6, text: "nut-free" },
  { id: 7, text: "vegan" },
  { id: 8, text: "vegetarian" },
];

export {
  baseUrl,
  uploadsUrl,
  appId,
  avatarTag,
  userFileTag,
  chatTag,
  foodPostTag,
  defaultAvatar,
  defaultTags,
};
