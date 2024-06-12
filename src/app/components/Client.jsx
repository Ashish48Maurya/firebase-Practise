'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { initializeApp } from "firebase/app";
import { useRouter } from 'next/navigation';
import styles from '../Navbar.module.css'
import Link from 'next/link';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth'
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, query, where, updateDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export const AuthContext = createContext();

const firebaseConfig = {
    apiKey: "AIzaSyD_rIJNmpmoSZbHo1xUa-WCld_dkkz8tPQ",
    authDomain: "glowing-harmony-411318.firebaseapp.com",
    databaseURL: "https://glowing-harmony-411318-default-rtdb.firebaseio.com",
    projectId: "glowing-harmony-411318",
    storageBucket: "glowing-harmony-411318.appspot.com",
    messagingSenderId: "125127943597",
    appId: "1:125127943597:web:0a2f9ca6da7e9623376d24",
    measurementId: "G-N9483XGEEG"
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp)
const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (user) => {
            if (user) {
                console.log(user);
                setUser(user)
                localStorage.setItem('userId', user.uid);
            }
            else {
                setUser(null)
            }
        })
    }, [])

    const isLoggedIn = !!user;

    const logOut = async () => {
        try {
            await signOut(firebaseAuth);
            setUser(null);
            toast.success("Logged out successfully");
            router.push('/login');
        } catch (error) {
            toast.error(error.message);
        }
    };

    // const signIn = async (email, password) => {
    //     try {
    //         await createUserWithEmailAndPassword(firebaseAuth, email, password);
    //         toast.success("Registration Successfull")
    //         router.push('/login')
    //     } catch (error) {
    //         toast.error( error);
    //     }
    // }

    // const logIn = async (email, password) => {
    //     try {
    //         const res = await signInWithEmailAndPassword(firebaseAuth, email, password);
    //         toast.success("Login Done")
    //         setUser(res.user);
    //         console.log(res.user);
    //         router.push('/post')
    //     } catch (error) {
    //         toast.error(error);
    //     }
    // }

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(firebaseAuth, googleProvider);
            toast.success("Login Done")
            router.push('/')
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handlePost = async (title, desc, image) => {
        if (!title || !desc || !image) {
            toast.error("All Fields Are Req");
        }
        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const formattedTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' });

        try {
            const imageRef = await ref(storage, `uploads/images/${Date.now()}-${image.name}`)
            const uploadResult = await uploadBytes(imageRef, image)
            const res = await addDoc(collection(firestore, "post"), {
                title,
                desc,
                image: uploadResult.metadata.fullPath,
                timestamp: `${formattedDate} ${formattedTime}`,
                userId: user.uid,
                userName: user.displayName,
                userMail: user.email
            })
            return res;
        }
        catch (err) {
            toast.error(err.message);
        }
    }

    const updatePost = async (postId, title, desc, image) => {
        if (!title || !desc) {
            toast.error("Title and Description are required");
            return;
        }

        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const formattedTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' });

        try {
            let imageUrl = null;

            if (image) {
                const imageRef = ref(storage, `uploads/images/${Date.now()}-${image.name}`);
                const uploadResult = await uploadBytes(imageRef, image);
                imageUrl = await getDownloadURL(uploadResult.ref);
            }

            const updateData = {
                title,
                desc,
                timestamp: `${formattedDate} ${formattedTime}`
            };

            if (imageUrl) {
                updateData.image = imageUrl;
            }
            const docRef = doc(firestore, "post", postId);
            await updateDoc(docRef, updateData);
            toast.success("Post updated successfully");
        } catch (err) {
            toast.error(err.message);
        }
    };


    const getImageURL = (path) => {
        return getDownloadURL(ref(storage, path));
    }

    const fetchPosts = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, "post"));
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            toast.error(error);
        }
    };

    const getPost = async (id) => {
        const docRef = doc(firestore, "post", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error("No such document!");
        }
    };

    const myPosts = async () => {
        try {
            const ls = localStorage.getItem('userId');
            const collectionRef = collection(firestore, "post");
            const q = query(collectionRef, where("userId", "==", ls));
            const res = await getDocs(q);
            const posts = res.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return posts;
        } catch (error) {
            console.error("Error fetching posts: ", error);
            throw new Error("Failed to fetch posts");
        }
    };

    const Postmessage = async (message, postId) => {
        if (!message) {
            toast.error("Message is req");
        }
        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const formattedTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' });

        try {
            const res = await addDoc(collection(firestore, "msg"), {
                message,
                timestamp: `${formattedDate} ${formattedTime}`,
                postId,
                userName: user.displayName,
                userMail: user.email
            })
            return res;
        }
        catch (err) {
            toast.error(err.message);
        }
    }

    const getPostMsg = async (postId) => {
        try {
            const collectionRef = collection(firestore, "msg");
            const q = query(collectionRef, where("postId", "==", postId));
            const res = await getDocs(q);
            const msgs = res.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return msgs;
        } catch (error) {
            toast.error(error);
            throw new Error("Failed to fetch posts");
        }
    }

    return (
        // <AuthContext.Provider value={{ logIn, signIn, signInWithGoogle, isLoggedIn }}>
        <AuthContext.Provider value={{ getPostMsg, signInWithGoogle, user, isLoggedIn, logOut, handlePost, fetchPosts, getImageURL, getPost, myPosts, Postmessage, updatePost }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const authContextValue = useContext(AuthContext);
    if (!authContextValue) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return authContextValue;
};

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isLoggedIn, logOut } = useAuth();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/">
                    <div className={styles.brand}>Blogify</div>
                </Link>
                <div className={`${styles.menu} ${isOpen ? styles.open : ''}`} onClick={toggleMenu}>
                    <span className={styles.bar}></span>
                    <span className={styles.bar}></span>
                    <span className={styles.bar}></span>
                </div>
                <ul className={`${styles.navLinks} ${isOpen ? styles.show : ''}`} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <li className={styles.navItem}>
                        <Link href="/">
                            <div className={styles.navLink}>Home</div>
                        </Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link href="/post">
                            <div className={styles.navLink}>CreatePost</div>
                        </Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link href="/posts">
                            <div className={styles.navLink}>SeePosts</div>
                        </Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link href="/posts/myPosts">
                            <div className={styles.navLink}>MyPosts</div>
                        </Link>
                    </li>
                    <li className={styles.navItem}>
                        {isLoggedIn ?
                            <button className={styles.navLink} style={{ width: '100%', padding: "10px", backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={logOut}>Logout</button>
                            : <Link href="/login">
                                <div className={styles.navLink}>Login</div>
                            </Link>
                        }
                    </li>
                </ul>
            </div>
        </nav>
    );
}


