/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/prop-types */
import { useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { postsApi } from '../../../../api';
import { savePostAsync, selectUserSession } from '../../../../actions';
import { Input } from '../../../../components';
import { Icon } from '../../../../components/header/components';
import { PROP_TYPE } from '../../../../constant';
import { SpecialPanel } from '../special-panel/special-panel';
import { sanitizeContent } from './utils/sanitize-content';

export const PostForm = ({ post: { id, title, imageUrl, content, publishedAt } }) => {
  const [newImageUrl, setNewImageUrl] = useState(imageUrl);
  const [newTitle, setNewTitle] = useState(title);
  const [serverError, setServerError] = useState('');
  const contentRef = useRef('');
  const dispatch = useDispatch();
  const session = useSelector(selectUserSession);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    setNewImageUrl(imageUrl);
    setNewTitle(title);
  }, [imageUrl, title]);

  const onSave = () => {
    const newContent = sanitizeContent(contentRef.current.innerHTML);
    const savePost = postData => postsApi.savePost(session, postData);

    setServerError('');
    dispatch(
      savePostAsync(savePost, {
        id,
        imageUrl: newImageUrl,
        title: newTitle,
        content: newContent,
      })
    ).then(savedPost => {
      if (!savedPost) {
        setServerError('Не удалось сохранить пост');

        return;
      }

      navigate('/post/' + savedPost.id);
    });
  };

  const onImageUrlChange = ({ target }) => setNewImageUrl(target.value);
  const onTitleChange = ({ target }) => setNewTitle(target.value);

  return (
    <PostFormContainer>
      <Input value={newImageUrl} onChange={onImageUrlChange} type="text" placeholder={'Ссылка на фото...'} />
      <Input value={newTitle} onChange={onTitleChange} type="text" placeholder={'Загаловок...'} />
      <SpecialPanel
        margin="20px 0 20px"
        {...{ publishedAt, id }}
        editButton={<Icon id="fa-floppy-o" margin="0 10px 0 0" onClick={onSave} />}
      />
      <div ref={contentRef} className={'post-text'} contentEditable={true} suppressContentEditableWarning={true}>
        {content}
      </div>
      {serverError && <div className="server-error">{serverError}</div>}
    </PostFormContainer>
  );
};

const PostFormContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',

  '& .post-text': {
    whiteSpace: 'pre-line',
    border: '1px solid black',
    minHeight: '80px',
  },
  '& .server-error': {
    color: '#b00020',
    fontSize: '14px',
  },
});

PostForm.propTypes = {
  post: PROP_TYPE.POST.isRequired,
};
