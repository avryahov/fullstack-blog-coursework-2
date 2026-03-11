/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { postsApi } from '../../../../api';
import { CLOSE_MODAL, openModal, removePostAsync, selectUserSession } from '../../../../actions';
import { Icon } from '../../../../components/header/components';
import { ROLE } from '../../../../constant';
import { selectUserRole } from '../../../../selectors';
import { checkAccess } from '../../../../utils';

const SpecialPanelContainer = ({ className, id, publishedAt, editButton, ...props }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const roleId = useSelector(selectUserRole);
  const session = useSelector(selectUserSession);
  const isAdmin = checkAccess([ROLE.ADMIN], roleId);

  const onPostDelete = postId => {
    const removePost = selectedPostId => postsApi.removePost(session, selectedPostId);

    dispatch(
      openModal({
        text: 'Удалить статью?',
        onConfirm: async () => {
          const result = await dispatch(removePostAsync(removePost, postId));

          dispatch(CLOSE_MODAL);

          if (!result?.error) {
            navigate('/');
          }
        },
        onCancel: () => dispatch(CLOSE_MODAL),
      })
    );
  };

  return (
    <div className={className} {...props}>
      <div className="published-at">
        {publishedAt && <Icon id="fa-calendar-o" margin="0 10px 0 0" size="18px" inactive={true} />}
        {publishedAt}
      </div>
      {isAdmin && (
        <div className="buttons">
          {editButton}
          {publishedAt && <Icon id="fa-trash-o" margin="0 10px 0 0" onClick={() => onPostDelete(id)} />}
        </div>
      )}
    </div>
  );
};

export const SpecialPanel = styled(SpecialPanelContainer)`
  display: flex;
  justify-content: space-between;
  margin: ${({ margin = ' 0px' }) => margin};
  font-size: 18px;
  gap: 5px;

  & .buttons {
    display: flex;
  }

  & i {
    position: relative;
    top: -1px;
  }

  & img {
    float: left;
    margin: 0 20px 10px 0;
  }

  & .published-at {
    display: flex;
    flex-direction: row;
  }
`;

SpecialPanel.propTypes = {
  id: PropTypes.string,
  publishedAt: PropTypes.string.isRequired,
  editButton: PropTypes.node,
};
