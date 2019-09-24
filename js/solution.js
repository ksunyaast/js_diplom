'use strict'
const currentImage = document.querySelector('.current-image');
const menu = document.querySelector('.menu');
const drag = document.querySelector('.drag');
const wrapApp = document.querySelector('.wrap.app');
const uploadNewButton = document.querySelector('.menu__item.mode.new');
const error = document.querySelector('.error');
const imageLoader = document.querySelector('.image-loader');
const burger = document.querySelector('.burger');
const commentsOn = document.querySelector('#comments-on');
const commentsOff = document.querySelector('#comments-off');
const menuCopy = document.querySelector('.menu_copy');
const menuUrl = document.querySelector('.menu__url');

let commentsShow = true;
let menuList = false;
let canvas = document.createElement('canvas');
let mask = document.createElement('div');
mask.setAttribute('style', `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);`);
mask.setAttribute('class', 'mask');
wrapApp.appendChild(mask);

wrapApp.appendChild(canvas);

let url = new URL(`${window.location.href}`);
let imageId = url.searchParams.get('id');
if (imageId) {
	getDataImage(imageId);
}

menu.dataset.state = 'upload';
menuState();

function menuState() { //внешний вид меню
	if (menu.dataset.state === 'upload') {
		currentImage.src = '';
		mask.style.background = '';

		if (document.querySelector('.comments__form')) {
			document.querySelectorAll('.comments__form').forEach((form) => {
				wrapApp.removeChild(form);
			});
		}
		Array.from(menu.querySelectorAll('.mode')).forEach((li) => {
			if (!li.classList.contains('new') ) {
				li.style.display = 'none';
			}
		});
		menu.querySelector('.burger').style.display = 'none';
	};
	if (menu.dataset.state === 'share') {
		menu.querySelector('.burger').style.display = 'inline-block';
		Array.from(menu.querySelectorAll('.mode')).forEach((li) => {
			if (!li.classList.contains('share') ) {
				li.style.display = 'none';
			} else {
				li.style.display = 'inline-block';
			}
		});
		Array.from(menu.querySelectorAll('.tool')).forEach((li) => {
			if (!li.classList.contains('share-tools') ) {
				li.style.display = 'none';
			} else {
				li.style.display = 'inline-block';
			}
		});
	};
	if (menu.dataset.state === 'draw') {
		menu.querySelector('.burger').style.display = 'inline-block';
		Array.from(menu.querySelectorAll('.mode')).forEach((li) => {
			if (!li.classList.contains('draw') ) {
				li.style.display = 'none';
			} else {
				li.style.display = 'inline-block';
			}
		});
		Array.from(menu.querySelectorAll('.tool')).forEach((li) => {
			if (!li.classList.contains('draw-tools') ) {
				li.style.display = 'none';
			} else {
				li.style.display = 'inline-block';
			}
		});
	};
	if (menu.dataset.state === 'comments') {
		menu.querySelector('.burger').style.display = 'inline-block';
		Array.from(menu.querySelectorAll('.mode')).forEach((li) => {
			if (!li.classList.contains('comments') ) {
				li.style.display = 'none';
			} else {
				li.style.display = 'inline-block';
			}
		});
		Array.from(menu.querySelectorAll('.tool')).forEach((li) => {
			if (!li.classList.contains('comments-tools') ) {
				li.style.display = 'none';
			} else {
				li.style.display = 'inline-block';
			}
		});
	};
};

burger.addEventListener('click', () => { //клик по бургеру сворачивание/разворачивание меню
	if (!menuList) {
		Array.from(menu.querySelectorAll('.tool')).forEach((li) => {
			li.removeAttribute('style');
		});
		Array.from(menu.querySelectorAll('.mode')).forEach((li) => {
			li.style.display = 'inline-block';
		});
		menuList = true;
	} else {
		menuState();
		menuList = false;
	}
});

