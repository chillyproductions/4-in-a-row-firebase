addEventListener('load', () =>{
    firebase.auth().onAuthStateChanged(() => {
        if(firebase.auth().currentUser != null){
            const user_id = firebase.auth().currentUser.uid;
            const db = firebase.firestore();
            const user_dt = db.collection("users").doc(user_id);

            user_dt.get().then((user_doc)=>{
                if(!user_doc.exists){
                    user_dt.set({
                        name: firebase.auth().currentUser.displayName,
                        wins: 0,
                        losses: 0
                    }).then(() =>{
                        document.getElementById("hello").innerHTML = "Hello " + user_doc.data().name; 
                    });
                }
                else{
                    document.getElementById("hello").innerHTML = "Hello " + user_doc.data().name; 
                }
                
            }).then(()=>{
                document.getElementById("logged_in").hidden = false;
                document.getElementById("logged_out").hidden = true;
            })
        }
        else{
            document.getElementById("logged_in").hidden = true;
            document.getElementById("logged_out").hidden = false;
        }
    })
})

function login(){
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
}

function logout(){
    firebase.auth().signOut();
}

