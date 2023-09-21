var data = "";
const buffer = [];
var rows = [];
var r_index = 0;

var pages_parsed = 0;
var pages_to_parse = 0;
var needStop = false;
// между контактами
var minDelayContact = 300;
var maxDelayContact = 600;
//между страницами
var minDelay = 1000;
var maxDelay = 2000;
let intervalEnd;

// Создаем полупрозрачное окно
const windowContainer = document.createElement('div');
windowContainer.style.position = 'fixed';
windowContainer.style.top = '0';
windowContainer.style.right = '0';
windowContainer.style.background = 'rgba(188, 188, 188, 0.8)';
windowContainer.style.border = '1px solid #000';
windowContainer.style.padding = '10px';
windowContainer.style.zIndex = '9999';
windowContainer.style.overflow = 'scroll';
windowContainer.style.maxHeight = '400px';
document.body.appendChild(windowContainer);

// Добавляем заголовок
const title = document.createElement('h2');
title.textContent = 'Парсинг контактов';
title.style.textAlign = 'center';
windowContainer.appendChild(title);

// Добавляем поле ввода количества страниц для парсинга
const pagesInput = document.createElement('input');
pagesInput.type = 'number';
pagesInput.placeholder = 'Количество страниц';
pagesInput.style.width = '100%';
windowContainer.appendChild(pagesInput);

// Добавляем кнопку "Начать"
const startButton = document.createElement('button');
startButton.textContent = 'Начать';
startButton.style.width = '100%';
startButton.style.marginTop = '1em';
windowContainer.appendChild(startButton);

// Добавляем кнопку "Остановить"
const stopButton = document.createElement('button');
stopButton.textContent = 'Остановить';
stopButton.style.width = '100%';
stopButton.style.marginTop = '1em';
stopButton.disabled = 'disabled';
windowContainer.appendChild(stopButton);

const label1 = document.createElement('div');
label1.style.marginTop = '1em';
windowContainer.appendChild(label1);

const audio = document.createElement('audio');
audio.controls = true;
audio.style.display = 'none';

const source = document.createElement('source');
source.src = "https://www.computerhope.com/jargon/m/example.mp3";
audio.appendChild(source);
windowContainer.appendChild(audio);

const stopAudioBtn = document.createElement('button');
stopAudioBtn.textContent = 'Остановить аудио';
stopAudioBtn.style.width = '100%';
stopAudioBtn.style.marginTop = '1em';
stopAudioBtn.style.display = 'none';
windowContainer.appendChild(stopAudioBtn);


// Добавляем таблицу
/*const table = document.createElement('table');
table.style.marginTop = '1em';
table.style.maxHeight = '200px';
table.style.maxWidth = '450px';
table.style.overflow = 'auto';
table.style.borderCollapse = 'collapse';
windowContainer.appendChild(table);

// Создаем заголовок таблицы
const tableHeader = document.createElement('tr');
['ФИО', 'Описание', 'Компания', 'GEO', 'Industry','Эл. почта', 'тел.'].forEach((headerText) => {
  const th = document.createElement('th');
  th.textContent = headerText;
  tableHeader.appendChild(th);
});
table.appendChild(tableHeader);*/

// Добавляем кнопку "Скопировать в буфер"
const copyButton = document.createElement('button');
copyButton.textContent = 'Скопировать в буфер';
copyButton.style.width = '100%';
copyButton.style.marginTop = '1em';
windowContainer.appendChild(copyButton);

// Добавляем кнопку "Сохранить в файл"
const saveButton = document.createElement('button');
saveButton.textContent = 'Сохранить в файл';
saveButton.style.width = '100%';
saveButton.style.marginTop = '1em';
windowContainer.appendChild(saveButton);

startButton.addEventListener('click', () => {
	
      startButton.disabled =  true;
	  stopButton.disabled = false;
	  
	  needStop = false;
	  
	  /*let t_rows =  table.querySelectorAll('tr');
	  for( let i = t_rows-1; i >= 0; i-- ) {
		  t_rows[i].remove();
	  }*/
	  
	  pages_parsed = 0;
	  try {
		pages_to_parse = parseInt(pagesInput.value, 10);
	  } catch(e) {
		  pages_to_parse = 1;
		  pagesInput.value = 1;
	  }
	  
	  parsePage();
    });