Array.from(menu.querySelectorAll('.mode')).forEach((mode) => { //выбор режима
	mode.addEventListener('click', (event) => {
		if (event.currentTarget.classList.contains('new')) {
			if (menu.dataset.state === 'upload') {
				uploadImage(event);
			} else {
				menu.dataset.state = 'upload';
				menuList = false;
				menuState();
			}
		};
		if (event.currentTarget.classList.contains('comments')) {
			menu.dataset.state = 'comments';
			menuList = false;
			menuState();
		}
		if (event.currentTarget.classList.contains('draw')) {
			menu.dataset.state = 'draw';
			menuList = false;
			menuState();
		}
		if (event.currentTarget.classList.contains('share')) {
			menu.dataset.state = 'share';
			menuList = false;
			menuState();
		}
	})
});

// перемещение меню по полю
let movedElement = null;
document.addEventListener('mousedown', event => {
  if (event.target.classList.contains('drag')) {
  	movedElement = event.target;    
  };
});



document.addEventListener('mousemove', event => {
  if(movedElement) {
    event.preventDefault();
    let dragWidth = parseInt(getComputedStyle(movedElement).width.replace('px',''));
	let menuHeight = parseInt(getComputedStyle(movedElement.parentElement).height.replace('px',''));
	let menuWidth = parseInt(getComputedStyle(movedElement.parentElement).width.replace('px',''));
    let shiftX = dragWidth / 2;
    let shiftY = menuHeight / 2;
    let limitXRight = Math.round(document.documentElement.clientWidth - (menuWidth - shiftX));
    let limitXLeft = Math.round(shiftX);
    let limitXTop = Math.round(shiftY);
    let limitXBottom = Math.round(document.documentElement.clientHeight - menuHeight);
    let styleLeft = event.pageX - shiftX;
    let styleTop = event.pageY - shiftY;
    if (event.pageX >= limitXRight) {
    	styleLeft = limitXRight;
    }
    if (event.pageX <= limitXLeft) {
    	styleLeft = 0;
    }
    if (event.pageY <= limitXTop) {
    	styleTop = 0;
    }
    if (event.pageY >= limitXBottom) {
    	styleTop = limitXBottom;
    }
    menu.setAttribute('style', `left: ${styleLeft}px; top: ${styleTop}px; white-space: nowrap;`);
  };
});

menu.addEventListener('click', () => {
	notHideMenu();
});


function notHideMenu() {
	let menuWidth = parseInt(getComputedStyle(menu).width.replace('px',''));
	let limitXRight = Math.round(document.documentElement.clientWidth - menuWidth);
	let menuLeft = parseInt(getComputedStyle(menu).left.replace('px',''));
	if (menuLeft > limitXRight) {
		menu.setAttribute('style', `left: ${limitXRight}px; top: ${getComputedStyle(menu).top}; white-space: nowrap;`);
	}
}


document.addEventListener('mouseup', event => {
	movedElement = null;
});

// загрузка изображения
wrapApp.addEventListener('drop', onFilesDrop);
wrapApp.addEventListener('dragover', event => event.preventDefault());

function onFilesDrop(event) {
	event.preventDefault();
	if(menu.dataset.state !== 'upload') {
		error.querySelector('.error__message').textContent = 'Чтобы загрузить новое изображение, пожалуйста, воспользуйтесь пунктом "Загрузить новое" в меню';
		error.style.display = 'block';
		setTimeout(() => {
			error.style.display = 'none';
		}, 2000);
		return;
	}
	let files = Array.from(event.dataTransfer.files);
	addNewImage(files[0]);
}

function uploadImage(event) {
	if(!document.querySelector('#fileInput')) {
		let inputFile = document.createElement('input');
		inputFile.setAttribute('type', 'file');
		inputFile.setAttribute('id', 'fileInput');
		inputFile.setAttribute('accept', 'image/jpeg, image/png');
		inputFile.setAttribute('style', 'display: none;');
		wrapApp.appendChild(inputFile);
	}
	document.querySelector('#fileInput').click();
	document.querySelector('#fileInput').addEventListener('change', (event) => {
		let files = Array.from(event.currentTarget.files);
		addNewImage(files[0]);
	});
}

