import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { logOut, setUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import useTypedSelector from "../hooks/useTypedSelector";
import { MouseEvent, useEffect, useState } from "react";
import './projectRevision.css'
import FloatingForm from "../components/FloatingForm";
import { Coordinates } from "../types";
import FloatingComment from "../components/FloatingComment";
import { Dropdown, MenuButton, IconButton, Menu, MenuItem } from "@mui/joy";
import { Points } from "../components/Icons";
import Comments from "../components/Comments";


const ProjectRevision = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useTypedSelector((state) => state.user.user);

  const [isDesignClickeable, setIsDesignClickeable] = useState(false);
  const { comments, loading } = useTypedSelector((state) => state.comments);

  const [floatingForm, setFloatingForm] = useState<Coordinates | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.displayName && user.photoURL) {
        dispatch(setUser({ name: user.displayName, picture: user.photoURL, id: user.uid }));
      } else {
        dispatch(logOut());
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, []);


  const logout = async () => {
    try {
      await signOut(auth);
      dispatch(logOut());
      navigate('/');

    } catch (error) {
      console.log(error);
    }
  }

  const handleClick = (e: MouseEvent<HTMLImageElement>) => {

    if (isDesignClickeable) {
      const target = e.target as HTMLImageElement;
      const rect = target.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setFloatingForm({ x, y });
      setIsDesignClickeable(false);
    }
  };

  const closeForm = () => {
    setFloatingForm(null);
  };

  return (

    <main className="main">
      <section className="design-section">

        <section >
          <Dropdown>
            <MenuButton
              slots={{ root: IconButton }}
              slotProps={{ root: { variant: 'plain', color: 'neutral' } }}
            >
              <img style={{ width: '2rem', borderRadius: '50%', marginRight: '5px' }} src={currentUser?.picture} alt={currentUser?.name} />
              <Points />
            </MenuButton>
            <Menu>
              <MenuItem onClick={logout}>Cerrar sesión</MenuItem>
            </Menu>
          </Dropdown>
        </section>


        <section >
          <h1>Revisión</h1>
          <div>
            <div className={loading ? "design-container design-container--loading" : "design-container"}>
              <img
                className={isDesignClickeable ? 'design design--clickeable' : 'design'}
                src="/advertisement2.jpg" alt=""
                onClick={handleClick}
                style={{ width: '100%', height: 'auto' }}
              />
              {floatingForm && <FloatingForm
                coordinates={{ x: floatingForm.x, y: floatingForm.y }}
                closeForm={closeForm}
              />}

              {comments && comments.map(comment => <FloatingComment key={comment.id} {...comment} />)}
            </div>
          </div>
        </section>

        <section className="controls-section" onClick={() => setIsDesignClickeable(true)}>
          <button className="button-purple">Agregar comentario</button>
        </section>

      </section>
      <Comments />
    </main>

  );
}

export default ProjectRevision;
