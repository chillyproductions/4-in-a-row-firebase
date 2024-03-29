var board = [];
var rows;
var colms;
var win_sum;

function display_board() {
    var count = 0; 
    document.getElementById("print_id").innerHTML = ("Room id: " + sessionStorage.getItem("id"));

    const db = firebase.firestore();
    const game_dt = db.collection("games").doc(sessionStorage.getItem("id"));
    game_dt.get().then((doc) =>{
        rows = doc.data().size[0];
        colms = doc.data().size[1];
        win_sum = doc.data().win_sum;

        var s = "<table border='1' class='table'>";
        for (let irow = 0; irow < rows; irow++) {
            s += "<tr>";
            board[irow] = [];
            for (let icolm = 0; icolm < colms; icolm++) {
                s += "<td id = '" + count.toString() + "'; onclick='try_move(this.id)'; width='50' height='50'> </td>";
                board[irow][icolm] = 0;
                count++;
            }
            s += "</tr>";
        }
        s += "</table>";
        document.getElementById("board").innerHTML = s;
    });
}

function move(id_string, turn) {
    id = parseInt(id_string);
    let colm = id % colms

    for (var irow = 0; irow < rows; irow++)
        if (board[irow][colm] != 0)
            break;

    board[irow-1][colm] = turn % 2 + 1;
    const db = firebase.firestore();
    const user_dt = db.collection("games").doc(sessionStorage.getItem("id"));
    user_dt.update({
        lastmove: [irow, colm , turn],
        turn: turn +1
    });

    draw(irow,colm,turn);
    
    win_check(irow - 1, colm, turn);
}

function win_check(row, colm, turn) {
    const db = firebase.firestore();
    const game_dt = db.collection("games").doc(sessionStorage.getItem("id"));
    //vertical
    var sum = 0;
    //down
    for (let irow = row; irow >= 0; irow--) {
        if (board[irow][colm] == turn % 2 + 1)
            sum++;
        else
            break;
    }

    //up
    for (let irow = row; irow < rows; irow++) {
        if (board[irow][colm] == turn % 2 + 1)
            sum++;
        else
            break;
    }
    sum--;

    if (sum >= win_sum){
        game_dt.update({win: true});
        return
    }

    //horizontal
    sum = 0;
    //right
    for (let icolm = colm; icolm < colms; icolm++) {
        if (board[row][icolm] == turn % 2 + 1)
            sum++;
        else
            break;
    }

    //left
    for (let icolm = colm; icolm >= 0; icolm--) {
        if (board[row][icolm] == turn % 2 + 1)
            sum++;
        else
            break;
    }
    sum--;

    if (sum >= win_sum){
        game_dt.update({win: true});
        return
    }
    // diagonal down
    sum = 0;
    //up left
    var irow = row;
    var icolm = colm;
    while (irow >= 0 && icolm >= 0) {
        if (board[irow][icolm] == turn % 2 + 1)
            sum++;
        else
            break;
        irow--;
        icolm--;
    }

    //down right
    var irow = row;
    var icolm = colm;
    while (irow < rows && icolm < colms) {
        if (board[irow][icolm] == turn % 2 + 1)
            sum++;
        else
            break;
        irow++;
        icolm++;
    }
    sum--;

    if (sum >= win_sum){
        game_dt.update({win: true});
        return
    }
    // diagonal up
    sum = 0;
    //down left
    var irow = row;
    var icolm = colm;
    while (irow < rows && icolm >= 0) {
        if (board[irow][icolm] == turn % 2 + 1)
            sum++;
        else
            break;
        irow++;
        icolm--;
    }

    //up right
    var irow = row;
    var icolm = colm;
    while (irow >= 0 && icolm < colms) {
        if (board[irow][icolm] == turn % 2 + 1)
            sum++;
        else
            break;
        irow--;
        icolm++;
    }
    sum--;

    if (sum >= win_sum){
        game_dt.update({win: true});
        return
    }
}

function try_move(id){
    const db = firebase.firestore();
    const user_dt = db.collection("games").doc(sessionStorage.getItem("id"));
    user_dt.get().then((doc) =>{
        if(doc.data().started == true){
            if(doc.data().turn % 2 == 0 && sessionStorage.getItem("first") == "true"){
                move(id, doc.data().turn);
            }
            else if(doc.data().turn % 2 == 1 && sessionStorage.getItem("first") == "false"){
                move(id, doc.data().turn);
            }
            else{
                alert("its not ur turn");
            }
        }
        else
            alert("awaiting second player");
    });
}

