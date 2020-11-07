addEventListener('load', () =>{
    const db = firebase.firestore();
    const users = db.collection("users").orderBy("wins", "desc").limit(10);
    var s="";
    users.forEach(user =>{
        user.get().then((doc) =>{
            console.log(doc.data().name)
        })
    })

})