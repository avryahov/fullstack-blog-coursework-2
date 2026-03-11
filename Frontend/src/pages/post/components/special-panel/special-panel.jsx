/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from '../../../../components/header/components';

const SpecialPanelContainer = ({ className, publishedAt, editButton, ...props }) => {
  return (
    <div className={className} {...props}>
      <div className="published-at">
        {publishedAt && <Icon id="fa-calendar-o" margin="0 10px 0 0" size="18px" inactive={true} />}
        {publishedAt}
      </div>
      {editButton && <div className="buttons">{editButton}</div>}
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
  publishedAt: PropTypes.string.isRequired,
  editButton: PropTypes.node,
};
