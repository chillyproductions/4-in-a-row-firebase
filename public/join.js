addEventListener('load', () =>{
    document.getElementById("lobby").hidden = false;
});

function join(){
    var game_id = document.getElementById("game_id").value.toString();
    const db = firebase.firestore();
    db.collection("games").get().then((stuff) =>{
        if(stuff.docs.map(doc => doc.id).includes(game_id)){
            sessionStorage.setItem("id", game_id);
            sessionStorage.setItem("first", "false");
            window.location.href = "board.html";
        }
        else
            alert("game id doesnt excist");   
    });
}