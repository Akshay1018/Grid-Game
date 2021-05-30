document.getElementById('bgMusic').play();
document.getElementById('bgMusic').volume = 0.05;

//check multiples of n
function checkMultiples(event, cellData, level) {
    var n = Number(event.target.innerText);
    if (n === 1) {
        var currentAttempt = Number(localStorage.getItem("Attempts")) + 1;
        localStorage.setItem("Attempts", currentAttempt);
        document.getElementById("score2").innerText = localStorage.getItem("Attempts");
        document.getElementById("jackpot").style.display = "block";
        document.getElementById("jackpotSound").play();
        setData();
        document.getElementById("leaderBoard").style.display = "block";
        return;
    }
    const Level1 = [2, 3, 5, 7];
    if (Level1.includes(n)) {
        document.getElementById("gameOver").style.display = "block";
        document.getElementById("gameOverAudio").play();
        document.getElementById("totalTries").innerText = 0;
        document.getElementById("leaderBoard").style.display = "block";
        return;
    } else if (level === 'medium') {
        var Level2 = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]; // 1-40
        var n1 = Number(event.target.innerText);
        if (Level2.includes(n1)) {
            document.getElementById("gameOver").style.display = "block";
            document.getElementById("gameOverAudio").play();
            document.getElementById("totalTries").innerText = 0;
            document.getElementById("leaderBoard").style.display = "block";
            return;
        }
    } else if (level === 'hard') {
        var Level3 = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59]; // 1-60
        var n2 = Number(event.target.innerText);
        if (Level3.includes(n2)) {
            document.getElementById("gameOver").style.display = "block";
            document.getElementById("gameOverAudio").play();
            document.getElementById("totalTries").innerText = 0;
            document.getElementById("leaderBoard").style.display = "block";
            return;
        }
    }
    var currentAttempt = Number(localStorage.getItem("Attempts")) + 1;
    localStorage.setItem("Attempts", currentAttempt);
    for (i = 0; i < 10; i++) {
        for (j = 0; j < 10; j++) {
            if (cellData[i][j] % n === 0) {
                var cell = document.getElementById(cellData[i][j]);
                cell.innerText = ' ';
                cell.style.backgroundImage = "url(brick.png)";
                cell.style.backgroundSize = '100%';
                cell.style.backgroundColor = 'red';
                cell.style.pointerEvents = 'none';
            }
        }
    }
    document.getElementById("totalTries").innerText = localStorage.getItem("Attempts");
}

function easy(event, level) {
    event.preventDefault();
    localStorage.setItem("Attempts", 0);
    createTable(level);
}

function medium(event, level) {
    event.preventDefault();
    localStorage.setItem("Attempts", 0);
    createTable(level);
}

function hard(event, level) {
    event.preventDefault();
    localStorage.setItem("Attempts", 0);
    createTable(level);
}

function CellDataAndSwap() {
    var cellData = new Array(10);
    for (var i = 0; i < 10; i++) {
        cellData[i] = new Array(10);
    }
    k = 1;
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            cellData[i][j] = k++;
        }
    }
    cellData.sort(() => Math.random() - 0.5);
    for (var i = cellData.length - 1; i >= 0; i--) {
        cellData[i].sort(() => Math.random() - 0.5);
    }
    return cellData;
}

function createTable(level) {
    var cellData = CellDataAndSwap();
    for (var i = 0; i < 10; i++) {
        var table = document.getElementById("myTable");
        var tr = document.createElement("tr");
        table.appendChild(tr);
        for (var j = 0; j < 10; j++) {
            var td = document.createElement("td");
            tr.appendChild(td);
            td.innerHTML = cellData[i][j];
            td.style.backgroundImage = "url(block1.png)";
            td.style.fontSize = "0px";
            td.style.backgroundSize = "100%";
            td.setAttribute("id", cellData[i][j]);
            td.addEventListener("click", function (event) {
                checkMultiples(event, cellData, level);
                document.getElementById("keyPressAudio").play();
            });
        }
    }
    return table;
}

function entryGame(event, level) {
    document.getElementById("totalTries").innerText = 0;
    var player = document.getElementById("enterNameId").value;
    localStorage.setItem('player', player);

    document.getElementById("playerName").innerText = "Hello " + player + " !!";
    document.getElementById("title").innerText = level.toUpperCase() + " LEVEL";
    document.getElementById("gameOver").style.display = "none";
    document.getElementById("bannerintro").style.display = "none";
    document.getElementById("jackpot").style.display = "none";
    document.getElementById("myTable").innerHTML = "";
    if (level === 'easy') {
        easy(event, level);
    } else if (level === 'medium') {
        medium(event, level);
    } else {
        hard(event, level);
    }
}

//sets player data name and attempts in an array of object in localStorage
var playerDataArray = JSON.parse(localStorage.getItem('playerDataArray')) || [];

function setData() {
    var player = document.getElementById("enterNameId").value;
    const playerData = {
        'player': player,
        'attempts': document.getElementById("totalTries").innerHTML
    };
    if (playerDataArray !== null) {
        playerData.player = player,
            playerData.attempts = document.getElementById("totalTries").innerHTML;
    }
    if (playerData !== null) {
        playerDataArray.push(playerData);
    }
    localStorage.setItem('playerDataArray', JSON.stringify(playerDataArray));
    playerDataArray = playerDataArray.sort((a, b) => a.attempts - b.attempts);
    const unique = removeDuplicates(playerDataArray);
    //we only need first 3 for leaderboard
    //unique.splice(3);
    //sets unique in localStorage 
    localStorage.setItem('unique', JSON.stringify(unique));
    leaderBoard();
}
//removes duplicate players 
const removeDuplicates = (playerDataArray) => {
    const flag = {};
    const unique = [];
    playerDataArray.forEach(elem => {
        if (!flag[elem.player]) {
            flag[elem.player] = true;
            unique.push(elem);
        }
    });
    return unique;
}

function leaderBoard() {
    var leaderBoardData = JSON.parse(localStorage.getItem('unique'));
    document.getElementById("oneName").innerText = leaderBoardData[0].player;
    document.getElementById("oneScore").innerText = leaderBoardData[0].attempts;
    document.getElementById("twoName").innerText = leaderBoardData[1].player;
    document.getElementById("twoScore").innerText = leaderBoardData[1].attempts;
    document.getElementById("threeName").innerText = leaderBoardData[2].player;
    document.getElementById("threeScore").innerText = leaderBoardData[2].attempts;
}

function leaderBoard2() {
    document.getElementById("leaderboard-popup").style.display = "block";
    var leaderBoardData = JSON.parse(localStorage.getItem('unique'));
    document.getElementById("oneName2").innerText = leaderBoardData[0].player;
    document.getElementById("oneScore2").innerText = leaderBoardData[0].attempts;
    document.getElementById("twoName2").innerText = leaderBoardData[1].player;
    document.getElementById("twoScore2").innerText = leaderBoardData[1].attempts;
    document.getElementById("threeName2").innerText = leaderBoardData[2].player;
    document.getElementById("threeScore2").innerText = leaderBoardData[2].attempts;
}