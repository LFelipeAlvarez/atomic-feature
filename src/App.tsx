import { browserSessionPersistence, onAuthStateChanged, setPersistence, signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "./config/firebase";
import { useNavigate } from "react-router-dom";
import { logOut, setUser } from "./redux/userSlice";
import { useDispatch } from "react-redux";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect } from "react";

function App() {

  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.displayName && user.photoURL) {
        dispatch(setUser({ name: user.displayName, picture: user.photoURL, id: user.uid }));
        navigate('/project-revision');
      } else {
        dispatch(logOut());
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      await setPersistence(auth, browserSessionPersistence);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (user) {
        const { displayName: name, photoURL: picture, uid } = user;

        // Guardar o actualizar el usuario en Firestore
        const userRef = doc(db, "users", uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          await setDoc(userRef, {
            uid,
            name,
            picture,
            createdAt: new Date(),
          });
        } else {
          await setDoc(userRef, {
            name,
            picture,
            lastLogin: new Date(),
          }, { merge: true });
        }


        if (name && picture) dispatch(setUser({ name, picture, id: uid }));
        navigate('/project-revision');
      }

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main style={{ textAlign: 'center' }}>
      <h1 style={{ paddingTop: '4rem', marginBottom: '2rem' }}>Inicia sesión para continuar 😁</h1>
      <button className="button-purple" onClick={signIn}>Con Google</button>
    </main>
  )
}

export default App
