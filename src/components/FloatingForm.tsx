/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeEvent, SyntheticEvent, useRef, useState } from "react";
import './floatingForm.css';
import './floatingComment.css';
import useTimer from "../hooks/useTimer";
import { formatTime, uploadFile } from "../helpers";
import { Comment, FloatingFormProps } from "../types";
import { useDispatch } from "react-redux";
import { addComment, setLoading } from "../redux/commentsSlice";
import { Image, Mic, Send, Close, Delete } from "./Icons";
import useTypedSelector from "../hooks/useTypedSelector";
import { db } from "../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';


const FloatingForm = ({ coordinates, closeForm }: FloatingFormProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [commentText, setCommentText] = useState('');
  const currenUser = useTypedSelector((state) => state.user.user);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const isSavingVoiceMemoRef = useRef(false);
  const { timer, restart } = useTimer(isRecording);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const commentsCollectionRef = collection(db, 'comments');


  const handleStartRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunks.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.current.push(event.data);
          }
        };

        //POdria hacer un custom hook, pasandole como parametro que hace en stop como callback (onStop) y retornando handleStartRecording y mediaRecorder 
        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
          if (isSavingVoiceMemoRef.current) {
            dispatch(setLoading(true));
            const voiceMemo = await uploadFile(audioBlob, 'comments/voice-memos/');
            const newComment: Comment = {
              id: uuidv4(),
              voiceMemo,
              coordinates,
              userPicture: currenUser?.picture as string,
              userName: currenUser?.name as string,
              userId: currenUser?.id as string,

              createdAt: Date.now()
            };
            const { userName, userPicture, ...rest } = newComment;
            await addDoc(commentsCollectionRef, rest);
            dispatch(addComment(newComment));
            dispatch(setLoading(false));

            closeForm();
          }

        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      })
      .catch(err => {
        console.error("Error accessing the microphone: ", err);
      });
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      restart();
    }
  }


  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    isSavingVoiceMemoRef.current = true;
    stopRecording();
    if (!isRecording) {
      if (!commentText.trim()) return;
      dispatch(setLoading(true));

      const newComment: Comment = {
        id: uuidv4(),
        text: commentText,
        coordinates,
        userPicture: currenUser?.picture as string,
        userName: currenUser?.name as string,
        userId: currenUser?.id as string,
        createdAt: Date.now(),
      };
      if (selectedImage) {
        const imageUrl = await uploadFile(selectedImage, 'comments/images/');
        if (imageUrl) newComment.imageUrl = imageUrl

      }
      const { userName, userPicture, ...rest } = newComment;
      await addDoc(commentsCollectionRef, rest);
      dispatch(addComment(newComment));
      closeForm();


    }
    dispatch(setLoading(false));

  }

  const cancelRecording = () => {
    isSavingVoiceMemoRef.current = false;
    stopRecording();
  }

  const resetInputFile = () => {
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.type = "text";
      fileInputRef.current.type = "file";
    }
  }

  const handleChangeInputFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setSelectedImage(null);
        return;
      }
      setSelectedImage(file);
    }
  }

  const { x, y } = coordinates;

  return (
    <form className={"form floating-item"} onSubmit={handleSubmit} style={{ left: `${x}%`, top: `${y}%` }}>

      <button type="button" className="button-icon close-form" onClick={closeForm}>
        <Close />
      </button>

      <textarea
        onChange={(e) => setCommentText(e.target.value)}
        name="commentText"
        id="commentText"
        placeholder={isRecording ? '' : "Podriamos cambiar el color de..."}
        maxLength={250}
        disabled={isRecording}
      ></textarea>

      <div className="form-bottom">
        <div className="form__image-text">
          <p>{selectedImage?.name}</p>
          {selectedImage && <button className="button-icon" onClick={resetInputFile}> {<Close />}</button>}
        </div>
        {<span className="form-icons">
          {
            isRecording ?
              <>
                <button className="button-icon" type="button" onClick={cancelRecording}>
                  <Delete />
                </button>
                <div className="timer">
                  <span className="mic-open"></span>
                  <span className="">{formatTime(timer)}</span>
                </div>
              </> :
              <>

                {
                  commentText === '' &&
                  selectedImage === null &&
                  <button className="button-icon" type="button" onClick={handleStartRecording}>
                    <Mic />
                  </button>
                }

                <button className="button-icon" type="button" onClick={() => fileInputRef.current?.click()}>
                  <Image />
                </button>
              </>
          }
          <button className="button-icon button-icon--send" type="submit"> <Send /> </button>
        </span>}
      </div>
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleChangeInputFile}
      />
    </form>
  );
};

export default FloatingForm;
