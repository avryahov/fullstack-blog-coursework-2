/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { commentsApi } from '../../../../../../api';
import { CLOSE_MODAL, openModal, removeCommentAsync, selectUserSession } from '../../../../../../actions';
import { Icon } from '../../../../../../components/header/components';
import { ROLE } from '../../../../../../constant';
import { selectUserRole } from '../../../../../../selectors';

export const Comment = ({ id, author, postId, content, publishedAt }) => {
  const dispatch = useDispatch();
  const session = useSelector(selectUserSession);
  const userRole = useSelector(selectUserRole);

  const onCommentDelete = commentId => {
    const removeComment = (selectedPostId, selectedCommentId) =>
      commentsApi.removePostComment(session, selectedPostId, selectedCommentId);

    dispatch(
      openModal({
        text: 'Удалить комментарий?',
        onConfirm: () => {
          dispatch(removeCommentAsync(removeComment, postId, commentId));
          dispatch(CLOSE_MODAL);
        },
        onCancel: () => dispatch(CLOSE_MODAL),
      })
    );
  };
  const isAdminOrModerator = [ROLE.ADMIN, ROLE.MODERATOR].includes(userRole);

  return (
    <CommentContainer>
      <div className="comment-container">
        <div className="information-panel">
          <div className="author">
            <Icon id="fa-user-circle-o" margin="0 10px 0 0" size="18px" inactive={true} />
            {author}
          </div>

          <div className="published-at">
            <Icon id="fa-calendar-o" margin="0 0 0 10px" size="18px" inactive={true} />
            {publishedAt}
          </div>
        </div>

        <div className="comment-text">{content}</div>
      </div>

      {isAdminOrModerator && (
        <div>
          <Icon id="fa-trash-o" margin="0 0 0 10px" size="18px" onClick={() => onCommentDelete(id)} />
        </div>
      )}
    </CommentContainer>
  );
};

const CommentContainer = styled.div({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  marginTop: '10px',

  '& .information-panel': {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    height: '1rem',
  },

  '& .published-at': {
    display: 'flex',
    gap: '10px',
  },

  '& .author': {
    display: 'flex',
  },

  '& .comment-container': {
    border: '1px solid black',
    width: '100%',
    padding: '5px 10px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '5px',
  },
});

Comment.propTypes = {
  id: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  postId: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  publishedAt: PropTypes.string.isRequired,
};
