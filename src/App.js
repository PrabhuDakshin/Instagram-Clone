import React, {useState, useEffect} from 'react';
import './App.css';
import Post from './Post';
import {db, auth} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import Uploader from './Uploader';
import InstagramEmbed from 'react-instagram-embed';


//Model styles

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 300,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));



function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);


  const signUp = (event) => {
      event.preventDefault();
      auth
        .createUserWithEmailAndPassword(email, password)
        .then(authUser => {
          authUser.user.updateProfile({
            displayName: username
          })
        })
        .catch(error => alert(error.message));
      setOpen(false);
  }

  const signIn = (event) => {
    event
    .preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch(error => alert(error.message));
    setOpenSignIn(false);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged( authUser => {
      if(authUser) {
        //user has logged in
        setUser(authUser);
      }
      else {
        //user has logged out
        setUser(null);
      }
    })

    return () => {
      //clean up
      unsubscribe();
    }

  }, [user, username])

  useEffect(() => { //executes every time when page is reloaded
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {  //whenever db is updated it gets a snapshot of the data
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      }) ));
    }) 
    
  },[]);


  return (


    <div className="App">
       
      {/* Sign-up modal */}
    
        <Modal
        open={open}
        onClose={() => setOpen(false)} //clicks outside the pop-up
        >
        <div style={modalStyle} className={classes.paper}>
            <form className="app_signup">
              <center>
                <img 
                  alt="Instagram" 
                  className="app_headerImg" 
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" /> 
              </center> 
                <Input 
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <Input 
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input 
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" onClick={(e) => signUp(e)} >Sign Up</Button>
            </form>
        </div>
        </Modal>

        {/* Login modal */}

        <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)} //clicks outside the pop-up
        >
        <div style={modalStyle} className={classes.paper}>
            <form className="app_signup">
              <center>
                <img 
                  alt="Instagram" 
                  className="app_headerImg" 
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" /> 
              </center> 
               
                <Input 
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input 
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" onClick={(e) => signIn(e)} >Sign In</Button>
            </form>
        </div>
        </Modal> 


      <div className="app_header" >
        <img 
        alt="Instagram" 
        className="app_headerImg" 
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" /> 
      
        {user ? (
          <Button onClick={() => auth.signOut()}>logout</Button>
        ): (
          <div className="app_loginContainer">
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        ) 
        }
      
      </div>

      <div className="app_post">
        <div className="app_postLeft">
              {
              posts.map(({id, post}) => (
                <Post 
                key={id}
                postId={id}
                user={user}
                username={post.username}
                caption={post.caption}
                imgurl={post.imgUrl}
                  />
              ) )
            }
        </div>

        <div className="app_postRight">
          <InstagramEmbed
            url='https://www.instagram.com/p/B8AhXEzgX5L/?igshid=1dmt6c7fw88pi'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      
      </div>
      
      

      {user?.displayName ? (
      <Uploader username={user.displayName} />
      ): (
        <h3>Sorry You've to Login!</h3>
      )}

      

    </div>
  );
}

export default App;
