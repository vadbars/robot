
# Установка
У вас должен быть установлен nodejs и git

 Клонируем репозиторий
` git clone https://github.com/vikxx/robot.git`

 Переходим в директорию
` cd robot`

 Устанавливаем STEEM API
` npm install steem`

# Настройка
Настраиваем путем редакции файла `robot.js`

Логин бота
`const botname = 'robot'`

Приватный ключ ОБСУЖДАЕМОЕ 
`const wif = ''`

Сумма для уведомлений
`const ammount = '0.001 GOLOS'`

Логин автора, которого хотите поддержать
`const winner  = 'username'`

Ссылка на пост автора, которого хотите поддержать
`const post    = 'permlink'`

Размер поддержки
`const ammountw = '1.000 GOLOS'`

Примечание к платежу - оно же уведомление
`const memo = "💰 Ваш пост попал в программу поддержки качественного контента. Каждый раз, когда за вас проголосуют robot отправит вам 1 GOLOS"`



# MIT License