stopButton.addEventListener('click', () => {

	needStop = true;

});


// Функция для копирования данных в буфер обмена
function copyDataToClipboard() {
  const textarea = document.createElement('textarea');
  textarea.value = buffer.join();
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  alert('Скопировано в буфер обмена!');
}

copyButton.addEventListener('click', copyDataToClipboard);

// Функция для создания и сохранения файла
function saveDataToFile() {
	
  const blob = new Blob([data.replace(/\t/gm, ";")], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  // Создаем ссылку на скачивание файла
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'contacts.csv'; // Здесь можно указать имя файла
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);

  // Имитируем клик на ссылку для скачивания файла
  downloadLink.click();

  // Удаляем ссылку после скачивания файла
  URL.revokeObjectURL(url);
}

saveButton.addEventListener('click', saveDataToFile);

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getContacts() {
	
	/*let tip = document.querySelectorAll('.apolloio-css-vars-reset.zp.zp-overlay span');
	
	let phone = '-';
	if(tip.length > 1) {
		phone = tip[1].innerText;
	}*/
	
	/*let tip = document.querySelector('.tippy-content span');
	
	let phone = '-';
	if(tip != null) {
		let phone = tip.innerText.substring(4);
	}*/
	
	let cols = rows[r_index].querySelectorAll('td');
	
	let link1 = rows[r_index].querySelector('.apollo-icon-link');
		if(link1 != null) {
			link1 = link1.parentNode.href;
		} else {
			link1 = '-';
		}
		
		let link2 = rows[r_index].querySelector('.apollo-icon-linkedin');
		if(link2 != null) {
			link2 = link2.parentNode.href;
		} else {
			link2 = '-';
		}
		
		let link3 = rows[r_index].querySelector('.apollo-icon-twitter');
		if(link3 != null) {
			link3 = link3.parentNode.href;
		} else {
			link3 = '-';
		}
		
	//data += phone + '\n';
	for(let i = 1; i < cols.length; i++) {
		data += cols[i].innerText.replace(/(\r\n|\n|\r)/gm, "").trim() + '\t';
		if(i == 2) {
			data += link1 + '\t' + link2 + '\t' + link3 + '\t';
		}
	}
	data += '\n';

	if(!buffer.includes(data)) {
		buffer.push(data);
	}
	data = '';
	
	r_index++;
	
	//let s_data = data.split('\n');
	//s_data = s_data[s_data.length-2].split('\t');
	
	/*let row = document.createElement('tr');
	
	const td1 = document.createElement('td');
	td1.innerHTML = '<a target="_blank" href="' + s_data[1] + '">' + s_data[0] + '</a>';
	
	const td2 = document.createElement('td');
	td2.innerText = s_data[2];
	
	const td3 = document.createElement('td');
	td3.innerHTML = '<a target="_blank" href="' + s_data[4] + '">' + s_data[3] + '</a>';
	
	const td4 = document.createElement('td');
	td4.innerText = s_data[5];
	
	const td5 = document.createElement('td');
	td5.innerText = s_data[7];
	
	const td6 = document.createElement('td');
	td6.innerText = s_data[6];
	
	const td7 = document.createElement('td');
	td7.innerText = s_data[8];

	row.appendChild(td1);
	row.appendChild(td2);
	row.appendChild(td3);
	row.appendChild(td4);
	row.appendChild(td5);
	row.appendChild(td6);
	row.appendChild(td7);

	table.appendChild(row);*/
	
	if(needStop) {
		startButton.disabled =  false;
		stopButton.disabled = true;
		stopAudioBtn.style.display = 'block';
		intervalEnd = setInterval(function () {
			audio.play();
		}, 10000);

		console.log(data);
		return;
	}
	
	if(r_index < rows.length) {
		setTimeout(showContacts, getRandomInt(minDelayContact, maxDelayContact));
    } else {
		pages_parsed++;
		if(pages_parsed >= pages_to_parse) {
			stopAudioBtn.style.display = 'block';
			intervalEnd = setInterval(function () {
				audio.play();
			}, 10000);
			console.log(data);
		} else {
			let nextBtn = document.querySelector('[aria-label="right-arrow"]');
			if( nextBtn != null ) {
				nextBtn.click();
				setTimeout(parsePage, getRandomInt(minDelay, maxDelay));
			} else {
				console.log(data);
				stopAudioBtn.style.display = 'block';
				intervalEnd = setInterval(function () {
					audio.play();
				}, 10000);
			}
		}
    }
}

