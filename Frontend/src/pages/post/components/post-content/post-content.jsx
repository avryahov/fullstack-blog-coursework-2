/* eslint-disable react/prop-types */
import styled from 'styled-components';
import { H2 } from '../../../../components';
import { PROP_TYPE } from '../../../../constant';
import { SpecialPanel } from '../special-panel/special-panel';

export const PostContent = ({ post: { id, title, imageUrl, content, publishedAt } }) => {
  return (
    <PostContentContainer>
      <img src={imageUrl} alt={title} width={400} height={300} />
      <H2>{title}</H2>
      <SpecialPanel margin="20px 0" {...{ publishedAt, id }} />

      <div className="post-text">{content}</div>
    </PostContentContainer>
  );
};

const PostContentContainer = styled.div({
  '& img': {
    float: 'left',
    margin: '0 20px 10px 0',
  },

  '& .post-text': {
    whiteSpace: 'pre-line',
  },
  '& h2': {
    display: 'flow-root',
    overflowWrap: 'break-word',
  },
});

PostContent.propTypes = {
  post: PROP_TYPE.POST.isRequired,
};
