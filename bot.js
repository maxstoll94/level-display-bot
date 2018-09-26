var Discord = require('discord.io');
var logger = require('winston');
var config = require('./config.json');

var levelRegex = /level\s\d+/;
var intRegex = /\d+/;
var userIDRegex = /<@!\d{10,20}>/;
var onlyIDRegex = /[^\d{10,20}]+/g;
var targetChannelName = config.targetChannelName;

// Configure logger settings
logger.remove(logger.transports.Console);

logger.add(logger.transports.Console, {
    colorize: true
});

logger.level = config.logLevel;

// Initialize Discord Bot
var bot = new Discord.Client({
   token: config.token,
   autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');

    if (null == config.token || null == config.targetChannelName || null == config.displayFormat){
        logger.error("Configuration error! Please check your config and try again.");
        logger.info("Disconnecting...");
        bot.disconnect();
    }
});

bot.on('message', function(botuser, botID, channelID, message, event) {
    logger.info("----------------------New Message Received!--------------------------");
    logger.info("Channel ID: " + channelID);

    var channelName = "";
    var channel = bot.channels[channelID];
    
    if (null != channel){
        channelName = channel.name;
        logger.info("Channel Name: " + channelName);
    }
    
    if (null != message && channelName ==  targetChannelName && botuser == "MEE6") {
        logger.info("Message: " + message);
        var levelString = levelRegex.exec(message);

        if (null != levelString){
            logger.info("LevelString: " + levelString);
            var level = intRegex.exec(levelString);

            if (null != level){
                logger.info("Level: " + level);
                var rawUserID = userIDRegex.exec(message)
                
                if (null != rawUserID){
                    var parsedUserID = rawUserID.toString().replace(onlyIDRegex, '');

                    if (null != parsedUserID){
                        logger.info("UserID: " + userID);        
                        var user = bot.users[userID];
    
                        if (null != user){
                            bot.editNickname({
                                serverID: bot.channels[channelID].guild_id,
                                userID: userID,
                                nick: user.username + config.displayFormat.format(level)
                            }, function(data){
                                if (null != data){
                                    logger.error(data);
                                }
                            });
                        }
                        logger.error("Unable to retrieve User.");   
                    }
                    logger.error("Unable to parse UserID.");   
                }
                logger.error("Unable to parse raw UserID.");                   
            }
            logger.error("Unable to parse Level.");      
        }
        logger.error("Unable to parse LevelString.");      
    }
});

// custom string format function
String.prototype.format = function() {
    a = this;
    for (k in arguments) {
      a = a.replace("{" + k + "}", arguments[k])
    }
    return a
};