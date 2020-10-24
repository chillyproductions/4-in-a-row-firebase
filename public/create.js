var user_name;
var id;
var first = true;

addEventListener("load", ()=>{
    document.getElementById("width").value = 7;
    document.getElementById("height").value = 5;
    document.getElementById("win_num").value = 4;
    document.getElementById("page").hidden = false;
});

function submit(){
    const row = parseInt(document.getElementById("height").value);
    const colm = parseInt(document.getElementById("width").value); 
    const win_num = parseInt(document.getElementById("win_num").value);
    user_name = document.getElementById("name").value;
    if(user_name != ""){
        id = Date.now().toString();

        const db = firebase.firestore();
        const user_dt = db.collection("games").doc(id);
        user_dt.set({
            size: [row,colm],
            win_sum: win_num,
            started: false,
            players: [user_name],
            turn: 0
        })
        .then(() =>{
            document.getElementById("lobby").hidden = true;
            document.getElementById("board").hidden = false;
            display_board();
        });
    }
    else{
        alert("Enter a name");        
    }
    
}