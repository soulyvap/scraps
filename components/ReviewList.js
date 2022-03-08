import { FlatList, ScrollView, View } from "native-base";
import react, { useContext, useEffect, useState } from "react";
import {
  useComment,
  useMedia,
  useRating,
  useTag,
  useUser,
} from "../hooks/ApiHooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { avatarTag, uploadsUrl } from "../utils/variables";
import ReviewTile from "./ReviewTile";
import { MainContext } from "../contexts/MainContext";

const ReviewList = ({ userFileId, setReviewCount }) => {
  const { getCommentsById } = useComment();
  const { getRatingsByFileId } = useRating();
  const { getUserById } = useUser();
  const { getFilesByTag } = useTag();
  const { getMediaById } = useMedia();
  const { update } = useContext(MainContext);
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    const token = await AsyncStorage.getItem("userToken");
    try {
      const comments = await getCommentsById(userFileId);
      setReviewCount(comments.length);
      console.log(comments);
      if (comments.length > 0) {
        const ratings = await getRatingsByFileId(userFileId, token);

        const commentsAndRatings = await Promise.all(
          comments.map(async (comment) => {
            const commenterId = comment.user_id;
            const user = await getUserById(commenterId, token);
            const avatars = await getFilesByTag(avatarTag + commenterId);
            const avatarFileId = avatars.pop().file_id;
            const avatarFile = await getMediaById(avatarFileId);
            const avatarUri = uploadsUrl + avatarFile.thumbnails.w160;
            const username = user.username;
            const commentText = comment.comment;
            const rating = ratings.find(
              (rating) => rating.user_id === commenterId
            );
            const ratingNum = rating.rating;
            return {
              avatar: avatarUri,
              username: username,
              comment: commentText,
              rating: ratingNum,
            };
          })
        );
        console.log(commentsAndRatings);
        setReviews([...commentsAndRatings]);
      }
    } catch (error) {
      console.error("fetchReviews", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [update]);

  return (
    <ScrollView nestedScrollEnabled h={300}>
      {reviews.length > 0 &&
        reviews.map((review, index) => (
          <ReviewTile review={review} key={index} />
        ))}
    </ScrollView>
  );
};

export default ReviewList;