const Posts = ({ id, title, desc, image, timestamp, userName }) => {
    const [url, setUrl] = useState(null);
    const { getImageURL } = useAuth();

    const truncateText = (text, wordLimit) => {
        const words = text?.split(" ");
        if (words?.length > wordLimit) {
            return words?.slice(0, wordLimit).join(" ") + "...";
        }
        return text;
    };

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const imageUrl = await getImageURL(image);
                setUrl(imageUrl);
            } catch (error) {
                toast.error(error.message);
            }
        };
        fetchImage();
    }, []);

    return (
        <div style={{ maxWidth: '300px', margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <img src={url} alt={title} style={{ width: '100%', marginBottom: '10px', borderRadius: '5px' }} />
            <div style={{ display: "flex", justifyContent: "space-between", margin: "5px" }}>
                <h4>Created At: {timestamp}</h4>
                <h4>Created By: {userName}</h4>
            </div>
            <h3 style={{ marginBottom: '10px', fontSize: '1.5rem' }}>{truncateText(title, 10)}</h3>
            <p style={{ marginBottom: '10px' }}>{truncateText(desc, 30)}</p>
            <Link href={`/post/${id}`}>
                <button style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Read More</button>
            </Link>
        </div>
    );
};


export const PostData = () => {
    const { fetchPosts } = useAuth();
    const [postsData, setPostsData] = useState([]);

    useEffect(() => {
        const fetchPostsData = async () => {
            try {
                const posts = await fetchPosts();
                setPostsData(posts);
            } catch (error) {
                toast.error(error);
            }
        };
        fetchPostsData();
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                {postsData.map(post => (
                    <Posts key={post.id} {...post} />
                ))}
            </div>
        </div>
    );
};


export const MyPostData = () => {
    const { myPosts } = useAuth();
    const [postsData, setPostsData] = useState([]);
    useEffect(async () => {
        const res = await myPosts();
        setPostsData(res);
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                {postsData.map(post => (
                    <Posts key={post.id} {...post} />
                ))}
            </div>
        </div>
    );
};

export const HomePage = () => {
    const { user, isLoggedIn } = useAuth();
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "90vh" }}>
            <h2 style={{ margin: "10px", color: "orangered" }}>Welcome</h2>
            {isLoggedIn ? <h1 style={{ color: "yellow" }}>{user.displayName}</h1> : <h1 style={{ color: "yellow" }}>User</h1>}
        </div>
    );
}