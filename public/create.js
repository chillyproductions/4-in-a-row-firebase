var user_name;
var id;

addEventListener("load", ()=>{
    document.getElementById("width").value = 5;
    document.getElementById("height").value = 7;
    document.getElementById("win_num").value = 4;
    document.getElementById("page").hidden = false;
});

function submit(){
    const row = document.getElementById("height").value;
    const colm = document.getElementById("width").value 
    const win_num = document.getElementById("win_num").value;
    user_name = document.getElementById("name").value;
    if(user_name != ""){
        id = Date.now().toString();

        const db = firebase.firestore();
        const user_dt = db.collection("games").doc(id);
        user_dt.set({
            board : create_board(row,colm),
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

function create_board(rows,colms){
    var table = {};

    for(let row = 0; row < rows; row++){
        Object.assign(table, {[row] : []});
        for(let colm = 0; colm < colms; colm++){
            table[row][colm] = 0;
        }
    }
    return table
}