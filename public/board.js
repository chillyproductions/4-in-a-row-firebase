var board = [];
var rows;
var colms;
var turn;
var win_sum;

function display_board() {
    var count = 0; 
    console.log(game_id + "   " + user_name)

    const db = firebase.firestore();
    const user_dt = db.collection("games").doc(game_id);
    user_dt.get().then((user_doc) =>{
        rows = user_doc.data().size[0];
        colms = user_doc.data().size[1];
        turn = user_doc.data().turn;
        win_sum = user_doc.data().win_sum;

        var s = "<table border='1' class='table'>";
        for (let irow = 0; irow < rows; irow++) {
            s += "<tr>";
            board[irow] = [];
            for (let icolm = 0; icolm < colms; icolm++) {
                s += "<td id = '" + count.toString() + "'; onclick='move(this.id)'; width='50' height='50'> </td>";
                board[irow][icolm] = 0;
                count++;
            }
            s += "</tr>";
        }
        s += "</table>";
        document.getElementById("board").innerHTML = s;
    });
}

function move(id_string) {
    id = parseInt(id_string);
    let colm = id % colms
    var color;

    for (var irow = 0; irow < rows; irow++)
        if (board[irow][colm] != 0)
            break;

    board[irow-1][colm] = turn % 2 + 1;
    if (turn % 2 == 0) {
        document.getElementById(((irow - 1) * colms + colm).toString()).style.backgroundColor = 'green';
        color = "green";
    }
    
    else {
        document.getElementById(((irow - 1) * colms + colm).toString()).style.backgroundColor = 'blue';
        color = "blue"
    }

    turn++;
    win_check(irow - 1, colm, turn - 1, color);
}

function win_check(row, colm, turn, color) {
    //vertical
    var sum = 0;
    //down
    for (let irow = row; irow >= 0; irow--) {
        console.log(irow)
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

    if (sum >= win_sum)
        alert(color + " wins");


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

    if (sum >= win_sum)
        alert(color + " wins");

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

    if (sum >= win_sum)
        alert(color + " wins");

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

    if (sum >= win_sum)
        alert(color + " wins");
}