// отправка изображения
function addNewImage(file) {
	error.style.display = 'none';
	imageLoader.style.display = 'block';
	const formData = new FormData();
	formData.append('title', file.name);
	formData.append('image', file);

	fetch('https://neto-api.herokuapp.com/pic', {
		body: formData,
		credentials: 'same-origin',
		method: 'POST',
	})
		.then(data => data.json())
		.then(data => getDataImage(data.id))
		.catch((err) => {
			imageLoader.style.display = 'none';
			error.style.display = 'block';
			setTimeout(() => {
				error.style.display = 'none';
			}, 2000);
			console.log(err);
		})
}

// получение данных
function getDataImage(id) {
	fetch(`https://neto-api.herokuapp.com/pic/${id}`)
		.then(data => data.json())
		.then((data) => {
			imageLoader.style.display = 'none';
			currentImage.src = data.url;
			menu.dataset.state = 'share';
			menuUrl.value = `${window.location.href}?id=${data.id}`;
			menuCopy.addEventListener('click', () => {
				menuUrl.select();
				document.execCommand('copy');
			});
			currentImage.addEventListener('load', () => {
				createCanvas();
				canvas.addEventListener('click', (event) => {
					addNewComentMark(event);
				});
				wrapApp.addEventListener('click', (event) => {
					commentFormButtons(event, data.id);
				})
			});
			menuState();
			notHideMenu();
			onlineUpdate(data.id);
		});
}

let connection;
function onlineUpdate(id) {
	connection = new WebSocket(`wss://neto-api.herokuapp.com/pic/${id}`);
	connection.addEventListener('message', event => {
		if (JSON.parse(event.data).event === 'pic'){
			if (JSON.parse(event.data).pic.mask) {
				mask.style.background = `url(${JSON.parse(event.data).pic.mask})`;
			}
			if (JSON.parse(event.data).pic.comments) {
				showComments(JSON.parse(event.data).pic.comments);
			}
		}
		if (JSON.parse(event.data).event === 'comment'){
			let comment = JSON.parse(event.data).comment;
			if (document.querySelector(`#position-${comment.top}-${comment.left}`)) {
				addCommentToForm(comment);
			} else {
				addNewCommentMarkForm(comment.top, comment.left);
			    addCommentToForm(comment);
			}
			Array.from(document.querySelectorAll('.comments__marker-checkbox')).forEach((checkbox) => {
				checkbox.checked = false;
			});
			let commentsFormId = document.querySelector(`#position-${comment.top}-${comment.left}`);
			commentsFormId.querySelector('.comments__marker-checkbox').checked = true;
			if (!commentsShow) {
				Array.from(document.querySelectorAll('.comments__form')).forEach((form) => {
					form.style.display = 'none';
				})
			}
		}
		if (JSON.parse(event.data).event === 'mask'){
			mask.style.background = `url(${JSON.parse(event.data).url})`;
		}
		if (JSON.parse(event.data).event === 'error'){
			console.log(JSON.parse(event.data).message);
		}
	});
}

function addCommentToForm(comment) {
	let commentsBody = document.querySelector(`#position-${comment.top}-${comment.left}`).querySelector('.comments__body');
	let newComment = document.createElement('div');
	newComment.setAttribute('class', 'comment');
	let commentTime = document.createElement('p');
	commentTime.setAttribute('class', 'comment__time');
	let time = new Date(comment.timestamp);
	commentTime.textContent = `${twoCharactersDate(time.getDate())}.${twoCharactersDate(time.getMonth())}.${twoCharactersDate(time.getFullYear())} ${twoCharactersDate(time.getHours())}:${twoCharactersDate(time.getMinutes())}:${twoCharactersDate(time.getSeconds())}`;
	let commentMessage = document.createElement('p');
	commentMessage.setAttribute('class', 'comment__message');
	commentMessage.textContent = comment.message;
	newComment.appendChild(commentTime);
	newComment.appendChild(commentMessage);
	commentsBody.insertBefore(newComment, commentsBody.querySelector('.comments__input').previousElementSibling);
}