function showContacts() {
	
	let cols = rows[r_index].querySelectorAll('td');
	
	label1.innerText = 'Страница ' + (pages_parsed+1) + ' | Позиция ' + (r_index+1);
	//console.log(data);
	
	try {
		
		let col0a = cols[0].querySelectorAll('a');
		
		let name = '';
		if( col0a.length > 0 ) {
			name = col0a[0].innerText;
		} else {
			name = '-';
		}
		
		let linked_url = '';
		if( col0a.length > 1 ) {
			linked_url = col0a[1].href;
		} else {
			linked_url = '-';
		}
		
		let link1 = rows[r_index].querySelector('.apollo-icon-link');
		if(link1 != null) {
			link1 = link1.parentNode.href;
		} else {
			link1 = '-';
		}
		
		let link2 = rows[r_index].querySelector('.apollo-icon-linkedin');
		if(link2 != null) {
			link2 = link2.parentNode.href;
		} else {
			link2 = '-';
		}
		
		let link3 = rows[r_index].querySelector('.apollo-icon-twitter');
		if(link3 != null) {
			link3 = link3.parentNode.href;
		} else {
			link3 = '-';
		}
		
		data += name + '\t' + 
				linked_url + '\t';		
				
		//console.log('Проход: ' + r_index);
		
		/*let title = cols[1].innerText.replace(/(\r\n|\n|\r)/gm, "").trim();
		
		let company_name = cols[2].querySelectorAll('a')[0].innerText;
		let company_linked_url = cols[2].querySelectorAll('a')[1].href;
		
		let contact_location = cols[4].innerText.replace(/(\r\n|\n|\r)/gm, "").trim();
		let email = cols[6].innerText.replace(/(\r\n|\n|\r)/gm, "").trim();
		let industry = cols[7].innerText.replace(/(\r\n|\n|\r)/gm, "").trim();	
		
		data += name + '\t' + 
				linked_url + '\t' +
				title + '\t' +
				company_name + '\t' +
				company_linked_url + '\t' +
				contact_location + '\t' +
				email + '\t' +
				industry + '\t';*/
		
		let btn = null;//cols[8].querySelector('a');
		if(btn != null) {
			if(btn.innerText === 'Request Mobile Number') {
				
				//console.log('Need number');
				
				btn.scrollIntoView();
		
				// Создаем новое событие mouseenter
				const mouseEnterEvent = new MouseEvent('mouseenter', {
					bubbles: true, // Разрешаем всплытие события
					cancelable: true, // Разрешаем отмену события
				});
				
				btn.dispatchEvent(mouseEnterEvent);
				btn.click();
				
				setTimeout(getContacts, getRandomInt(minDelayContact, maxDelayContact));
			} else {
				//console.log('Number exists');
				
				for(let i = 1; i < cols.length; i++) {
					data += cols[i].innerText.replace(/(\r\n|\n|\r)/gm, "").trim() + '\t';
					if(i == 2) {
						data += link1 + '\t' + link2 + '\t' + link3 + '\t';
					}
				}
				data += '\n';

				if(!buffer.includes(data)) {
					buffer.push(data);
				}
				data = '';
				
				r_index++;
				
				if(needStop) {
					startButton.disabled =  false;
					stopButton.disabled = true;
					console.log(data);
					return;
				}
				
				if(r_index < rows.length) {
					setTimeout(showContacts, getRandomInt(minDelayContact, maxDelayContact));
				} else {
					pages_parsed++;
					if(pages_parsed >= pages_to_parse) {
						stopAudioBtn.style.display = 'block';
						intervalEnd = setInterval(function () {
							audio.play();
						}, 10000);
						console.log(data);
					} else {
						let nextBtn = document.querySelector('[aria-label="right-arrow"]');
						if( nextBtn != null ) {
							nextBtn.click();
							setTimeout(parsePage, getRandomInt(minDelay, maxDelay));
						} else {
							console.log(data);
							stopAudioBtn.style.display = 'block';
							intervalEnd = setInterval(function () {
								audio.play();
							}, 10000);
						}
					}
				}
			}
		} else {
			//console.log('Number not found');
			
			for(let i = 1; i < cols.length; i++) {
				data += cols[i].innerText.replace(/(\r\n|\n|\r)/gm, "").trim() + '\t';
				if(i == 2) {
					data += link1 + '\t' + link2 + '\t' + link3 + '\t';
				}
			}
			data += '\n';

			if(!buffer.includes(data)) {
				buffer.push(data);
			}

			data = '';
			
			r_index++;
			
			if(needStop) {
				startButton.disabled =  false;
				stopButton.disabled = true;
				stopAudioBtn.style.display = 'block';
				intervalEnd = setInterval(function () {
					audio.play();
				}, 10000);
				console.log(data);
				return;
			}
			
			if(r_index < rows.length) {
				setTimeout(showContacts, getRandomInt(minDelayContact, maxDelayContact));
			} else {
				pages_parsed++;
				if(pages_parsed >= pages_to_parse) {
					stopAudioBtn.style.display = 'block';
					intervalEnd = setInterval(function () {
						audio.play();
					}, 10000);
					console.log(data);
				} else {
					let nextBtn = document.querySelector('[aria-label="right-arrow"]');
					if( nextBtn != null ) {
						nextBtn.click();
						setTimeout(parsePage, getRandomInt(minDelay, maxDelay));
					} else {
						console.log(data);
						stopAudioBtn.style.display = 'block';
						intervalEnd = setInterval(function () {
							audio.play();
						}, 10000);
					}
				}
			}
		}
		
		/*let btns = cols[3].querySelectorAll('button');
		if( btns.length > 1 ) {
			
			btn = btns[1];
		
			btn.scrollIntoView();
		
			// Создаем новое событие mouseenter
			const mouseEnterEvent = new MouseEvent('mouseenter', {
				bubbles: true, // Разрешаем всплытие события
				cancelable: true, // Разрешаем отмену события
			});
			
			btn.dispatchEvent(mouseEnterEvent);
			btn.click();
			
			setTimeout(getContacts, getRandomInt(minDelay, maxDelay));
		}	*/
	} catch (err) {
		console.log(err);
		r_index++;
		if(r_index < rows.length) {
			setTimeout(showContacts, getRandomInt(minDelayContact, maxDelayContact));
		} else {
			pages_parsed++;
			if(pages_parsed >= pages_to_parse) {
				console.log(data);
				stopAudioBtn.style.display = 'block';
				intervalEnd = setInterval(function () {
					audio.play();
				}, 10000);
			} else {
				let nextBtn = document.querySelector('[aria-label="right-arrow"]');
				if( nextBtn != null ) {
					nextBtn.click();
					setTimeout(parsePage, getRandomInt(minDelay, maxDelay));
				} else {
					console.log(data);
					stopAudioBtn.style.display = 'block';
					intervalEnd = setInterval(function () {
						audio.play();
					}, 10000);
				}
			}
		}
	}
}

function stopAuido() {
	clearInterval(intervalEnd);
	audio.pause();
	stopAudioBtn.style.display = 'none';
}

stopAudioBtn.addEventListener('click', stopAuido);

function parsePage() {
	r_index = 0;
	rows = document.querySelectorAll('tbody tr');
	if(rows.length > 0)
		setTimeout(showContacts, getRandomInt(minDelayContact, maxDelayContact));
	
}

 /*
 rows = document.querySelectorAll('tbody tr');
 cols = rows[0].querySelectorAll('td');
 btns = cols[3].querySelectorAll('button');
 btn = btns[1];
 btn.click();
 */