addEventListener('load', () =>{
    const db = firebase.firestore();
    const users = db.collection("users").orderBy("wins", "desc").limit(10);

    var s = "<br> Top Players: <br>"
    users.get().then(docs => {
        docs.docs.forEach(doc => {
            s += doc.data().name + ": " + doc.data().wins + "<br>";
            
        });
    }).then(() =>{
        document.getElementById("leaderboard").innerHTML = s;
    })
})