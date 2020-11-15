addEventListener("load",()=>{
    const db = firebase.firestore();
    const games = db.collection("games").orderBy("first_wins", "desc").limit(10);

    var s = "ALL Games<br><table border='1' style='margin-left: auto; margin-right: auto;'>"
    s += "<tr><td>ID</td>"
    s += "<td>player1</td>"
    s += "<td>player2</td>"
    s += "<td>player1 wins</td>"
    s += "<td>player2 wins</td></tr>"
    games.get().then(docs => {
        docs.docs.forEach(doc => {
            s += "<tr><td>ID</td>"
            s += "<td>"+ doc.data().players[0] +"</td>"
            s += "<td>"+ doc.data().players[1] +"</td>"
            s += "<td>"+ doc.data().first_wins +"</td>"
            s += "<td>"+ doc.data().second_wins +"</td></tr>"
        });
    }).then(() =>{
        s += "</table>";
        document.getElementById("leaderboard").innerHTML = s;
    })

})