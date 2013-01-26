

//botcore has all the basic functionality a bot should have
//login,logout, join channel,say

//making a dialoguebot goes like this
//diabot = _botcore()
//then massa overloading for whatever the specific bot should be able to do
//botcore uses botIO for communication with server. jsonmessages, ejabberd


_botcore = function (timestamp,email,password,handle,rootUrl) {
     var cc = this;
     cc.email=email;
     cc.password=password;
     cc.akey = false;
     cc.timestamp = timestamp;
     cc.handle = handle;
     cc.heartbeat = 2000;
     cc.channel = '';
     cc.botType = '';
     cc.processedEjabMessages = [];
     cc.roster = {};
     cc.eventBuffer = [];
     cc.eventDupBuffer = [];
     cc.trafficBotHandle;
     cc.initialUserPrime = false;   //allow some stuff when users have been primed

     cc.rootUrl = rootUrl;  //z.com/contr/view


     //maybe give a different channel to alphapeepz
     cc.loungeChannel ='lounge';

     this.debuMess = function (message) {
     	
		//var now = Math.round(new Date().getTime() / 1000);
		//var now = new Date().getTime();
		
        var now = new Date();
        
        var h = now.getHours();
        var m = now.getMinutes();
        var s = now.getSeconds();

		var r = '<prze>botcore(<a onclick="toggleBot(\''+this.handle+'\');">): '+this.handle+'</a> ('+h+':'+m+':'+s+') '+ message+'</prze><br/>';

		var botDebugWindow = '#'+this.handle;

		if( $(botDebugWindow).length===0) {

			$('#Ddebug').prepend('<div id="'+this.handle+'" class="botDebugWindow"></div>');
		
		}

		$(botDebugWindow).prepend(r);
									
	};
     
    this.debuObj = function (obj) {
     	
    	//var now = Math.round(new Date().getTime() / 1000);
    	var now = new Date().getTime();
    	
        var botDebugWindow = '#'+this.handle;

    	var m = '<pre>botcore: '+'('+now+')'+ objDump(obj)+'</pre>';
    	$(botDebugWindow).prepend(m);
    								
    };

    this.init = function(rootUrl) {

        this.tags = _tags;
        this.users = _users;

        this.debuMess('initializing botcore with '+rootUrl);

        //prepare debug win
        $('#Ddebug').append('<div id="'+this.handle+'" class="botDebugWindow"></div>');

        if (rootUrl!==undefined) {

            this.rootUrl = rootUrl;

        } else {

            this.rootUrl = readRootUrl();

        }


        this.initiated = microtime(); //new Date().getTime();
    }

    this.login = function () {


    	//try to login
    	
    	var bot = this;
    	var a = _botIO.login(bot,this.email,this.password);

    	
    }

    this.loginHook = function (a) {

    	if (a.error!==undefined) { 

    		this.timestamp = 0;
    		this.debuMess('Login error: '+a.error);

    		if (a.errorText!==undefined) {

				this.debuMess('Login errorText: '+a.errorText);
    			
    		}

    		return false;

    	}

    	//we are logged in

    	this.akey = a.akey;
    	this.userID = a.userID;
    	this.timestamp = a.timestamp;

    	
    	this.debuMess('logged is as '+a.userID+' with key '+a.akey +' @'+a.timestamp);

    	//try to enter a channel

    	var bot = this;

    	this.enter(bot.channel );

    	return true; 

    } 	//ajax callback for login


    this.logout = function () {


    	//try to login
    	
    	var bot = this; 

    	_botIO.logout(bot);
           
        //ask for onliners when relogging    
        bot.trafficBotContacted = false;
        bot.playingZombiary = false;

        bot.processedEjabMessages = [];

    	return;

    	
    }

    this.logoutHook = function (a) {

    	if (a.error!==undefined) { 

    		this.timestamp = 0;
    		this.debuMess('Logout error: '+a.error);

    		if (a.errorText!==undefined) {

				this.debuMess('Login errorText: '+a.errorText);
    			
    		}

    		return false;

    	}

    	var bot = this; 

    	this.debuMess('logged out '+this.handle);

    	bot.timestamp = false;
    	clearInterval(bot.mainloopTimer);
    	delete (bot.mainloopTimer);


    	

    	return true; 

    } 	//ajax callback for logout

    this.reboot = function (booterID){

        var bot = this;
        //reboot bot. in dialoguebots case, kills all bots
        this.debuMess('command _reboot got. rebooting..');

        if (booterID!==undefined) {

            bot.privateSay(bot,'command _reboot got. rebooting in 5 secs..',bot.channel,booterID);

        }

        bot.say(bot,'going offline and rebooting in 5 seconds');
        bot.logout();
        setTimeout(function(){history.go(0);},5000);


    };  //end of reboot

    this.isOnline = function (akey,timestamp) {

        //if we got ejabd, check status
        if (this.connection!==undefined) { 
            if (this.connection.connected!==true) { return false; }
        }

    	if (akey === false) { return false; }
		if (timestamp === 0 ) { return false; }
		if (timestamp === false) {return false; }
		//compare timestamps

		return true; 

    } 

    this.DEPlogout = function () {

    	return;

    	//try to login
    	var a = _botIO.logout(this.email,this.akey);

    	if (a.error!==undefined) { 

    		this.timestamp = 0;
    		this.debuMess('Logout error: '+a.error);

    		if (a.errorText!==undefined) {

				this.debuMess('Logout errorText: '+a.errorText);
    			
    		}

    		return false;

    	}

    	//we are logged in

    	this.akey = false;
    	this.timestamp = 0;

    	return true;

    }

     this.enter = function (channel) {


    	//try to login
    	
    	var bot = this;
    	var a = _botIO.enter(bot,channel);

    	
    }

    this.enterHook = function (a) {

    	if (a.error!==undefined) { 

    		this.timestamp = 0;
    		this.debuMess('enter error: '+a.error);

    		if (a.errorText!==undefined) {

				this.debuMess('enter errorText: '+a.errorText);
    			
    		}

    		return false;

    	}

    	//we are logged in

    	this.channel = a.channel;
    	this.timestamp = a.timestamp;

    	
    	this.debuMess('enterHook: entered to '+a.channel+' @'+a.timestamp);

    	return true;

    } 	//ajax callback for enter


   
			
	this.pullUsers = function (users) {

    var bot = this;
    
    if (length(users)===0) { return false; }

    //do json this.htmlroot+
        $.post( "/users/read/akey/"+ this.akey , { users: users } , function(data){
    
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
                        bot.initialUserPrime = true;
                        bot.debuMess('botcore: primed users '+bot.initialUserPrime +':');


                        return true;


                    }
                    

                });


        return true;

}

	




    this.say = function (bot,message,channel,targetUserID) {

    	//are we online

    	var b = this.isOnline(bot.akey, bot.timestamp);

    	if (b===false) {

    		//we are not online
    		this.debuMess('say failed. bot offline');
    		return false;
    	}

    	if (channel===undefined) { channel = bot.channel; }

    	//try to login
    	_botIO.say(bot, message,channel,this.userID,this.akey);

    	
    }

    this.privateSay = function (bot,message,channel,userID) {

        //are we online

        var meObj = {};
        meObj.type = 'privateMessage';
        
        meObj.message = message;
        meObj.senderUserID = bot.userID;

        var b = this.isOnline(bot.akey, bot.timestamp);

        if (b===false) {

            //we are not online
            this.debuMess('privateSay failed. bot offline');
            return false;
        }

        if (channel===undefined) { channel = bot.channel; }

        this.sayObject(meObj,channel,userID);


        //try to login
        //_botIO.privateSay(bot, message,username);

        
    }

    this.sayHook = function (bot, a) {

    	


    	this.debuMess('said something to channel or person:'+ this.channel);

    	return;

    	if (a.error!==undefined) { 

    		this.timestamp = 0;
    		this.debuMess('Login error: '+a.error);

    		if (a.errorText!==undefined) {

				this.debuMess('Login errorText: '+a.errorText);
    			
    		}

    		return false;

    	}

    	//we are logged in

    	this.akey = a.akey;
    	this.userID = a.userID;
    	this.timestamp = a.timestamp;

    	this.debuMess('logged is as '+a.userID+' with key '+a.akey);

    	return true;

    } 	//ajax callback for say

    this.sayObject = function (messageObj,channel,targetUserID) {

        //are we online
        var bot = this;

        if (targetUserID!==undefined) {

            //for somebody only
            messageObj.recipientUserID = targetUserID;

        }

        var b = this.isOnline(bot.akey, bot.timestamp);

        if (b===false) {

            //we are not online
            this.debuMess('sayObject failed. bot currently offline');
            return false;
        }

        if (channel===undefined) { channel = bot.channel; }

        //try to login
        _botIO.sayObject(bot, messageObj , channel , bot.userID , bot.akey);

        return true;
    }


    this.clearCloggedEtube = function(){


        _botIO.clearCloggedEtube();

    };

    this.sayObjectHook = function (bot, a) {

        


        this.debuMess('said Object to channel or person:');

        return;

        if (a.error!==undefined) { 

            this.timestamp = 0;
            this.debuMess('Login error: '+a.error);

            if (a.errorText!==undefined) {

                this.debuMess('Login errorText: '+a.errorText);
                
            }

            return false;

        }

        //we are logged in

        this.akey = a.akey;
        this.userID = a.userID;
        this.timestamp = a.timestamp;

        this.debuMess('logged is as '+a.userID+' with key '+a.akey);

        return true;

    }   //ajax callback for say

    
    this.storeObject = function (messageObj,channel,directToUserID) {

        //store object shoves the big obj to serverside storage and sends the channel a marker to go and grab it with json


        //are we online
        var bot = this;

        var b = this.isOnline(bot.akey, bot.timestamp);

        if (b===false) {

            //we are not online
            this.debuMess('sayObject failed. bot currently offline');
            return false;
        }

        if (channel===undefined) { channel = bot.channel; }

        //try to login
        //_botIO.storeObject(bot, messageObj , channel , bot.userID , bot.akey);
        _botIO.storeObject(bot, messageObj , channel , directToUserID , bot.akey);

        return true;
    
    };
    
    this.pullStoredObject = function (storageID) {

        _botIO.pullStoredObject(this,storageID,this.userID , this.akey);


        return;

    };


    /*
    if ( $response =  file_get_contents ($this->myUrl().'tweeter/listenprivate/akey/'.$akey.$temp))  {
			
			//did we get a ok
			//print (strlen($response)).'<br></b>';
			
			if (strlen($response)<5) return true;
	*/
	 this.listenChannel = function () {

    	//are we online
    	var bot = this;

    	if (bot.isOnline(bot.akey,bot.timestamp)===false) { return false; }


    	var b = this.isOnline(bot.akey, bot.timestamp);

    	if (b===false) {

    		//we are not online
    		this.debuMess('listenChannel failed. bot offline');
    		return false;
    	}

    	

    	//try to login
    	_botIO.listenChannel( bot, this.channel, this.akey, this.timestamp);

    	
    }

    this.listenChannelHook = function (a) {


    	//are we offline?

    	if (this.isOnline(this.akey,this.timestamp)===false) { return false; }


    	//me might get an error obj or messages

    	if (a.error!==undefined) {

    		this.debuMess('bizarro error listening to channel '+this.channel);
    		return false;
    	}

    	if (this.isOnline()===false) {

    		//we are offline, ignore whatever
    		return false;

    	}

    	//loop messages and filter out the ones that are too old
    	//assume messages come in in a correct order

    	//this.processMessages(a.messages);

        //just push them to a buffer and get out
        this.addEvents(a.messages);


    	return true;

    	if (a.error!==undefined) { 

    		this.timestamp = 0;
    		this.debuMess('Login error: '+a.error);

    		if (a.errorText!==undefined) {

				this.debuMess('Login errorText: '+a.errorText);
    			
    		}

    		return false;

    	}

    	//we are logged in

    	this.akey = a.akey;
    	this.userID = a.userID;
    	this.timestamp = a.timestamp;

    	this.debuMess('logged is as '+a.userID+' with key '+a.akey);

    	return true;

    } 	//ajax callback for listenprivate



    this.inviteToGame = function (bot,userID,channel) {

        //are we online

        var b = this.isOnline(bot.akey, bot.timestamp);

        if (b===false) {

            //we are not online
            this.debuMess('invite failed. bot offline');
            return false;
        }

        if (channel===undefined) { channel = bot.channel; }

        //try to login
        var o = {};
        o.type ='_gameInvite';
        o.from = bot.userID;
        o.to = userID;

        _botIO.sayObject(bot, o , channel , this.userID , this.akey);

        //_botIO.inviteTo(bot, message,channel,this.userID,this.akey);

        
    }

    this.flushEvents = function () {

        //flush all events from the queue

    };   //end of flush events

    this.addEvent = function (eventObj) {

        if (this.active===false) { return false; }

        //this.processEvent(eventObj);
        //return;
        if (eventObj===undefined) {

            this.debuMes('UNDEFINED addEvents Object');
            return false;

        }

        if (eventObj===false) {

            this.debuMes('FALSE addEvents Object');
            return false;

        }

        //ignore my own messages

        if (eventObj.senderUserID!==undefined){

            if (eventObj.senderUserID===this.userID) { return false; }
        
        }

        //can receive multiple events with eventObj.replies
        var now = new Date();
        var bot = this;

        //react to game moves fast
        
        if (this.boostGameMoveProcessing!==undefined) {

            if (this.boostGameMoveProcessing===true) {

                if (eventObj.type==='_gameMove') {
                    
                    this.processEvent(eventObj);
                    return;
                }
            }


        }

        var ippa =deepCopyObj(eventObj);
        this.eventBuffer.push(ippa);


        return;
        //TEST  processEvent immediately
        this.processEvent(eventObj);

    };  //end add event

    this.processEvent = function(message) {


       // this.debuMess('EB: '+message.type);
       // this.debuObj(message

        //we get everything that comes in on the channel
        //do a bit of filtering here
        if(message.recipientUserID!==undefined) {

            if (message.recipientUserID!==this.userID) {

                //this message is not for me
                return true;

            }

        }

        if (message.senderUserID!==undefined) {

            //userID is the ser
            if (this.userID===message.senderUserID) {

                //skip originating from me
                return true;

            }


        }   else {

            //this.debuMess('SKIP no senderuser id on:');
            //this.debuObj(message);
            //return true;


        }

        //ignore say messages
        if(message.type==='say') {

            if (this.channelTalkHandler!==undefined) {

                //lounge screen or something has a chat box
                this.channelTalkHandler(message);

            }
            return true;

        }

        if (message.messageID===undefined) {

            this.debuMess('undefined messageID?');
            this.debuObj(message);

            return;
        }


        if (this.eventDupBuffer[message.messageID]!==undefined) {

            return;

        } else {

            this.eventDupBuffer[message.messageID]=message.messageID;

        }

        var messages = {};
        messages[message.type] =message;

        this.processMessages(messages);
        return;

    };  //end processEvent

    this.processEventsFinalize = function() {

        //clear dup buffer

        //var m = length(this.eventDupBuffer);

        //this.debuMess('eventDupBuffer ('+m+') cleared');
        
        this.eventDupBuffer = [];


    };


    this.processMessages = function (messages){

        var bot = this;
        var timestamp = this.timestamp;
        var announcedMyPresence = false;

        jQuery.each(messages, function(){

            this.timestamp = parseFloat (this.timestamp);

            /*if (bot.timestamp >= this.timestamp) {

                //skip old messages
                return;

            }*/

            if (this.type==='command') {        


                //check for two part commands

             var dx = this.data.split(' ');
             if (dx[0]==='_reboot') {

                if (dx[1]!==undefined) {

                    if (dx[1]===bot.handle) {

                        //rebooting bot
                        var fram = bot.initiated+5;

                        if (this.timestamp<fram) { return false; }
                        bot.reboot(this.senderUserID);

                        return;

                    }

                }

             }   //end split command reboot


            }   //end parsing commands



            //rest is for bot specific handlers

            var funHan ='processMessage'+this.type;
            if (bot[funHan]!==undefined) {

                //by default all this stuff is dataObj
                var result = bot[funHan](this.dataObj);
                
                //if we result false, continue with the rest
                if (result!==false) {return;}
                
            } else {

                bot.debuMess('719 processMessages: '+funHan+' hook missing for '+bot.handle);

            }

            if (this.type==='_storedObject') {

                if (this.dataObj.userID===undefined) {
                    
                    bot.debuMess('storedObject encountered '+this.dataObj.storageID+' <a onclick="rePullStorageObject(\'false\',\''+this.dataObj.storageID+'\');"> REPULL</a> ');

                    bot.pullStoredObject(this.dataObj.storageID);

                    } else {

                        if (this.dataObj.userID===bot.userID) {

                            bot.debuMess('personal storedObject encountered '+this.dataObj.storageID+' <a onclick="rePullStorageObject(\''+this.dataObj.userID+'\',\''+this.dataObj.storageID+'\');"> REPULL</a> ' );

                            bot.pullStoredObject(this.dataObj.storageID);

                        } else {

                            //bot.debuMess('skipped somebodys ('+this.dataObj.userID+') personal storedObject');

                        }

                    }

                return;
                //bot.debuMess ('user '+this.fullname+' says: '+this.data+' @channel:'+this.access);
                

            }


            if (this.type==='logout') {

            }   else {

                //tag him logged in   //should be
                bot.tags.tag('users',this.userID,'online');
                //tag him onchannel
                bot.tags.tag('users',this.userID,'onchannel'+this.access);
                
                //we dont know if he's idle yet
                bot.tags.unTag('users',this.userID,'idle');

                //return;
            }

            if (this.type==='say') {

                //bot.debuMess ('user '+this.fullname+' says: '+this.data+' @channel:'+this.access);
                
                if (bot.botType==='dialoguebot') {

                    //show the comments on dialoguepane
                    bot.dialogueMess (this.fullname+' : '+this.data);
                    
                    //see if next line is mine
                    //bot.pollDialogue();

                }

                if (bot.timestamp<this.timestamp) {

                    bot.timestamp = this.timestamp;

                }

                return;

            }

            if (this.type==='enter') {

                bot.debuMess ('user '+this.fullname+' enters and starts to sing about gold @channel:'+this.access);
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

                return;

            }   //end of enter

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

                return;
            }

            if (this.type==='idle') {

                bot.debuMess ('user '+this.fullname+' idling on @channel:'+this.access);
                
                bot.tags.tag('users',this.userID,'idle');

            } else {

                //this guy is not idle

                 bot.tags.unTag('users',this.userID,'idle');
            }

            if (this.type==='onliners') {

                bot.debuMess ('onliners list got on @channel:'+bot.channel);
                
                if (this.dataObj===undefined) {


                    //urldecode
                    var x = this.data.replace(/\+/g, ' ');
                     //messagesangle into json
                    var  o = jQuery.parseJSON(x);
                    var channel = this.access;

                } else {


                    o = this.dataObj.users;

                }

                if (o===undefined) { bot.debuMess('undefined users obj at 705!'); return; }


                bot.trafficBotHandle = this.handle;

                if (o[undefined]!==undefined) {

                        bot.debuMess('undefined users obj at 709!');
                        return false;   
                    }

                if (o!==false) {

                    var pullTheseUsers = {};

                    //tag online
                    jQuery.each(o,function(k,v) {

                        if (bot.tags.isTaggedAs('users',k,'online')===false) {

                                 bot.debuMess('user <a onclick="messageUser(\''+k+'\')">): '+k+'</a> tagged online @ '+ channel);
                                    
                             }

                        //tag him online
                        bot.tags.tag('users',k,'online');

                        if (bot.users.users[k] === undefined) { 

                                            var x = {};
                                            x[k]=k;
                                            pullTheseUsers[k] = x;

                                        }

                    });

                    //these guys are missing
                    bot.pullUsers (pullTheseUsers);

                    if (bot.timestamp<this.timestamp) {

                        bot.timestamp = this.timestamp;

                    }

                }
                

                //bot.debuObj(o);
                /*
                //somebody enters. tell him i'm here too
                if (announcedMyPresence===false) {
                    
                    bot.say(bot,'im ('+bot.handle+') here too',bot.channel);
                    announcedMyPresence = true;
                }   
                */

                if (bot.timestamp<this.timestamp) {

                    bot.timestamp = this.timestamp;

                }

            }


            //ignore the rest


        });

        
        return;

     }  //end of processMessages

    this.SIMPLEprocessMessages = function (messages){

    	var bot = this;
    	var timestamp = this.timestamp;
    	var announcedMyPresence = false;

    	jQuery.each(messages, function(){

    		this.timestamp = parseFloat (this.timestamp);

    		if (bot.timestamp >= this.timestamp) {

    			//skip old messages
    			return;

    		}

    		if (this.type==='say') {

    			//bot.debuMess ('user '+this.fullname+' says: '+this.data+' @channel:'+this.access);
    			
    			if (bot.botType==='dialoguebot') {

    				//show the comments on dialoguepane
    				bot.dialogueMess (this.fullname+' : '+this.data);
    			

    			}

    			if (bot.timestamp<this.timestamp) {

    				bot.timestamp = this.timestamp;

    			}

    		}

            if (this.type==='_storedObject') {

                bot.debuObj(this);
                bot.debuMess('947 ALERT storedObject encountered '+this.storageID);

                bot.pullStoredObject(this.storageID);

                return;
                //bot.debuMess ('user '+this.fullname+' says: '+this.data+' @channel:'+this.access);
                
                if (bot.botType==='dialoguebot') {

                    //show the comments on dialoguepane
                    bot.dialogueMess (this.fullname+' : '+this.data);
                

                }

                if (bot.timestamp<this.timestamp) {

                    bot.timestamp = this.timestamp;

                }

            }


    		if (this.type==='enter') {

    			bot.debuMess ('user '+this.fullname+' enters and starts to sing about gold @channel:'+this.access);
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

     this.onEjabberdMessage = function (bot,msg) {

        //hook for those incoming ejabberd messages that come one by one unlike tweets

        //if (this.isOnline(this.akey,this.timestamp)===false) { return false; }
        //var bot = this;

        bot.debuMess('giikel');
        return ;

        var message = _botIO.parseEjabberdMessage(bot,msg);

        return true;
        //take action

        /*var to = msg.getAttribute('to');
        var from = msg.getAttribute('from');
        var type = msg.getAttribute('type');
        var elems = msg.getElementsByTagName('body');

        var body = elems[0];

        var sanat = Strophe.getText(body);
        var gupta =0;*/

        //bot.debuObj(message);

    };  //end of onEjabdMessage


this.askTrafficbotForUserIDs = function () {


    var bot = this;

    if (bot.rosterGotForChannel===undefined) {

        bot.debuMess('askTrafficbotForUserIDs: rosterGotForChannel not ready');

        return false;
    }

    bot.say(bot,'_onliners');
    this.debuMess('asked traffic bot for onliners @'+bot.channel);

    this.trafficBotContacted= true;

    };

this.readUserByHandle = function (handle,bot) {

    //if we have no users or the guy is not found, return false
    //guy not found might mean hes not in our roster yet
    var u;
    if (bot===undefined) { u= this.users.users; } else { u = bot.users.users; }

    var ret=false;
    if (u===undefined) { return false; }
    if (length(u)===0) { return false; }

    jQuery.each(u, function(uid, user) {
     
        if (user.public.fullname ===handle) {
            ret = user;
            return 0;
        }
    });

    return ret;

};

this.matchUserIDusername = function (obj,bot) {

    //translates UIDXXX - UIDXXX keypairs to UIDXX - username pairs
    var m = deepCopyObj(obj);
    var keypairs = {};
    jQuery.each(m,function(k,v){

        keypairs[k]=bot.readUserName(k,bot);

    });

    return keypairs;

};  

this.readUserName = function (userID,bot) {

    var u;
    if (bot===undefined) { u= this.users.users; } else { u = bot.users.users; }

    var ret=false;
    if (u===undefined) { return false; }
    if (length(u)===0) { return false; }

    if (u[userID]===undefined) { return ('!'+userID); }

    //it has a public fullname

    return (u[userID].public.fullname);

} 

this.updateRoster = function (bot, userID, roomName){

    //probably logging to my channaah

    return true;

};
     //kick  in da jams

this.startMainLoop = function () {

        var me = this;
    var handler = (function (o) { return function() { o.mainLoop() }; })(me);
    me.mainloopTimer = setInterval(handler, me.heartbeat);


    /*
	var m = this;
	//function (){
	//	m.mainLoop();
	//}
		this.mainloopTimer = setInterval(function (function(m){var o = m;} ){
			o.mainLoop();
		},this.heartbeat);

	*/
		var a=1;

	}	//end of startmainloop

}	//end of botcore Class


//toggleBot helper function




