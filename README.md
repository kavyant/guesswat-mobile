# GuessWhatServer

GuessWhatServer is a Node/Express and MongoDB backend to support GuessWhat services.

This server currently supports facebook authentication, user management APIs.
It also includes socket.io implementation server side.

You can get started here: (http://socket.io/get-started/chat/)

Configurations
==============
Facebook related parameters of which api_key and api_secret will be kept and others would be removed as those had gone to UI side.
  facebook_api_key: "348889512354461",
  facebook_api_secret: "c6bbb372046ea8c7ad5905e0f7954636",
  callback_url: "http://localhost:3000/auth/facebook/callback",
  success_url: "http://18.214.139.12/static/guess-what/90second-play.html",
  failure_url: "/login",

Initial thought to use a separate MySQL for configurations and Facebook related things, later it was completely Mongo! Discard these parameters for now.
use_database: false,
  host: "localhost",
  username: "root",
  password: "",
  database: "", 


For mail communication i.e Sending temporary password etc.
  email: {
    server: "email.kavyant.com",
    port: 2525,
    secure: false,
	  ignoreTLS: true,
    username: "jishnu@kavyant.com",
    password: "jishnu@kavyant.com"
  }

Delta parameters for geo and gauss score
  geo_delta: 30,
  gauss_delta: 0.5,

Offline Team size 
  offlinemmsize: 20


ChangeLogs
==========
*** Please change your utils/utils.js 
From
exports.config  = require('../../configs/config')
To
exports.config  = require('../configs/config')


APIs Implemented:
http://<ip>:3000/login
http://<ip>:3000/logout
http://<ip>:3000/account
http://<ip>:3000/auth/facebook/callback
http://<ip>:3000/auth/facebook

Service: Registering User
=========================
Method: POST
URL: http://<ip>:3000/user/register 
Data: {"email":"pankaj_sql@gmail.com","password":"123456","firstname":"Quantega","lastname":"Quantega", "gender":"M", "dob": "1979-08-19"}

Service: User Login
===================
Method: POST
URL: http://<ip>:3000/user/login 
Data: {"email":"kalyan.kundu@gmail.com","password":"96a2c08d7185775721c9be88a39f6365"}

Service: User Logout
====================
Method: POST
URL: http://<ip>:3000/user/logout
Data: {"email":"kalyan.kundu@gmail.com"}

Service: Get All Users
======================
Method: GET
URL: http://<ip>:3000/user/getall
Data: {}

Service: Get User
=================
Method: GET
URL: http://<ip>:3000/user/get/:uid
Data: {uid: 1}

Service: (Generic) Update User
==============================
Method: POST
URL: http://<ip>:3000/user/update
Data: {"email":"kalyan.kundu@gmail.com","password":"96a2c08d7185775721c9be88a39f6365", "new_field_1": "new_value_1", "new_field_2": "new_value_2", ...}

Service: Check if Email already exists
======================================
Method: GET
URL: http://<ip>:3000/user/chkemail/:email
Data: {"email":"kalyan.kundu@gmail.com"}

Service: Add a user in MongoDB
==============================
Method: POST
URL: http://<ip>:3000/user/add
Data: {"email":"kalyan.kundu@gmail.com","password":"96a2c08d7185775721c9be88a39f6365","firstname":"Anil","lastname":"yadav"}

Service: Change password a User
=============================================
Method: POST
URL: http://<ip>:3000/user/changepwd
Data: {"email":"anil.yadav@gmail.com","opassword":"96a2c08d7185775721c9be88a39f6365","password":"96a2c08d7185775721c9be88a39f6365"}

Service: Change password and email of an User
=============================================
Method: POST
URL: http://<ip>:3000/user/changepwdemail
Data: {"email":"anil.yadav@gmail.com","newemail":"anil1.yadav@gmail.com","password":"96a2c08d7185775721c9be88a39f6365","npassword":"96a2c08d7185775721c9be88a39f6365"}

Service: Create a new password for user and email to the user
=============================================================
Method: POST
URL: http://<ip>:3000/user/sendpwd
Data: {"email":"anil.yadav@gmail.com"}

Service: Resets the password of an User
=======================================
Method: POST
URL: http://<ip>:3000/user/resetpwd
Data: {"email":"kalyan.kundu@gmail.com","password":"96a2c08d7185775721c9be88a39f6365"}

Service: Get User by Email
==========================
Method: POST
URL: http://<ip>:3000/user/getbyemail
Data: {"email":"kalyan.kundu@gmail.com"}

Service: Get Facebook details of an User
========================================
Method: POST
URL: http://<ip>:3000/auth/fbdetails
Data: { "id": 12484677620, "access_token": "CDRsy66XS0hKjh1uNDNWGpY1uemPQAIyzT1RpmvQCuWGeTbhkhFZUMKdOsnlKEbyGutXBtAvgZIxfyPqvtqxKKoss-7EBhOI9M2haE2MQKAgptDanl9ZjM6Ze2dIzRcyi64ntY8WjjmEHYL5Vk_Vo_nmWCJdQrLWpNKNj_qOY4FRp5OXjGojrOQqU1rPYpug82DJiBLm31qW0A-rYlNWQutV1-pKk7AC7BVvWCtKNK1ru41h9oTeKkHupVQo_BqlIykZi8ofCbCWyxv_RNQre4ctLBY5eNAo_EL5aP801SFvFskvB880KR8_DNj8jcG9urJIKWuavaE00M3UsfJrioeWRsoI7Tb7SC9ActeIulzAMQ" }

router.post('/blockusers', MatchmakerController.blockUsers)

Service: Blocks the users 
=========================
Method: POST
URL: http://<ip>:3000/matchmaker/blockusers
Data: { "emails": [ "kalyan.kundu@gmail.com", "kalyan@gmail.com" ], "email": "arpit@quantega.com" }

Service: Add a match making word
================================
Method: POST
URL: http://<ip>:3000/matchmaker/addword
Data: {"type": "movie", "level": 1, "word": "test", "id": 100}

Service: Get match making word for players
==========================================
Method: POST
URL: http://<ip>:3000/matchmaker/reqword
Data: { "emails": [ "kalyan.kundu@gmail.com", "kalyan@gmail.com" ], "type": "movie", "level": 1 }

Service: Get all levels (Misc. type) match making word for 2 players
====================================================================
Method: POST
URL: http://<ip>:3000/matchmaker/reqallmiscwords
Data: { "emails": [ "kalyan.kundu@gmail.com", "kalyan@gmail.com" ] }

Service: Add the hint for a word
================================
Method: POST
URL: http://<ip>:3000/matchmaker/addhint
Data: {"hint": "hint 123", "id": 2, "w_id": 100}

Service: Get the next hints for a word
======================================
Method: POST
URL: http://<ip>:3000/matchmaker/nexthint
Data: { "w_id": 200043, "id": 2 }

Service: Online match making
============================
Method: POST
URL: http://<ip>:3000/matchmaker/onlinemm
Data: { "email": "kalyan.kundu@gmail.com", "level": 1 }

Service: Offline match making
=============================
Method: POST
URL: http://<ip>:3000/matchmaker/offlinemm
Data: { "email": "kalyan.kundu@gmail.com", "level": 1 }

Service: (MaxMind) Get City by IP Address
=========================================
Method: POST
URL: http://<ip>:3000/matchmaker/citybyip
Data: { "ip": "100.101.102.103" }

Socket.io events
=======================================================
1. "/" : DEFAULT NAMESPACE

EVENTS = { } 

2. "/arenas" : ARENAS NAMESPACE

EVENTS = { 'create_arena', 'update_arenas_list' }

3. "/selection" : SELECTIONARENA NAMESPACE

EVENTS = { 'selectionarena', 'updateUsersList', 'saveteamdata' }

4. "/90sec" : 90SEC NAMESPACE

EVENTS = { 'join90secroom', 'updatechat', 'load90secroom' }

5. "/catchphrase" : CATCHPHRASE NAMESPACE

EVENTS = { 'joincatchphraseroom', 'updatechat', 'loadcatchphraseroom' }

6. "/password" : PASSWORD NAMESPACE

EVENTS = { 'joinpasswordroom', 'updatechat', 'loadpasswordroom'  }


