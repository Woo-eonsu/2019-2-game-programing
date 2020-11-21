
window.addEventListener("load", drawScreen, false);
window.addEventListener("keydown", onkeydown, true);

var GAME_STATE_READY = 0; // 준비
var GAME_STATE_GAME = 1; // 게임 중
var GAME_STATE_OVER = 2; // 게임 오버

// 게임 상태값을 저장하는 변수
var GameState = GAME_STATE_READY; // 초기값은 준비 상태

var imgBackground = new Image();
imgBackground.src = "img/background.png";
imgBackground.addEventListener("load", drawScreen, false);

var imgPlayer = new Image();
imgPlayer.src = "img/player.png";
imgPlayer.addEventListener("load", drawScreen, false);

var intPlayerX = 350;
var intPlayerY = 250;

function drawScreen() {
    var theCanvas = document.getElementById("GameCanvas");
    var ctx = theCanvas.getContext("2d");

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 800, 600);

    // 배경 화면 그리기
    ctx.drawImage(imgBackground, 0, 0);
    
    // 플레이어 그리기
    ctx.drawImage(imgPlayer, intPlayerX, intPlayerY);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "50px Arial";
    ctx.textBaseline = "top";
    ctx.textAlign = "center";

    // 게임 준비 중
    if(GameState == GAME_STATE_READY) {
        ctx.fillText("준비", theCanvas.width / 2, 180);
    // 게임 중
    } else if(GameState == GAME_STATE_GAME) {

    // 게임 오버
    } else if(GameState == GAME_STATE_OVER) {
        ctx.fillText("게임 오버", theCanvas.width / 2, 180);
    }
}

function onkeydown(e) {
    // 게임 준비 중
    if(GameState == GAME_STATE_READY) {
        // 게임을 시작합니다
        if(e.keyCode == 13) {
            // 엔터를 입력하면 게임시작
            GameState = GAME_STATE_GAME;
        }
    }
    // 게임 중
    else if(GameState == GAME_STATE_GAME) {
        // 기존의 플레이어 이동 처리 코드
        switch(e.keyCode) {
            case 37: // LEFT
                intPlayerX -= 5;
                if(intPlayerX < 0) {
                    intPlayerX = 0;
                    onGameOver();
                }
                break;
    
            case 39: // RIGHT
                intPlayerX += 5;
                if(intPlayerX > 740) {
                    intPlayerX = 740;
                    onGameOver();
                }
                break;
    
            case 38: // UP
                intPlayerY -= 5;
                if(intPlayerY < 0) {
                    intPlayerY = 0;
                    onGameOver();
                }
                break;
    
            case 40: // DOWN
                intPlayerY += 5;
                if(intPlayerY > 540) {
                    intPlayerY = 540;
                    onGameOver();
                }
                break;
        };
    }
    // 게임 오버
    else if(GameState == GAME_STATE_OVER) {
        // 게임 준비 상태로 변경
        if(e.keyCode == 13) {
            // 엔터를 입력하면 준비 상태로
            GameState = GAME_STATE_READY;
        }
    }

    // 화면 갱신
    drawScreen();
}

function onGameOver() {
    GameState = GAME_STATE_OVER;
    intPlayerX = 350;
    intPlayerY = 250;
}