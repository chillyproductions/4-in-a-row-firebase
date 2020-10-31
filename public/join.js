addEventListener('load', () =>{
    document.getElementById("lobby").hidden = false;
});

function join(){
    var game_id = document.getElementById("game_id").value.toString();
    const db = firebase.firestore();
    db.collection("games").get().then((stuff) =>{
        if(stuff.docs.map(doc => doc.id).includes(game_id)){
            const game_dt = db.collection("games").doc(game_id);
            game_dt.get().then((game_doc) =>{
                if(game_doc.data().started == false){
                
                    sessionStorage.setItem("id", game_id);
                    sessionStorage.setItem("first", "false");
                    
                    var add_player = game_doc.data().players;
                    add_player[1] = firebase.auth().currentUser.displayName;
                    game_dt.update({players: add_player, started: true}).then(() =>{
                        window.location.href = "board.html";
                    });
                }
                else{
                    alert("game is full");
                }
            })
        }
        else
            alert("game id doesnt excist");   
    });
}