function addNewCommentMarkForm (top, left) {
	let commentsForm = document.createElement('form');
	commentsForm.setAttribute('class', 'comments__form');
	commentsForm.setAttribute('id', `position-${top}-${left}`);
	commentsForm.innerHTML = `<span class="comments__marker"></span><input type="checkbox" class="comments__marker-checkbox">
        <div class="comments__body">
        <div class="comment">
            <div class="loader">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>            
          </div>
          <textarea class="comments__input" type="text" placeholder="Напишите ответ..."></textarea>
          <input class="comments__close" type="button" value="Закрыть">
          <input class="comments__submit" type="submit" value="Отправить">
        </div>`;
    commentsForm.querySelector('.comment').style.display = 'none';
    commentsForm.setAttribute('style', `top: ${top}px; left: ${left}px;`);
    wrapApp.appendChild(commentsForm);
}

function showComments(comments) {
	if (!comments) {
		return;
	}
	Object.values(comments).forEach((value) => {
		if (document.querySelector(`#position-${value.top}-${value.left}`)) {
			addCommentToForm(value);
		} else {
			addNewCommentMarkForm (value.top, value.left);
		    addCommentToForm(value);
		}
	})
}

//поделиться ссылка
function urlToShare(id) {
	menuUrl.value = `${window.location.href}/${id}`;
}

// добавление комментариев
function addNewComentMark (event) {
	if (menu.dataset.state !== 'comments') {
		return;
	}
	if (menu.dataset.state === 'upload') {
		return;
	}
	if (!commentsShow) {
		return;
	}
	removeEmptyCommentForm();//закрытие форм без комментариев
	Array.from(document.querySelectorAll('.comments__marker-checkbox')).forEach((checkbox) => {
		checkbox.checked = false;
	});
	addNewCommentMarkForm (event.pageY - 14, event.pageX - 21);
	document.querySelector(`#position-${event.pageY - 14}-${event.pageX - 21}`).querySelector('.comments__marker-checkbox').checked = true;
}

function commentFormButtons (event, id) {
	if (event.target.classList.contains('comments__marker-checkbox')) { //закрытие всех открытых комментариев при нажатии на маркер
		removeEmptyCommentForm();//закрытие форм без комментариев
		Array.from(document.querySelectorAll('.comments__marker-checkbox')).forEach((checkbox) => {
			checkbox.checked = false;
		});
		if (event.target.checked = true) {
			return;
		}
	}
	if (event.target.classList.contains('comments__close')) { //кнопка "закрыть" в коменте
		event.target.parentElement.parentElement.querySelector('.comments__marker-checkbox').checked = false;
		removeEmptyCommentForm();//закрытие форм без комментариев
	}
	if (event.target.classList.contains('comments__submit')) {
		event.preventDefault();
		event.target.parentElement.querySelector('.comments__input').previousElementSibling.style.display = 'block'; //лоадер сообщения

		//отправка комментария
		let left = Number(event.target.parentElement.parentElement.style.left.replace('px', ''));
		let top = Number(event.target.parentElement.parentElement.style.top.replace('px', ''));
		let messageContent = event.target.parentElement.querySelector('.comments__input').value;
		let sendData = 'message=' + encodeURIComponent(messageContent) + '&left=' + encodeURIComponent(left) + '&top=' + encodeURIComponent(top);

		fetch(`https://neto-api.herokuapp.com/pic/${id}/comments`, {
			body: sendData,
			credentials: 'same-origin',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
		})
			.then(data => data.json())
			.then(() => {
				event.target.parentElement.querySelector('.comments__input').previousElementSibling.style.display = 'none'; //убираем лоадер сообщения, когда данные отправлены
			})
			.catch((err) => {
				console.log(err);
				event.target.parentElement.querySelector('.comments__input').previousElementSibling.style.display = 'none';
			})

		event.target.parentElement.querySelector('.comments__input').value = '';
	}
	if (event.target.classList.contains('menu__toggle')) { //показать/скрыть комментарии
		if (event.target.id === 'comments-on') {
			commentsShow = true;
			Array.from(document.querySelectorAll('.comments__form')).forEach((form) => {
				form.style.display = 'block';
			})
		} else if (event.target.id === 'comments-off') {
			commentsShow = false;
			Array.from(document.querySelectorAll('.comments__form')).forEach((form) => {
				form.style.display = 'none';
			})
		}
	}
}

