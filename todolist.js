//pull request 전에 git fetch upstream 해서 싱크 맞추기
//ctrl + commend + g = rename 단축키

/* 2014/07/20 최종 완료
 * 131077 채종운
 * 템플릿을 활용하여 li 동적으로 생성하기
 * 사용한 라이브러리 : Underscore.js

    2014/07/24 최종 완료
* TODO 완료 구현 - li에 completed clase 추가
* li 삽입시 애니메이션을 넣는다.
* li 삭제시 애니메이션을 넣는다.
* 위의 두 개를 CSS3로 변경한다.
*
* 2014/08/05 최종 완료
* DELETE 요청을 구현한다.
* 페이지가 로딩되었을 때, 입력한 모든 TODO를 호출하여 값을 띄운다.
*
*/
	

var TODOsync = {
	//xhr 요청. 서버에 GET으로 모든 리스트를 요청함
	get : function(callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "http://ui.nhnnext.org:3333/astrod", true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e) {
 			callback(JSON.parse(xhr.responseText));
		});
		xhr.send();
	}, 
	//서버에 PUT으로 입력한 값을 업로드함
	add : function(todo, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("PUT", "http://ui.nhnnext.org:3333/astrod", true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e) {
 			callback(JSON.parse(xhr.responseText));
		});
		xhr.send("todo=" + todo);
	},
	//POST로 입력한 값을 수정함. 1이면 완료, 0이면 완료되지 않음
	completed : function(param, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://ui.nhnnext.org:3333/astrod/" + param.key, true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e) {
 			callback(JSON.parse(xhr.responseText));
		});
		xhr.send("completed=" + param.completed);
	},
	//입력한 TODO를 삭제함
	remove : function(param, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("DELETE", "http://ui.nhnnext.org:3333/astrod/" + param.key, true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e) {
 			callback(JSON.parse(xhr.responseText));
		});
		xhr.send();
	}
}

var TODO = {
	//ENTER  키를 13으로 매핑
	ENTER : 13,
	init : function() {
			document.addEventListener("DOMContentLoaded", function() {
				document.getElementById("new-todo").addEventListener("keydown", this.addTODO.bind(this));
				document.querySelector("#todo-list").addEventListener("click", this.TODOeventHandle.bind(this));
				TODOsync.get(function(json) {
					for(var i in json) {
						var todoli = this.makeStringUsingTemplete(json[i].todo);
						document.getElementById("todo-list").insertAdjacentHTML('afterBegin', todoli);
						var changeli = document.querySelector(".original");
			         			changeli.dataset.key = json[i].id;
			         			if(json[i].completed === 1) {
			         				var toggle = changeli.querySelector('div > input');
			         				changeli.className = "completed";
			         				toggle.checked = true;
			         			} 
			         			this.changeOpacity(changeli, "up");
					}
				}.bind(this));
			}.bind(this));
	},
	//ENTER가 눌리면 index.html에 저장해두었던 String을 호출, insertAdjacentHTML을 사용하여 집어넣는다.	
	addTODO : function(e, key) {
		if(e.keyCode == this.ENTER && e.target.value !=="") {
			var todo = document.getElementById("new-todo").value;
			TODOsync.add(todo, function(json) {
				var todoli = this.makeStringUsingTemplete(todo);
			             document.getElementById("todo-list").insertAdjacentHTML('afterBegin', todoli);  
			            
			             var changeli = document.querySelector(".original");
			             changeli.dataset.key = json.insertId;
				this.changeOpacity(changeli, "up");
			             document.getElementById("new-todo").value = "";
			}.bind(this));
	
	        	}
	} ,
	//애니메이션을 위해, opacity를 변경하고자 하는 div를 인자로 받아서 그 값이 1이면 0으로, 0이면 1로 변경한다.
	changeOpacity : function(changeDiv, state) {	
		changeDiv.offsetHeight;
		if(state === "up") {
			changeDiv.style.opacity = 1;
		}else if(state === "down"){
			changeDiv.style.opacity = 0;
		}
	},
	//HTML파일에 있는 문자열을 가져온다.
	makeStringUsingTemplete : function(inputStr) {
		    var compiled = _.template(document.getElementById("viewString").innerText);
		    return compiled({text: inputStr});
	},

	//Event를 델리게이트 방식으로 걸어 놓고, 클릭한 클래스에 따라 다른 함수를 호출한다.
	TODOeventHandle : function(e) {
		if(e.target.className === "destroy") {
			this.removeTODO(e);
		} else if(e.target.className === "toggle") {
			this.CompletedTODO(e);
		}
	},

	//TODO를 삭제한다.
	removeTODO : function(e) {
		var name = e.target.parentNode.parentNode;
		TODOsync.remove({
			"key" : name.dataset.key
		}, function() {
			this.changeOpacity(name, "down");
			name.addEventListener("transitionend", function(e) {
			console.log(e.target.tagName);
			if(e.target.tagName == "LI") {
				name.remove();
			}
			}, false)
		}.bind(this))
	},

	//TODO의 class를 complete로 변경한다.
	CompletedTODO : function(e) {
			var input = e.target;
			var li = input.parentNode.parentNode;
			var completed = input.checked ? "1":"0";
			TODOsync.completed({
				"key" : li.dataset.key,
				"completed" : completed
			}, function() {
				if(completed === "1") {
					li.className = "completed";
				}else {
					li.className = "original";
				}
			})

		
	}
};

TODO.init();


/*
 DOMContentLoaded는 전체 문서(HTML, Script)가 다시금 로드된다.
 load는 전체 문서와 리소스(image, style...)전체가 다시 로드된다.
 현재는 script만 다시 로드하면 되는 문제이니 DOMContentLoaded가 적절하다고 생각한다.
 */

                        