
//xr lounge
//creates a player object out of a bot object and overloads with lounge specific functions

//uses loungeScreen to push stuff on screeen
//gets var dekkaID='5013b540528b1'; var myuID='U4a116d952c922'; var timestamp='1343471022'; var jDebug=; var dekkaLocation ="lounge";
//should get _me with everything about me,me,me





$(document).ready(function () {

	//read me

	_me = jQuery.parseJSON(_me);


	//screen things

	_lounge = new _lounge();

	//stage botIO

 	_botIO = new _botIO();
 	//init and push urls etc
 	_botIO.init();
 	
	//create our user



	var botso = {}
	botso[0] = {};
	//botso[1] = {};
	var gun = _me;

	botso[0].email =_me.public.pcemail;
	botso[0].password =_me.private.password;
	botso[0].handle = _me.public.fullname;
	botso[0].akey = _me.private.sessionkey;
	botso[0].timestamp = _me.timestamp;

	//botso[1].email ='narrator@a.us';
	//botso[1].password ='lebo';
	//botso[1].handle ='narrator';

	//var timestamp = 0;
	//var email = 'dude@a.us';
	//var password ='lebo';
	//var name ='dude';


	jQuery.each(botso,function(){

		this.bot = new _botcore(0,this.email,this.password,this.handle);
		this.bot.channel = 'lounge';
		this.bot.botType ='loungeuser';
		this.bot.timestamp = this.timestamp;
		this.bot.broadcastOnlinersNow = false;	//force broadcasting onliners on channel
		this.bot.pendingGames = {};
		
//var dialoguebot = new _botcore(0,email,password,name);

//set to loung

//dialoguebot.channel ='lounge';

_botIO.loginHook = this.bot.loginHook;
_botIO.botso = botso;

//overload dialoguebot

this.bot.processMessage_channelInvite = function (dataObj) {

	
	this.debuMess('processMessage_channelInvite');
	
	this.debuObj(dataObj);

	//throw this person to gameroom

	window.location.href = '/lounge/gameroom/gameID/'+dataObj.gameID;

	return;


};	//end processMessage_channelInvite

this.bot.processMessage_newGameObject = function (dataObj) {

	
	this.debuMess('processMessage_newGameObject');
	
	this.debuObj(dataObj);

	return;


};	//end processMessage_newGameObject

this.bot.processMessage_allPendingGames = function (dataObj) {

	var bot = this;

	this.debuMess('processMessage_allPendingGames');
	//games
	
	if (dataObj.games!==undefined) {

		jQuery.each(dataObj.games,function(){

			var matched = bot.matchUserIDusername(this.announcedPlayers,bot);
			//copy idname pair
			this.announcedPlayers =matched;



		});
		

	}

	this.debuObj(dataObj);
	
	return;


};	//end processMessage_allPendingGames

this.bot.processMessage_allActiveGames = function (dataObj) {

	var bot = this;

	this.debuMess('processMessage_allActiveGames');
	//games
	
	if (dataObj.games!==undefined) {

		jQuery.each(dataObj.games,function(){

			var matched = bot.matchUserIDusername(this.announcedPlayers,bot);
			//copy idname pair
			this.confirmedPlayers =matched;



		});
		

	}

	this.debuObj(dataObj);
	
	return;


};	//end processMessage_allActiveGames


this.bot.processMessageonliners = function (dataObj) {

	if (this.initialUserPrime===false) { 

		this.debuMess('initialUserPrime not done');

		return false; }

	var bot = this;

	this.debuMess('processMessageonliners');
	//users
	if (dataObj.users!==undefined) {

		var matched = this.matchUserIDusername(dataObj.users,bot);
		this.debuObj(matched);
		return;

	}

	this.debuObj(dataObj);

	return;


};	//end processMessage_allActiveGames

this.bot.pullUsers = function (users) {

	var bot = this;
	
	if (length(users)===0) { return false; }

	//do json this.htmlroot+
		$.post( "/users/read/akey/"+ this.akey , {users: users } , function(data){
	
		//$.getJSON( "/tweeter/say/p/"+channel+"/akey/"+ akey +"/text/"+message , function(data){
	
					
						var rep = {};

					if ( data === null) { 
					
						rep.error = 'noData';
						return rep;
					
					}
					
					if ( data.error !== undefined) {
						
						rep.error = data.error;
						
						if ( data.errorText !== undefined) {

							rep.errorText = data.errorText;
						}	

						//bitroster[bid].blaa..
						//bot.sayObjectHook(rep);
						return false;

					}

					if (data.users!==undefined) {

						bot.users.prime(data.users);
						bot.debuMess('primed users');
						bot.initialUserPrime = true;
						return true;


					}
					

				});


		return true;

}



this.bot.broadcastOnliners = function (channel) {

			this.debuMess('broadcastin onliners @ '+channel);

			//default channel
			if (channel===undefined) { channel = this.channel; }

			var o = {};
			o.type = 'onliners';
			var x = this.tags.readTaggedAs('users','online');
			o.users = x;
						
			//test sayobject
			this.sayObject(o,channel);




}	//end broadcast onliners

this.bot.pollTraffic = function () {

	var bot = this;

	$.getJSON( _botIO.htmlroot+"/tweeter/trafficbot/l/NULL"+'/akey/'+bot.akey , null,
					
					function(data){
					

						if (bot.isOnline(bot.akey,bot.timestamp)===false) { return false; }
						var rep = {};

					if ( data === null) { 
					
						rep.error = 'noData';
						return rep;
					
					}
					
					if ( data.error !== undefined) {
						
						rep.error = data.error;
						
						if ( data.errorText !== undefined) {

							rep.errorText = data.errorText;
						}	

						//bitroster[bid].blaa..
						dialoguebot.loginHook(rep);
						return false;

					}

					if (data.users!==undefined) {

						var pullTheseUsers = {};

						//so we got the line
						//print it on debug and say it

						//bot.debuMess(bot.handle+': <red>'+data.line+'</red>');
						jQuery.each(data.users, function (){ 

								var handle = this.userID;
								if (bot.users.users[this.userID]!==undefined) { handle = "*"+bot.users.users[this.userID].public.fullname; }

								//loop people
								if (this.type==='logout') {
									//namespace, objectID, tag


									if (bot.tags.isTaggedAs('users',this.userID,'online')===true) {

										bot.debuMess('user '+handle+' logged out @ '+this.timestamp);
									}

									bot.tags.unTag('users',this.userID,'online');

								}	

								if (this.type==='login') {
									//namespace, objectID, tag
									if (this.timestamp > (bot.timestamp-10000) ){
									

										if (bot.tags.isTaggedAs('users',this.userID,'online')===false) {

											bot.debuMess('user <a onclick="messageUser(\''+this.userID+'\')">): '+handle+'</a> logged in @ '+this.timestamp);
									
										}


										bot.tags.tag('users',this.userID,'online');

										if (bot.users.users[this.userID] === undefined) { 

											var x = {};
											x[this.userID]=this.userID;
											pullTheseUsers[this.userID] = x;

										}
									}
									
								}	


						});
						//bot.debuObj(pullTheseUsers);
						bot.pullUsers (pullTheseUsers);
						
						//ask daniel to join my channel
						var user = {};
						user.fullname ='daniel';
						_botIO.directInvite(bot,bot.channel,user);

						//var m = bot.tags.readTaggedAs('users','online');
						//bot.debuObj(m);

						return;		

					}
					
				});



}	//overloading function pollDialogue

this.bot.pollChannelTraffic = function (channel) {

	var bot = this;
	if (channel===undefined) { channel = bot.channel; }

	$.getJSON( _botIO.htmlroot+"/tweeter/trafficbot/l/"+channel+'/akey/'+bot.akey , null,
					
					function(data){
					

						if (bot.isOnline(bot.akey,bot.timestamp)===false) { return false; }
						var rep = {};

					if ( data === null) { 
					
						rep.error = 'noData';
						return rep;
					
					}
					
					if ( data.error !== undefined) {
						
						rep.error = data.error;
						
						if ( data.errorText !== undefined) {

							rep.errorText = data.errorText;
						}	

						//bitroster[bid].blaa..
						dialoguebot.loginHook(rep);
						return false;

					}

					if (data.users!==undefined) {

						//so we got the line
						//print it on debug and say it

						//bot.debuMess(bot.handle+': <red>'+data.line+'</red>');
						jQuery.each(data.users, function (){ 

							var handle = this.userID;
							if (bot.users.users[this.userID]!==undefined) { handle = "*"+bot.users.users[this.userID].public.fullname; }


								if (this.type==='enter') {
									//namespace, objectID, tag
									if (this.timestamp > (bot.timestamp-10000) ){
									

										if (bot.tags.isTaggedAs('users',this.userID,'onchannel'+data.channel)===false) {

										bot.debuMess('user '+handle+' entered to <a onclick="messageUser(\''+data.channel+'\')"> '+data.channel+'</a> in @ '+this.timestamp);
										
										//saying something on channel automatically enters

										bot.broadcastOnliners(data.channel);

										}


									//store previous channel into user object if it exists
										if (bot.users.users[this.userID] !== undefined) { 

											if (bot.users.users[this.userID].lastChannel !== undefined) { 

												bot.tags.unTag('users',this.userID,'onchannel'+ bot.users.users[this.userID].lastChannel);

											}

												bot.users.users[this.userID].lastChannel = data.channel;

										}	//if we have it

										bot.tags.tag('users',this.userID,'onchannel'+data.channel);
									}
									
								}	


						});

						/*
						var o = {};
						o.type = 'onliners';
						var x = bot.tags.readTaggedAs('users','online');
						o.users = x;
						
						//test sayobject
						bot.sayObject(o,bot.channel);
						
						*/
						//var m = bot.tags.readTaggedAs('users','online');
						//bot.debuObj(m);

						return;		

					}
					
				});



};	//overloading function pollDialogue

this.bot.dialogueMess = function (message) {

	$("#dialoguePane").prepend(message+'<br/>');

	

};


this.bot.channelTalkHandler = function(message){

	//gets say messages from people

	$("#dialoguePane").prepend(message.data+'<br/>');

};	//end of channelTalkHandler

//main loop polls for dialogue

//overload process messages to send user lists and shit

this.bot.processMessage_gameApprove = function (dataObj) {

	var bot = this;
	var handle = bot.handle;
	//is this for moi? PROBLEM: this should end in bot initiators and accepters pending games
	//if (dataObj.game.to!==bot.userID) { return false; }
	
	//i can approve my own invitation
	//invited can approve invitation

	bot.debuMess('_gameApprove got');
	bot.debuObj(dataObj);


	if (dataObj.game.timestamp < bot.initiated) {

		//this.debuObj(dataObj.game);
		this.debuMess('got deprecated _gameApprove gameObj '+dataObj.game.gameID+' : game.timestamp '+dataObj.game.timestamp +'/ bot.initiated '+bot.initiated+' . ignoring ');
		return false;

	}


	//im not invited. am I the inviter?
	if (dataObj.game.to!==bot.userID) {

		if (dataObj.game.announcedPlayers[bot.userID]===undefined) {

			//this game has nothing to do with me
			bot.debuMess('got a _gameApprove to a game im ('+bot.userID+') no part of. skipping..');
			return false;
		}

		bot.debuMess('_gameApprove. this game i initiated. im putting its gameID ('+dataObj.game.gameID+') on my pending games. <a onclick="findMyGame(\''+bot.handle+'\',\''+dataObj.game.gameID+'\');">FIND</a>');
		bot.pendingGames[dataObj.game.gameID] = dataObj.game;

		return true;
	}

	
	var initiatedBy = bot.users.users[dataObj.game.initiatedBy];

	if (initiatedBy===undefined) { 

		bot.debuMess('got _gameApprove from unknown user. bailing outta.');
			return false;
	}
	
	//if (initiatedBy===dataObj.game.initiatedBy) { return false; }


	//am i involved in an unconfirmed game


	//here the player would be given a accept decline

	//lets just accept this game
	
	bot.pendingGames[dataObj.game.gameID] = dataObj.game;

	dataObj.game.announcedPlayers[bot.userID]=bot.userID;

	//this is for trafficbot now
	dataObj.game.gameTo = dataObj.game.overseer;

	var mess = 'thanks '+initiatedBy.public.fullname+' i will join now';	
	bot.debuMess(mess +' @'+bot.channel);

	bot.privateSay(bot,mess,bot.channel,dataObj.game.initiatedBy);

	bot.say(bot,mess);

	var m = {};
	m.type ='_gameJoin';
	m.game = dataObj.game;
	m.from = bot.userID;
	m.to = dataObj.game.initiatedBy;
	
	bot.debuMess('game ('+dataObj.game.gameID+') came with _gameApprove , broadcasting _gameJoin to trafficbot @'+bot.channel);

	bot.sayObject(m,bot.channel);

	bot.playingZombiary = true;

	return true;

	



};

this.bot.processMessageprivateMessage = function (message) {

	if (message.recipientUserID!==this.userID) { return false; }

	this.debuMess(this.readUserName(message.senderUserID)+' privately says <b>"'+message.message+'"</b> to you');

	//this.debuObj(message);


};	//end of processMessageprivateMessage


this.bot.processMessagesZ = function (messages){
	

	this.debuMess('precessing with dial');

	//return;
	var bot = this;

	var timestamp = this.timestamp;
	var announcedMyPresence = false;

    	jQuery.each(messages, function(){

    		this.timestamp = parseFloat (this.timestamp);

		if (bot.timestamp >= this.timestamp) { 



		//skip old messages

			return;

		}

		if (this.type==='logout') {

            }   else {

                //tag him logged in 
                bot.tags.tag('users',this.userID,'online');
                //tag him onchannel
                bot.tags.tag('users',this.userID,'onchannel'+this.access);
                
                //bot.debuMess('user '+this.fullname+' ('+this.userID+') is online @ '+this.access);

            }

		if (this.type==='say') {

			//tag this person as online

			if (bot.tags.isTaggedAs('users',this.userID,'online')===false) {

					bot.debuMess('user <a onclick="messageUser(\''+this.userID+'\')">): '+this.userID+'</a> tagged online @ '+this.timestamp);
									
					}

			bot.tags.tag('users',this.userID,'online');





			if (bot.timestamp<this.timestamp) {

				bot.timestamp = this.timestamp;


    			}

    		}

    		if (this.type==='enter') {

    			bot.debuMess ('user '+this.fullname+' enters and starts to sing about gold @channel:'+this.access);


    			//tell onliners

    			this.broadcastOnlinersNow = true;


    			if (bot.handle==='narrator') {
							
							
							

				speak(this.fullname+' enters', { amplitude: 180, wordgap: 0, pitch: 55, speed: 160 });
							

						} 

    			//somebody enters. tell him i'm here too
    			if (announcedMyPresence===false) {
    				
    				bot.say(bot,'im ('+bot.handle+') here too',bot.channel);
    				announcedMyPresence = true;
    			}	

    			if (bot.timestamp<this.timestamp) {

    				bot.timestamp = this.timestamp;

    			}

    		}	//end of enter

    		if (this.type==='login') {

    			bot.debuMess ('user '+this.fullname+'logged in @channel:'+this.access);
    			
    			//somebody enters. tell him i'm here too
    			if (announcedMyPresence===false) {
    				
    				bot.say(bot,'im ('+bot.handle+') here too',bot.channel);
    				announcedMyPresence = true;
    			}	

    			if (bot.timestamp<this.timestamp) {

    				bot.timestamp = this.timestamp;

    			}

    		}


    	});

    	
    	return;

     }	//end of processMessages


this.bot.mainLoop = function() {

	//Lounge user mainloop, just observe whos on

	//if im sleeping, sleep and ignore
	if (this.isOnline(this.akey,this.timestamp)===false) { return false; }

	var bot=this;
	//if im sleeping, sleep and ignore
	if (this.isOnline(this.akey,this.timestamp)===false) { return false; }

	//push all messages out
	try {var flusher = this.connection.flush();
	status = new Strophe.Builder("presence").c("status").t("be right back").up().c("show").t("away"); 
	bot.connection.send(status);}catch(e){}

	//process bubbered messages, baby
	if (bot.eventBuffer.length!== 0) {

			while(bot.eventBuffer.length!== 0) {
            
            var evo = bot.eventBuffer.shift();

            bot.processEvent(evo);
        	}

        }


       //clear dup tables
	
	if (bot.eventBuffer.length=== 0) {
     
        bot.processEventsFinalize();
    }


	/*
	if (this.broadcastOnlinersNow===true) {

		this.broadcastOnliners();

		this.broadcastOnlinersNow = false;
	}*/

	//pollDialogue handles saying if theres something coming
	//this.pollTraffic();

	//check whos on my channel
	//this.pollChannelTraffic();


	//this.debuMess('i am '+this.userID+' with key '+this.akey +' @'+this.timestamp);
	/*if (this.channel!=='') {


		this.listenChannel();

	}*/

	//gimme gimme my users data
	if (this.trafficBotContacted===false) { this.askTrafficbotForUserIDs(); }

	//If we got onliners, make sure they show

	this.updateLoungeScreen();


}	//end of main loop

this.bot.updateLoungeScreen = function () {

	//check who is onliney
	var onliners = this.tags.readTaggedAs('users','online');
	if (length(onliners)===0) {  return; }

	jQuery.each(onliners,function(uID,u) {

		var user = _users.users[uID];

		var mu ="#uid"+uID;
		if($(mu).length!==0) { return; }

		_lounge.addUserToLounge(user);


	});

}


/*
dialoguebot.startMainLoop = function () {

	var m = this;
	//function (){
	//	m.mainLoop();
	//}
	setInterval(function (){
		m.mainLoop();
	},1000);

}
*/

	//this bot needs tag to keep track of people
	
	this.bot.init();
	
	//log me in
	this.bot.login();

	//run it after a pause
	this.bot.startMainLoop();
	this.bot.heartbeat = 5000;

	this.bot.trafficBotContacted = false;

	});	//end looping initialized bots


	//DO THINGS WITH BOTS


	//kick in da jamz
	//var jab = setInterval(dialoguebot.mainLoop(),500);

	
	messageUser = function (userID) {

	var trix = botso;

	v = prompt('sanottavanne ');
	//browse thru bots

	if (v===null) {return false};
	jQuery.each(botso, function (){

		//loops all bots. has no meaning here.

		var user= this.bot.users.users[userID];

		if (user.private.contractType==='zombiaryBot') {

			this.bot.debuMess('botsaid: "'+v+'" to channel '+this.bot.channel,userID);
			this.bot.say(this.bot,v,this.bot.channel,userID);
			return;
		}

		


		this.bot.privateSay(this.bot,v,this.bot.channel,userID);
		this.bot.debuMess('privatesaid: "'+v+'" to channel '+this.bot.channel,userID);
		return;

		if (this.bot.handle===handle) {

			if (this.bot.timestamp!==false) {

				//toggle me off
				this.bot.logout();

				//run it after a pause
				this.bot.startMainLoop();

				return true;

			} else {


				this.bot.login();

				//run it after a pause
				this.bot.startMainLoop();

				return true;

			}

			return false;

		}



	});	
	//if online, toggle offline



}	//end of messageUSer helper

inviteToGame = function (userID) {

		//talk to trafficbot

		jQuery.each(botso, function (){


			var user= this.bot.users.users[userID];

			if (user.private.contractType!=='zombiaryBot') {

					this.bot.privateSay(this.bot,'mie täälä vähän sinua invitoin!',this.bot.channel,userID);
					this.bot.debuMess('privatesaid: "mie täälä vähän sinua invitoin!" to channel '+this.bot.channel,userID);

			}

			var boggo = this.bot;

			this.bot.inviteToGame(boggo,userID);

		});


		
	}


	
	toggleBot = function (handle) {

		var trix = botso;

	//browse thru bots

	jQuery.each(botso, function (){

		var boggo = this.bot;

		if (this.bot.handle===handle) {

			if (this.bot.timestamp!==false) {

				//toggle me off
				this.bot.logout();

				//show onliners
				var o = {};
				o.type = 'onliners';
				var x = this.bot.tags.readTaggedAs('users','online');
				o.users = x;

				jQuery.each(x,function(key,val){

					
					var n = boggo.users.users[key];
					if (n!==undefined) {

						boggo.debuMess(n.public.fullname+' online reg ');

					}

				});		

				//this.bot.debuObj(o);
				delete (o);

				var o = {};
				o.type = 'idle';
				var x = this.bot.tags.readTaggedAs('users','idle');
				o.users = x;

				jQuery.each(x,function(key,val){

					
					var n = boggo.users.users[key];
					if (n!==undefined) {

						boggo.debuMess(n.public.fullname+' idle reg ');

					}

				});		

				//this.bot.debuObj(o);



				//run it after a pause
				//this.bot.startMainLoop();

				return true;

			} else {


				this.bot.login();

				//run it after a pause
				this.bot.startMainLoop();

				return true;

			}

			return false;

		}



	});
	//if online, toggle offline



}	//end of toggleBot helper




});	//end onload










