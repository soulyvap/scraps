const baseUrl = "https://media.mw.metropolia.fi/wbma/";
const uploadsUrl = "https://media.mw.metropolia.fi/wbma/uploads/";
const appId = "scraps2022";
const avatarTag = `${appId}_avatar_`;
const userFileTag = `${appId}_`;
const chatTag = `${appId}_chat`;
const foodPostTag = `${appId}_post`;
const defaultAvatar =
  "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
const defaultTags = [
  { id: 1, text: "dairy-free", active: false },
  { id: 2, text: "egg-free", active: false },
  { id: 3, text: "gluten-free", active: false },
  { id: 4, text: "keto", active: false },
  { id: 5, text: "nut-free", active: false },
  { id: 6, text: "vegan", active: false },
  { id: 7, text: "vegetarian", active: false },
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
