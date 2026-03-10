/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { logout, selectUserSession } from '../../../actions';
import { ROLE } from '../../../constant';
import { selectUserLogin, selectUserRole } from '../../../selectors';
import { checkAccess } from '../../../utils';
import { Button } from '../../button/button';
import { Icon } from '../../icon/icon';

const RightAligned = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '32px',
});

const UserName = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '18px',
  fontWeight: 'bold',
  marginRight: '5px',
});

const ControlPanelContainer = ({ className }) => {
  const navigate = useNavigate();
  const roleId = useSelector(selectUserRole);
  const login = useSelector(selectUserLogin);
  const session = useSelector(selectUserSession);
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logout(session));
  };

  const isAdmin = checkAccess([ROLE.ADMIN], roleId);

  return (
    <div className={className}>
      {roleId === ROLE.GUEST ? (
        <RightAligned>
          <Button>
            <Link to="/login">Войти</Link>
          </Button>
        </RightAligned>
      ) : (
        <RightAligned>
          <UserName>{login}</UserName>

          <Icon id="fa-sign-in" onClick={onLogout} />
        </RightAligned>
      )}

      <RightAligned>
        <Icon id="fa-backward" margin="12px 0 0 0" onClick={() => navigate(-1)} />

        {isAdmin && (
          <>
            <Icon id="fa-file-text-o" margin="10px 0 0 18px" onClick={() => navigate('/post')} />

            <Icon id="fa-users" margin="10px 5px 0 18px" onClick={() => navigate('/users')} />
          </>
        )}
      </RightAligned>
    </div>
  );
};

export const ControlPanel = styled(ControlPanelContainer)``;
