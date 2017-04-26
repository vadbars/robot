const util = require('util')
const Promise = require("bluebird")
const _ = require('lodash')
const golos = require('steem')
golos.config.set('websocket','ws://localhost:9090');
// На серверах без ноды голоса или steem указывайте адрес публичной ноды
// Например wss://ws.golos.io
// Настройки ниже определяют к какому блокчейну вы намерены подключится. Уберите 2 строки ниже, что бы использовать бота для стим
golos.config.set('address_prefix','GLS');
golos.config.set('chain_id','782a3039b478c839e4cb0c941ff4eaeb7df40bdd68bd441afd444b9da763de12');

// Логин бота
const botname = 'robot'

// Приватный ключ ОБСУЖДАЕМОЕ 
const wif = ''

// Сумма для уведомлений
const ammount = '0.001 GOLOS'

// Логин автора, которого хотите поддержать
const winner  = 'username'

// Ссылка на пост автора, которого хотите поддержать
const post    = 'permlink'

// Размер поддержки
const ammountw = '1.000 GOLOS'

// Примечание к платежу - оно же уведомление
const memo = `💰 Ваш пост попал в программу поддержки качественного контента. Каждый раз, когда за вас проголосуют robot отправит вам 1 GOLOS`


// Небольшой фикс для обработки несуществующих блоков
let trig = {
	existBlock:true
	// можно добавить другие триггеры для обработки ошибок
}


// Получение глобальных динамических данных
const dynamicSnap = new Promise((resolve, reject) => {
    golos.api.getDynamicGlobalProperties((err, res) => {
        if (err) {
        console.log(err)
		}
        else {
            resolve(res)
        }
    })
})


// Получение номера последнего блока
const FIRSTBLOCK = n => n.head_block_number

// Достаем операции из транзакций
const OPS = (ops) => {
    return _.flatten(ops.transactions.map(tx => tx.operations))
}

// Фильтруем операции и обрабатываем каждую по своему
const OPSFILTER = (operation) => {
const [type, data] = operation

// Опознаем операцию голосов
	if (type === 'vote') { 
	// Если голосуют за автора, которого поддерживаем...
	if (data.author === winner) {
		// Вы так же можете добавить && data.author === post что бы бот учитывал голоса только за определенный пост
		// Отправляем ему донат с примечанием
		golos.broadcast.transfer(wif, botname, winner, ammountw, memo,
						 function(err, result) {console.log(err, result);});
						}
			}
				
	// Если подписка, отписка, игнор или реблог			
    if (type === 'custom_json') {
	if(typeof data.json !== 'undefined'){
		const initiator = data.required_posting_auths;
        const reblogData = JSON.parse(data.json);
		
		
		if  (reblogData[0] === 'reblog') {
          // Фильтруем аккаунты бизнес молодлсти и тех, кто отписался от рассылки
           if(!reblogData[1].author.includes('bm-') && reblogData[1].author !=="oxisunbeam"){
			
			console.log(`@${initiator} сделал репост ${reblogData[1].permlink} `)
            // Отправляем уведомление о реблоге
			golos.broadcast.transfer(wif, botname, reblogData[1].author, ammount, `⚡ @${initiator} сделал репост вашей записи 👉 ${reblogData[1].permlink}`, function(err, result) {
                	  console.log(err, result);
                	});
        
			}
		
		
		} 
		// Если операция подписки, отписки, блока
        else if (reblogData[0] === 'follow') {
			
			const data = reblogData[1].what[0];
			const user = reblogData[1].following;
			
			if(!user.includes('bm-') && user !=="oxisunbeam"){
			
			// Детектим игнор
			if (data === 'ignore'){
				console.log(`@${initiator} добавил в игнор  ${reblogData[1].following}`)
            golos.broadcast.transfer(wif, botname, user, ammount, `🚩 @${initiator} добавил вас в игнор`, function(err, result) {
                	  console.log(err, result);
                	});
				
			}
			// Детектим подписку
			else if(data === 'blog'){
				
				console.log(`@${initiator} подписался на  ${reblogData[1].following}`)
            golos.broadcast.transfer(wif, botname, user, ammount, `👍 @${initiator} подписался на ваш блог!`, function(err, result) {
                	  console.log(err, result);
                	});
			}
			// В ином случае это отписка
			else {
				console.log(`@${initiator} ОТПИСАЛСЯ на  ${reblogData[1].following}`)
            golos.broadcast.transfer(wif, botname, user, ammount, `❗ @${initiator} отписался от вашего блога`, function(err, result) {
                	  console.log(err, result);
                	});
				
			}
			
		 }
        }
    }
	}
	
	// Определяем операцию размещения поста или комментария
    if (type === 'comment') {
    // Если Вы не хотите отправлять уведомления об упоминаниях во время редактирования контента
	// Проверяйте пост вызовом golos.get_content('Логин','Ссылка', function(err, result) {}); и сравнивайте время публикации и редактирования поста
	// let isNew = Date.parse(result.last_update) < Date.parse(result.create); 
	// if(isNew){ /*    */}
	const metaData = JSON.parse(data.json_metadata)
	if (typeof metaData.users !== 'undefined') {
	// Если хотим игнорировать стороние приложения: 
	//&& metaData.app !== "habreplicator"
	// Или если хотим игнорировать определенных пользователей, например bm аккаунты
	//if (metaData.users[0].length > 1 && !metaData.users[0].includes('bm-') && metaData.users[0] !=="oxisunbeam") {}
                console.log(`@${metaData.users[0]} найден тут @${data.author}${data.permlink}`)
                	golos.broadcast.transfer(wif, botname, metaData.users[0], ammount, `💡 @${data.author} упомянул вас в сообщении  https://golos.io/@${data.author}/${data.permlink} `, function(err, result) {
                	  console.log(err, result);
                	});
            
        }
        

    }
}

// Получение данных каждого блока
const SENDBLOCK = currentblock => {
    golos.api.getBlock(currentblock, (err, result) => {
  		if (err) {
            console.log(err)
        } 
		else if (result === null){
			// Если блок не существует активируем триггер 
					trig.existBlock = false
				}
        else {
			// Если блок существует и не было ошибки - отправляем блок в функцию фильтра операций
			OPS(result)
			.forEach(OPSFILTER)
			trig.existBlock = true
			
		}
	
    })
}

// Определяем стартовый блок на начало работы скрипта
// Каждые 3 секунды увеличивае номер блока на 1
const NEXTBLOCKS = firstblock => {
    let currentblock = firstblock
    setInterval(() => {
		// Увеличиваем только если предыдущий блок был корректно обработан
		if(trig.existBlock){
					currentblock++
				}
		SENDBLOCK(currentblock)
         
    }, 3000)
}

// Запускаем основные функции через обещания (promises)

dynamicSnap
    .then(FIRSTBLOCK)
    .then(NEXTBLOCKS)
    .catch(e => console.log(e));
