/** see https://redux-docs.netlify.com/basics/actions */

/** Action Types */
export const LIST_VIDEOS_BY_ACCOUNT = 'LIST_VIDEOS_BY_ACCOUNT';


/** Constants */

/** Action Creators */
export default function listVideosByAccountAction(videos) {
  return {
    type: LIST_VIDEOS_BY_ACCOUNT,
    videos
  };
};
