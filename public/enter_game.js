function show_create(){
    document.getElementById("create").hidden = false;
    document.getElementById("menu").hidden = true;
}

function show_join(){
    document.getElementById("join").hidden = false;
    document.getElementById("menu").hidden = true;
}

addEventListener("load", ()=>{
    firebase.auth().onAuthStateChanged(() =>{
        if(firebase.auth().currentUser != null){
            document.getElementById("width").value = 7;
            document.getElementById("height").value = 6;
            document.getElementById("win_num").value = 4;
        }
    });
});

function submit(){
    sessionStorage.setItem("first", "true");

    const row = parseInt(document.getElementById("height").value);
    const colm = parseInt(document.getElementById("width").value); 
    const win_num = parseInt(document.getElementById("win_num").value);
    id = (new Date().getMilliseconds() + new Date().getSeconds()*1000 + new Date().getMinutes() * 60 * 1000).toString();
    sessionStorage.setItem("id", id);
    
    const db = firebase.firestore();
    const user_dt = db.collection("games").doc(id);
    user_dt.set({
        size: [row,colm],
        win_sum: win_num,
        started: false,
        chat: "",
        turn: 0,
        first_wins: 0,
        second_wins: 0,
        players: [firebase.auth().currentUser.displayName]
    })
    .then(() =>{
        window.location.href = "board.html";
    });
}

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