function removeEmptyCommentForm () { //закрытие форм без комментариев
	Array.from(document.querySelectorAll('.comments__form')).forEach((form) => {
		if (!form.querySelector('.comment__message')) {
			wrapApp.removeChild(form);
		};
	});
}

function twoCharactersDate(date) { //приведение чисел даты к двухзначному виду
	if (date < 10) {
		date = `0${date}`;
	} else if (String(date).length === 4) {
		date = String(date).slice(-2);
	}
	return date;
}

function debounce(callback, delay) {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      timeout = null;
      callback();
    }, delay);
  };
};

//рисование
canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");

let curves = [];
let drawing = false;
let needsRepaint = false;
let brushColor = '#6cbe47';
const BRUSH_RADIUS = 4;
Array.from(document.querySelectorAll('.menu__color')).forEach((color) => { //выбор цвета кисти
	color.addEventListener('click', () => {
		switch(color.value) {
			case 'red':
				brushColor = '#ea5d56';
				break;
			case 'yellow':
				brushColor = '#f3d135';
				break;
			case 'green':
				brushColor = '#6cbe47';
				break;
			case 'blue':
				brushColor = '#53a7f5';
				break;
			case 'purple':
				brushColor = '#b36ade';
				break;
		}
	})
});



function createCanvas() {
	canvas.width = parseInt(getComputedStyle(currentImage).width.replace('px',''));
	canvas.height = parseInt(getComputedStyle(currentImage).height.replace('px',''));
	canvas.setAttribute('style', `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);`);

	mask = document.querySelector('.mask');
	mask.style.width = `${canvas.width}px`;
	mask.style.height = `${canvas.height}px`;
			
	canvas.addEventListener("mousedown", (evt) => {
		if (menu.dataset.state === 'draw') {
			drawing = true;
			const curve = []; 
			curve.color = brushColor;

			curve.push(makePoint(event.offsetX, event.offsetY)); 
			curves.push(curve); 
			needsRepaint = true;
		};
	});
	canvas.addEventListener("mouseup", (evt) => {
		// if(drawing) {
		// 	setTimeout(() => {
		// 		sendCanvas();
		// 		tick();
		// 	}, 500);
		// }
		drawing = false;
	});
	canvas.addEventListener("mousemove", (evt) => {
		if (drawing) {
		    const point = makePoint(event.offsetX, event.offsetY);
		    curves[curves.length - 1].push(point);
		    needsRepaint = true;
		    trottledSendMask();
		}
	});
	tick();
}

function circle(point) {
  ctx.beginPath();
  ctx.arc(...point, BRUSH_RADIUS / 2, 0, 2 * Math.PI);
  ctx.fill();
}

function smoothCurveBetween (p1, p2) {
	const cp = p1.map((coord, idx) => (coord + p2[idx]) / 2);
	ctx.quadraticCurveTo(...p1, ...cp);
}

function smoothCurve(points) {
  ctx.beginPath();
  ctx.lineWidth = BRUSH_RADIUS;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  ctx.moveTo(...points[0]);

  for(let i = 1; i < points.length - 1; i++) {
    smoothCurveBetween(points[i], points[i + 1]);
  }

  ctx.stroke();
}

function makePoint(x, y) {
  return  [x, y];
};

function repaint () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  curves
    .forEach((curve) => {
    	ctx.strokeStyle = curve.color;
		ctx.fillStyle = curve.color;

		circle(curve[0]);
		smoothCurve(curve);
    });
}

function tick () {
	if(needsRepaint) {
		repaint();
		needsRepaint = false;
	}
	window.requestAnimationFrame(tick);
}

const trottledSendMask = throttleCanvas(sendCanvas, 1000);

function sendCanvas() {
	canvas.toBlob(function (blob) {
		connection.send(blob);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	});
}

function throttleCanvas(callback, delay) {
	let isWaiting = false;
	return function () {
		if (!isWaiting) {
			isWaiting = true;
			setTimeout(() => {
				callback();
				isWaiting = false;
			}, delay);
		}
	}
}