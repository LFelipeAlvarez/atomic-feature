
import { useState } from 'react';
import './floatingForm.css'
import { Comment } from '../types';
import { Close } from './Icons';
import AudioPlayer from './AudioPlayer';
import ImageModal from './ImageModal';

const FloatingComment = ({ userName, userPicture, text, imageUrl, voiceMemo, coordinates }: Comment) => {
  const [isFloatingCommentClosed, setIsFloatingCommentClosed] = useState(true);
  const { x, y } = coordinates;

  if (isFloatingCommentClosed) return (
    <div
      className='floating-item floating-item--user'
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={() => setIsFloatingCommentClosed(false)}
    >
      <img src={userPicture} alt={userName} />
    </div>
  );

  return (
    <article
      className='floating-item floating-item--comment'
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <h3>
        {userName}
        <button onClick={() => setIsFloatingCommentClosed(true)}>
          <Close />
        </button>
      </h3>
      <div className='comment-body'>
        <img src={userPicture} alt={userName} />

        <div>
          {imageUrl &&
            <div className='image-mini-container'>
              <ImageModal>
                <img className='image-mini' src={imageUrl} alt="comment image" />
              </ImageModal>
            </div>}
          <p className='comment__text'>{text}</p>

          {voiceMemo && <AudioPlayer src={voiceMemo} />}
        </div>
      </div>
    </article>
  );

}

export default FloatingComment