function draw(irow, colm, turn){
    if (turn % 2 == 0) {
        // document.getElementById(((irow - 1) * colms + colm).toString()).style.backgroundColor = 'green'
        console.log(document.getElementById(((irow - 1) * colms + colm).toString()).innerHTML);
        document.getElementById(((irow - 1) * colms + colm).toString()).innerHTML = '<div class="piece" style="background-color: green;"></div>';
    }
    
    else {
        // document.getElementById(((irow - 1) * colms + colm).toString()).style.backgroundColor = 'blue'
        document.getElementById(((irow - 1) * colms + colm).toString()).innerHTML = '<div class="piece" style="background-color: blue;"></div>';
    }
}

function submit_chat(){
    const db = firebase.firestore();
    const game_dt = db.collection("games").doc(sessionStorage.getItem("id"));
    var chat_text = document.getElementById("chat_text").value;
    game_dt.get().then((doc) =>{
        game_dt.update({chat: doc.data().chat + firebase.auth().currentUser.displayName +": " + chat_text +"<br>"});
    });
    document.getElementById("chat_text").value = '';
}

function win(){
    const db = firebase.firestore();
    const game_dt = db.collection("games").doc(sessionStorage.getItem("id"));
    const user_dt = db.collection("users").doc(firebase.auth().currentUser.uid);
    game_dt.get().then((game_doc) =>{
        user_dt.get().then(async (user_doc) =>{        

            if((game_doc.data().turn -1) % 2 == 0 && sessionStorage.getItem("first") == "true"){
                user_dt.update({wins: user_doc.data().wins + 1});
                await game_dt.update({first_wins: game_doc.data().first_wins +1});
                alert(firebase.auth().currentUser.displayName + " wins");
            }
            else if((game_doc.data().turn -1) % 2 == 1 && sessionStorage.getItem("first") == "false"){
                user_dt.update({wins: user_doc.data().wins + 1});
                await game_dt.update({second_wins: game_doc.data().second_wins +1});
                alert(firebase.auth().currentUser.displayName + " wins");
            }
            else{
                user_dt.update({losses: user_doc.data().losses + 1});
                if(firebase.auth().currentUser.displayName == game_doc.data().players[0])
                    alert(game_doc.data().players[1] + " wins");
                else
                    alert(game_doc.data().players[0] + " wins");
            }
            update_scores();
        })
    })
    document.getElementById("again").hidden = false;
}

function update_scores(){
    const db = firebase.firestore();
    const game_dt = db.collection("games").doc(sessionStorage.getItem("id"));
    game_dt.get().then((game_doc) =>{
        if(game_doc.data().players.length != 2){
            document.getElementById("player1").innerHTML = "awating second player";
        }
        else{
            document.getElementById("player1").innerHTML = game_doc.data().players[0] + ": " + game_doc.data().first_wins;
            document.getElementById("player2").innerHTML = game_doc.data().players[1] + ": " + game_doc.data().second_wins;     
        }
    });
}

function start_listening(){
    const db = firebase.firestore();
    const game_dt = db.collection("games").doc(sessionStorage.getItem("id"));
    game_dt.onSnapshot((doc) =>{
        if("again" in doc.data()){
            if(doc.data().again == true){
                game_dt.update({again: false})
                display_board();
                document.getElementById("again").hidden = true;
            }
        }
        if("win" in doc.data()){
            if(doc.data().win == true){
                game_dt.update({win: false});
                win();
            }
        }
        if("lastmove" in doc.data()){
            board[doc.data().lastmove[0] -1][doc.data().lastmove[1]] = doc.data().lastmove[2] % 2 +1;
            draw(doc.data().lastmove[0], doc.data().lastmove[1], doc.data().lastmove[2]);
        }
        if("chat" in doc.data()){
            update_scores();
            document.getElementById("chat").innerHTML = doc.data().chat;
        }
    })
}

function create_game(){
    display_board();
    start_listening();
    update_scores();
}

function again(){
    const db = firebase.firestore();
    const game_dt = db.collection("games").doc(sessionStorage.getItem("id"));
    game_dt.update({again: true});
    game_dt.get().then((game_doc) =>{
        game_dt.update({chat: game_dt.data().chat + firebase.auth().currentUser.displayName +" started another game<br>"})
    });
}

addEventListener('load', ()=>{
    create_game();

    const db = firebase.firestore();
    const game_dt = db.collection("games").doc(sessionStorage.getItem("id"));
    game_dt.get().then((doc) =>{
        game_dt.update({chat: doc.data().chat + firebase.auth().currentUser.displayName + " joined! <br>"});
    });
});