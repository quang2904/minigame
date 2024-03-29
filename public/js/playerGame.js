var socket = io();
var playerAnswered = false;
var correct = false;
var name;
var score = 0;

var params = jQuery.deparam(window.location.search); //Lấy id từ url

socket.on('connect', function() {
    //Nói với máy chủ rằng đó là kết nối máy chủ từ chế độ xem trò chơi
    socket.emit('player-join-game', params);
    
    document.getElementById('answer1').style.visibility = "visible";
    document.getElementById('answer2').style.visibility = "visible";
    document.getElementById('answer3').style.visibility = "visible";
    document.getElementById('answer4').style.visibility = "visible";
});

socket.on('noGameFound', function(){
    window.location.href = '../../';//Chuyển hướng người dùng đến trang 'tham gia trò chơi' 
});

function answerSubmitted(num){
    if(playerAnswered == false){
        playerAnswered = true;
        
        socket.emit('playerAnswer', num);//Gửi câu trả lời của người chơi tới máy chủ
        
        //Ẩn nút khỏi người dùng
        document.getElementById('answer1').style.visibility = "hidden";
        document.getElementById('answer2').style.visibility = "hidden";
        document.getElementById('answer3').style.visibility = "hidden";
        document.getElementById('answer4').style.visibility = "hidden";
        document.getElementById('nameText').style.display = "block";
        document.getElementById('scoreText').style.display = "block";
        document.getElementById('message').style.display = "block";
        document.getElementById('message').innerHTML = "Answer Submitted! Waiting on other players...";
        
    }
}

//Nhận kết quả cho câu hỏi cuối cùng
socket.on('answerResult', function(data){
    if(data == true){
        correct = true;
    }
});

socket.on('questionOver', function(data){
    if(correct == true){
        document.body.style.backgroundColor = "#4CAF50";
        document.getElementById('nameText').style.display = "block";
        document.getElementById('scoreText').style.display = "block";
        document.getElementById('message').style.display = "block";
        document.getElementById('message').innerHTML = "Correct!";
    }else{
        document.body.style.backgroundColor = "#f94a1e";
        document.getElementById('nameText').style.display = "block";
        document.getElementById('scoreText').style.display = "block";
        document.getElementById('message').style.display = "block";
        document.getElementById('message').innerHTML = "Incorrect!";
    }
    document.getElementById('answer1').style.visibility = "hidden";
    document.getElementById('answer2').style.visibility = "hidden";
    document.getElementById('answer3').style.visibility = "hidden";
    document.getElementById('answer4').style.visibility = "hidden";
    socket.emit('getScore');
});

socket.on('newScore', function(data){
    document.getElementById('scoreText').innerHTML = "Score: " + data;
});

socket.on('nextQuestionPlayer', function(){
    correct = false;
    playerAnswered = false;
    
    document.getElementById('answer1').style.visibility = "visible";
    document.getElementById('answer2').style.visibility = "visible";
    document.getElementById('answer3').style.visibility = "visible";
    document.getElementById('answer4').style.visibility = "visible";
    document.getElementById('nameText').style.display = "none";
    document.getElementById('scoreText').style.display = "none";
    document.getElementById('message').style.display = "none";
    document.body.style.backgroundColor = "white";
    
});

socket.on('hostDisconnect', function(){
    window.location.href = "../../";
});

socket.on('playerGameData', function(data){
   for(var i = 0; i < data.length; i++){
       if(data[i].playerId == socket.id){
           document.getElementById('nameText').innerHTML = "Name: " + data[i].name;
           document.getElementById('scoreText').innerHTML = "Score: " + data[i].gameData.score;
       }
   }
});

socket.on('GameOver', function(){
    document.body.style.backgroundColor = "#FFFFFF";
    document.getElementById('answer1').style.visibility = "hidden";
    document.getElementById('answer2').style.visibility = "hidden";
    document.getElementById('answer3').style.visibility = "hidden";
    document.getElementById('answer4').style.visibility = "hidden";
    document.getElementById('nameText').style.display = "block";
    document.getElementById('scoreText').style.display = "block";
    document.getElementById('message').style.display = "block";
    document.getElementById('message').innerHTML = "GAME OVER";
});

