var snakeGame = function(table){
	// 보드 가로 세로 사이즈
	var width=10, height=10
	// 보드판 2차원 배열
	var board=[];
	// 블록 사이즈
	var blockSize='40px';
	// 스네이크
	var snake='red';
	// 스네이크 꼬리 색
	var snaketail='pink';
	// 스네이크 방향 위, 오른쪽, 아래, 왼쪽 = 38, 39, 40, 37
	var snakeWay=39;
	// 스네이크 현재 위치
	var currentWay=[];
	// 게임 상태
	var gameState='wait';
	// 스네이크 꼬리
	var snakeTail=0;
	// 스네이크 속도
	var snakeSpeed=1;
	// 스네이크 꼬리가 스네이크의 뒤를 따라 올수 있도록 하기위해 이동 경로를 쌓아둠
	var snakeLoadMap=[];
	// 아이템
	var item='black';
	//장애물
	var obstacle='blue';
	// 점수
	var score=0;
	// 레벨
	var level=1;
	// 꼬리
	var tail=0;
	// 색칠 하기도 전에 방향키를 눌렀을때 변경이 안되도록 하기위함
	var keyLock=false;


	var start = function(){
		console.log('게임 시작')
		gameState='play';
		//1. 게임 화면 생성
		makeBoard();
		//2. 스네이크 생성
		makeSnake();
		//3. 키셋업
		setupKeypad();
		//4. 스네이크 이동 시작
		moveStart();
		//5. 아이템 표시
		creatItem();
		//6. 장애물 표시
		for (var i = 0; i <5; i++) {
			creatObstacle();
		}
		


	}


	// 1-1맵 생성
	var makeBoard = function(){
		for(var h=0;h<height;h++){
			board[h] = new Array(width);
			var tr = document.createElement('tr');
			for(var w=0;w<width;w++){
				var block = makeBlock();
				board[h][w] = block;
				tr.appendChild(block);
			}
			table.appendChild(tr);
		}
	}

	// 1-2맵에 들어갈 블록 생성
	var makeBlock = function(){
		var block = document.createElement("td");
		block.style.backgroundColor = 'brown';
		block.width = block.height= blockSize;
		return block;
	}
	
	
	//2-1 스네이크 생성 및 처음 위치 정의 [0, 0]
	var makeSnake = function(){
		currentWay = [0, 0];
		board[0][0].style.backgroundColor=snake;
	}


	//3-1 키 이벤트 등록
	var setupKeypad = function(){
		if(window.addEventListener){
			document.body.addEventListener('keydown', keypress); 
		}else{
			document.body.attachEvent('onkeydown', keypress)
		}
	}
	//3-2 키 이벤트 메소드
	var keypress = function(e){
		// 같은 방향은 진행 불가
		if(e.keyCode == snakeWay) return;

		// 반대 방향은 갈수 없음
		if(e.keyCode == 38 && snakeWay != 40){	//위
			stateChange(e.keyCode)
		}else if(e.keyCode == 39 && snakeWay != 37){	//오른쪽
			stateChange(e.keyCode)
		}else if(e.keyCode == 40 && snakeWay != 38){	//아래
			stateChange(e.keyCode)
		}else if(e.keyCode == 37 && snakeWay != 39){	//왼쪽
			stateChange(e.keyCode)
		}
	}
	//3-3 스네이크 방향 변경
	var stateChange = function(way){
		if(!keyLock){
			snakeWay = way;
			keyLock = true;
		}
	}


	//4-1 스네이크 이동 시작
	var moveStart = function(){
		if(gameState == 'play'){
			setTimeout(function(){
				if(snakeWay == 38){
					// 위로 이동
					currentWay[0] = currentWay[0]-1;
				}else if(snakeWay == 39){
					// 오른쪽으로 이동
					currentWay[1] = currentWay[1]+1;
				}else if(snakeWay == 40){
					// 아래쪽으로 이동
					currentWay[0] = currentWay[0]+1;
				}else if(snakeWay == 37){
					// 왼쪽 으로 이동
					currentWay[1] = currentWay[1]-1;
				}
				var block;
				try{
					block = board[currentWay[0]][currentWay[1]];
					//8 스네이크의 꼬리에 닿았을때
					if(block.style.backgroundColor == snaketail){
						gameEnd();
						return;
					}
				}catch(e){
					//8 벽에 부딛쳤을때
					gameEnd();
					return;
				}

				//7 스네이크의 이동경로(꼬리가 스네이크의 바로 뒤에서 따라가게 하기 위함)
				snakeLoadMap.push([currentWay[0], currentWay[1]]);

				//6 item을 만났을때
				if(block.style.backgroundColor == item){
					//아이템 먹기
					itemeat();
				}

				//6 obstacle을 만났을때
				if(block.style.backgroundColor == obstacle){
					//장애물 맞았을때
					crashObstacle();
				}


				// 보드 초기화
				boardClear();
				// 스네이크 색칠
				snakePaint();
				keyLock = false;
				// 스네이크 이동(재귀)
				moveStart();
			}, snakeSpeed*1000)
		}
	}

	//4-2 보드 초기화
	var boardClear = function(){
		for(var h=0;h<height;h++){
			for(var w=0;w<width;w++){
				if(board[h][w].style.backgroundColor != item){
					if(board[h][w].style.backgroundColor != obstacle)
						board[h][w].style.backgroundColor='brown';
				}

				
			}
		}
	}

	//4-3 스네이크 색칠
	var snakePaint = function(){
		var block =	board[currentWay[0]][currentWay[1]];
		block.style.backgroundColor = snake
		if(snakeTail > 0){
			//7-1 스네이크꼬리사이즈만큼 반복
			for(var i=0,max=snakeTail;i<max;i++){
				// 스네이크의 바로 뒤에 경로부터 색칠함
				// 스네이크의 최신 경로는 로드맵의 맨 마지막 배열에 위치
				// 스네이크의 이전 경로 +1, 사이즈는 0부터 시작 함으로 +1, snakeLoadMap[snakeLoadMap.length-(i+2)][0]
				// 꼬리의 Y 경로 snakeLoadMap[snakeLoadMap.length-(i+2)][0], X 경로 snakeLoadMap[snakeLoadMap.length-(i+2)][1]
				var block = board[snakeLoadMap[snakeLoadMap.length-(i+2)][0]][snakeLoadMap[snakeLoadMap.length-(i+2)][1]]
				block.style.backgroundColor = snaketail;
			}
		}
	}


	//5-1 아이템
	var creatItem = function(){
		var XY = [getItemY(), getItemX()];
		var block =	board[XY[0]][XY[1]];
		//블럭일 경우에만 아이템 표시
		if(block && block.style.backgroundColor == 'brown'){
			block.style.backgroundColor = item;
		}else{
			creatItem();
		}
	}

	//5-2 아이템 위치 값 생성 
	var getItemX = function() {
	  return Math.floor(Math.random() * (width - 0) + 0);
	}
	var getItemY = function() {
	  return Math.floor(Math.random() * (height - 0) + 0);
	}


	//6-1 장애물 생성
	var creatObstacle = function(){
		var AB = [getObstacleB(), getObstacleA()];
		var block =	board[AB[0]][AB[1]];
		//블럭일 경우에만 장애물 표시
		if(block && block.style.backgroundColor == 'brown'){
			block.style.backgroundColor = obstacle;
		}else{
			creatObstacle();
		}
	}

	//6-2 장애물 위치 값 생성
	var getObstacleA = function() {
	  return Math.floor(Math.random() * (width - 0) + 0);
	}
	var getObstacleB = function() {
	  return Math.floor(Math.random() * (height - 0) + 0);
	}
	


	//7-1 아이템 먹었을때
	var itemeat = function(){
		//꼬리 추가
		snakeTail = snakeTail+1;
		tail= tail+1;
		document.getElementById('tail').innerHTML = tail;
		//아이템 재생성
		creatItem();
		if(snakeSpeed > 0.2){
			snakeSpeed -= 0.1;
			level += 1
			document.getElementById('level').innerHTML = level;
		}else
			level += 1
			document.getElementById('level').innerHTML = level;
		score += 100;

		if (score>1000) {
			creatObstacle();

		}
		document.getElementById('score').innerHTML = score;
	}


	//7-2 장애물 충돌시
	var crashObstacle = function(){
		gameEnd();
	}


	//8-1 게임 종료
	var gameEnd = function(){
		gameState = 'end';
		alert('Dead\n최종점수='+score);
	}


	return{
		start : start
	}
}

var game = new snakeGame(snakeMap);
game.start();