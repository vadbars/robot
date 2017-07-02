
# Установка
У вас должен быть установлен nodejs и git

 Клонируем репозиторий
 
` git clone https://github.com/vadbars/wikibot.git`

 Переходим в директорию
 
` cd wikibot`

 Устанавливаем STEEM API
 
` npm install steem`

# Настройка
Настраиваем бота путем редакции файла `robot.js`

Логин бота

`const botname = 'wikibot'`

Приватный ключ (ОБСУЖДАЕМОЕ с golos.io) 

`const wif = '5...'`

Сумма для уведомлений

`const ammount = '0.001 GOLOS'`

Логин автора, которого хотите поддержать

`const winner  = 'username'`

Ссылка на пост автора, которого хотите поддержать

`const post    = 'permlink'`

Размер поддержки

`const ammountw = '0.001 GOLOS'`

Примечание к платежу - оно же уведомление

`const memo = "💰 Ваш пост попал в программу тестирования wikibot. Никаких действий от вас не требуется. Спасибо!"`



# MIT License
