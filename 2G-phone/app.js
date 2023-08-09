// 변수

let input = document.getElementById("input");
let isCalling = false;

// 함수 : 원형 버튼 mouseover mouseout

function circleBtnOver(obj){
    obj.style.color = "var(--color2)";
}
function circleBtnOut(obj){
    obj.style.color = "black";
}

// 함수 : 숫자 패드 클릭

function handleNumberPad(char){
    if( (! isCalling) && (input.innerHTML.length < 11) ) 
        input.innerHTML += char;
}

// 함수 : 좌우 통화 버튼 mouseover mouseout

function callBtnOver(obj){
    obj.style.backgroundColor = "var(--color2)";
}
function callBtnOut(obj){
    obj.style.backgroundColor = "var(--color4)";
}

// 함수 : 좌우 통화 버튼 클릭

function handleCallButtonL(){
    if(input.innerHTML != ""){
        input.innerHTML += "<br>님께<br>통화 연결 중";
        isCalling = true;
    }
}
function handleCallButtonR(){
    input.innerHTML = "";
    isCalling = false;
}