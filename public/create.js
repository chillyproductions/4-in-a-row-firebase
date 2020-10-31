addEventListener("load", ()=>{
    firebase.auth().onAuthStateChanged(() =>{
        if(firebase.auth().currentUser != null){
            document.getElementById("width").value = 7;
            document.getElementById("height").value = 6;
            document.getElementById("win_num").value = 4;
            document.getElementById("page").hidden = false;
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
