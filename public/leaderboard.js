addEventListener('load', () =>{
    const db = firebase.firestore();
    const users = db.collection("users").orderBy("wins", "desc").limit(10);
    var s="";
    users.get().then((docs)=>{
        docs.docs.forEach(doc => {
            console.log(doc.data());
        });
    })

})