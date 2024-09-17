import { Dropdown, MenuButton, IconButton, Menu, MenuItem, ListItemDecorator } from "@mui/joy";
import { collection, query, where, getDocs, doc, deleteDoc, orderBy } from "firebase/firestore";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { db } from "../config/firebase";
import { timeAgo } from "../helpers";
import useTypedSelector from "../hooks/useTypedSelector";
import { setLoading, setComments, deleteComment } from "../redux/commentsSlice";
import AudioPlayer from "./AudioPlayer";
import { Points, Delete } from "./Icons";
import ImageModal from "./ImageModal";
import { Comment } from "../types";
import './comments.css'

const commentsCollectionRef = collection(db, 'comments');
const usersCollectionRef = collection(db, 'users');

const deleteCommentService = async (commentId: string) => {
  try {
    const q = query(
      collection(db, 'comments'),
      where('id', '==', commentId)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      const commentDoc = doc(db, 'comments', docId);
      await deleteDoc(commentDoc);
    } else {
      console.error('No document found');
    }
  } catch (error) {
    console.error('Error removing document:', error);
  }
}

const Comments = () => {

  const dispatch = useDispatch();
  const { comments: allComments, loading } = useTypedSelector((state) => state.comments);
  const currentUser = useTypedSelector((state) => state.user.user);

  useEffect(() => {

    (async () => {
      try {
        dispatch(setLoading(true));
        const q = query(commentsCollectionRef, orderBy('createdAt', 'desc'));
        const commentsCollection = await getDocs(q);
        const comments: Comment[] = [];
        for (const commentsDoc of commentsCollection.docs) {

          const { userId } = commentsDoc.data();
          const usersCollection = (await getDocs(usersCollectionRef)).docs;
          const userDoc = usersCollection.find(user => user.id === userId);
          if (userDoc) {
            const { name, picture } = userDoc.data();
            comments.push({ ...commentsDoc.data() as Comment, userName: name, userPicture: picture });
          }
        }

        dispatch(setComments(comments));
        dispatch(setLoading(false));


      } catch (err) {
        console.error(err);
      }
    })();

  }, []);


  const handleDelete = async (commentId: string | undefined) => {
    if (commentId) {
      dispatch(deleteComment(commentId));
      await deleteCommentService(commentId);
    }
  }


  return (
    <section className="comments-section">
      <h2>Comentarios {loading && <div className="loader"></div>}</h2>
      {allComments && allComments.length === 0 && <h3>No hay comentarios por el momento</h3>}
      {allComments && allComments.map(comment =>
        <article className="comment" key={comment.id}>
          <h3 >
            <div className="user-info">
              <img src={comment.userPicture} alt={comment.userName} />
              {comment.userName}
            </div>
            <div className="">
              <time dateTime="">{timeAgo(comment.createdAt)}</time>
              {comment.userId === currentUser?.id && <Dropdown>
                <MenuButton
                  slots={{ root: IconButton }}
                  slotProps={{ root: { variant: 'plain', color: 'neutral' } }}

                >
                  <Points />
                </MenuButton>
                <Menu placement="bottom-end">
                  <MenuItem variant="soft" color="danger" onClick={() => handleDelete(comment.id)}>
                    <ListItemDecorator sx={{ color: 'inherit' }}>
                      <Delete />
                    </ListItemDecorator>{' '}
                    Delete
                  </MenuItem>
                </Menu>
              </Dropdown>}
            </div>
          </h3>
          {comment.voiceMemo && <AudioPlayer src={comment.voiceMemo} />}
          {comment.imageUrl &&
            <ImageModal>
              <img className="comment-image" src={comment.imageUrl} alt={comment.text} />
            </ImageModal>
          }
          <p>{comment.text}</p>

        </article>
      )

      }
    </section >
  )
}

export default Comments