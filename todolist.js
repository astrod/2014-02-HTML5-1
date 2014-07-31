//pull request 전에 git fetch upstream 해서 싱크 맞추기

/* 2014/07/20 최종 완료
 * 131077 채종운
 * 템플릿을 활용하여 li 동적으로 생성하기
 * 사용한 라이브러리 : Underscore.js

    2014/07/24 최종 완료
* TODO 완료 구현 - li에 completed clase 추가
* li 삽입시 애니메이션을 넣는다.
* li 삭제시 애니메이션을 넣는다.
* 위의 두 개를 CSS3로 변경한다.
*/

//ENTER  키를 13으로 매핑
var ENTER = 13; 

//입력받은 값이 ENTER라면 index.html에 저장해두었던 String을 호출, insertAdjacentHTML을 사용하여 집어넣는다.
function addTODO(e){
	if(e.keyCode == ENTER && e.target.value !=="") {
	            var todo = makeStringUsingTemplete(document.getElementById("new-todo").value);
	            document.getElementById("todo-list").insertAdjacentHTML('afterBegin', todo);  
	            
	            var changeli = document.querySelector(".original");
		changeOpacity(changeli, "up");
	            document.getElementById("new-todo").value = "";
        	}
}

//애니메이션을 위해, opacity를 변경하고자 하는 div를 인자로 받아서 그 값이 1이면 0으로, 0이면 1로 변경한다.
function changeOpacity(chnagedDiv, state) {	
	chnagedDiv.offsetHeight;
	if(state === "up") {
		chnagedDiv.style.opacity = 1;
	}else if(state === "down"){
		chnagedDiv.style.opacity = 0;
	}
} 
 
//HTML파일에 있는 문자열을 가져와서 사용한다.
function makeStringUsingTemplete(inputStr) {
    var compiled = _.template(document.getElementById("viewString").innerText);
    return compiled({text: inputStr});
}

//삭제하는 애니메이션을 삽입하고, 돔을 completed로 변경하는 역할을 한다.
function removeAndCompletedTODO(e) {
	if(e.target.className === "destroy") {
		var name = e.target.parentNode.parentNode;
		changeOpacity(name, "down");
		name.addEventListener("transitionend", function(e) {
			if(e.target.tagName == "LI") {
				name.remove();
			}
		}, false)

	} else if(e.target.className === "toggle") {
		var input = e.target;
		var li = input.parentNode.parentNode;
		if(input.checked === true) {
			li.className = "completed";
		}else {
			li.className = "original";
		}
	} 
}

/*
 DOMContentLoaded는 전체 문서(HTML, Script)가 다시금 로드된다.
 load는 전체 문서와 리소스(image, style...)전체가 다시 로드된다.
 현재는 script만 다시 로드하면 되는 문제이니 DOMContentLoaded가 적절하다고 생각한다.
 */
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("new-todo").addEventListener("keydown", addTODO);
    document.querySelector("#todo-list").addEventListener("click", removeAndCompletedTODO);
});


//li를 붙일 때 애니메이션을 넣는 함수이다.
// function useIntervalForUp(name) {
// 	var i = 0;
// 	var key = setInterval(function() {
// 		if(i === 50) {
// 			clearInterval(key);
// 		}else {		
// 			name.style.opacity = i*0.02;
// 		}
// 		i += 1;
// 	}, 16)
// }

//li를 제거할 때 애니메이션을 넣는 함수이다.
// function useIntervalForDown(name) {
// 	var i = 0;
// 	var key = setInterval(function() {
// 		if(i === 50) {
// 			clearInterval(key);
// 			name.parentNode.removeChild(name);
// 		}else {		
// 			name.style.opacity = 1 - i*0.02;
// 		}
// 		i += 1;
// 	}, 16)
// }


                        