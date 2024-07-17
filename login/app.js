import{
    auth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    db,
    getFirestore,
    collection,
    addDoc,
    getDocs,
    storage,
    getStorage, 
    ref,
    uploadBytes,
    getDownloadURL,
} from "../utils/utlils.js";

const logEmail =document.getElementById('logEmail');
const logPass =document.getElementById('logPass');
const logbtn =document.getElementById('logbtn');
const signName =document.getElementById('signName');
const userProfile =document.getElementById('userProfile');
const signEmail =document.getElementById('signEmail');
const signPass =document.getElementById('signPass');
const signupbtn =document.getElementById('signupbtn');
const logoutbtn =document.getElementById('logoutbtn');

onAuthStateChanged(auth, (user) => {
    if (user) {
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      console.log("User is signed In");
      // ...
    } else {
      // User is signed out
      console.log("User is signed out");
      // ...
    }
  });

  
  signupbtn.addEventListener('click', () => {
    const email = signEmail.value;
    const password = signPass.value;
    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            const profileImageRef = ref(storage, `profiles/${user.uid}/${userProfile.files[0].name}`);
            await uploadBytes(profileImageRef, userProfile.files[0]);
            const profileImageUrl = await getDownloadURL(profileImageRef);

            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: signName.value,
                email: signEmail.value,
                profileImageUrl: profileImageUrl,
            });

            console.log("User successfully created");
            alert("User successfully created");
        })
        .catch((error) => {
            console.error(error.code, error.message);
        });
});

logbtn.addEventListener('click', () => {
    signInWithEmailAndPassword(auth, logEmail.value, logPass.value)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User signed in", user);
            window.location.href = "../index.html";
        })
        .catch((error) => {
            console.error(error.code, error.message);
        });
});

// const image = () =>{
//     console.log(userProfile.files[0]);
    
//     const profileImageRef = ref(storage , userProfile.files[0].name);
//     console.log(profileImageRef);
//     console.log(userProfile.files[0].name);

//     signupbtn.disabled = true;
//     uploadBytes(profileImageRef, userProfile.files[0]).then((snapshot) => {
//         console.log('Uploaded a blob or file!');

//         getDownloadURL(profileImageRef)
//         .then((url) => {
//             console.log("url ==>",url)

//     const userInfo = collection(db, "users");
//             addDoc(userInfo, {
//                 Name: signName.value,
//                 Email: signEmail.value,
//                 Password: signPass.value,
//                 profile: url,
//             }).then(()=>{
//                 console.log("Document updated to the DB");
//                 signupbtn.disabled = false;
//             })
//         })
//         .catch((error) => console.log("Error in download ==>",error));
//       })
//     .catch((e) => {
//         console.log(e)
//     });
   
// }


