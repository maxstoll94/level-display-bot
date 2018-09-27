var Discord = require('discord.io');
var logger = require('winston');
var config = require('./config.json');

var levelRegex = /level\s\d+/;
var intRegex = /\d+/;
var userIDRegex = /<@!\d{10,20}>/;
var onlyIDRegex = /[^\d{10,20}]+/g;
var targetChannelName = config.targetChannelName;
var notifyUserID = config.notifyUserID;

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
    
    var sendErrorMessage = false;
    var errorMessage = null;
    
    var channelName = null;
    var channel = bot.channels[channelID];
    
    if (null != channel){
        channelName = channel.name;
    }

    if (null != message && channelName == targetChannelName && botuser == "MEE6") {
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
                        logger.info("UserID: " + parsedUserID);        
                        var user = bot.users[parsedUserID];
    
                        if (null != user){
                                bot.editNickname({
                                    serverID: bot.channels[channelID].guild_id,
                                    userID: parsedUserID,
                                    nick: user.username + config.displayFormat.format(level)
                                }, function(data){
                                    if (null != data){
                                        logger.warn(data);
                                        sendErrorMessage = true;
                                        errorMessage = data.message;
                                    }
                                });
                        } else {
                            logger.error("Unable to retrieve User.");
                            sendErrorMessage = true;
                            errorMessage = "Unable to retrieve User."
                        }
                    } else {
                        logger.error("Unable to parse UserID.");  
                        sendErrorMessage = true;
                        errorMessage = "Unable to parse UserID."
                    } 
                } else {
                    logger.error("Unable to parse raw UserID.");
                    sendErrorMessage = true;
                    errorMessage = "Unable to parse raw UserID." 
                }           
            } else {
                logger.error("Unable to parse Level.");
                sendErrorMessage = true;
                errorMessage = "Unable to parse Level." 
            }   
        } else {
            logger.error("Unable to parse LevelString.");
            sendErrorMessage = true;
            errorMessage = "Unable to parse LevelString." 
        }
    }
    
    // Only send an error log if the message was created in a channel, otherwise it loops.
    if (sendErrorMessage && botuser != bot.username){
        bot.sendMessage({
            to: notifyUserID,
            message: "\nGreetings Master!\n\n"
                + "The following error has occured: **{0}**\n\n".format(errorMessage)
                + "Time: " + new Date().toLocaleString() + "\n\n"
                + "Details:\n"
                + "```UserName: {0}\nMessage: {1}\nChannelID: {2}\nChannelName: {3}\n".format(botuser, message, channelID, channelName)
                + "LevelString: {0}\nLevel: {1}\nRawUserID: {2}\nParsedUserID: {3}\n".format(levelString, level, rawUserID, parsedUserID)
                + "ServerID: {0}\n```".format(bot.serverID)
        });
    }
});

// custom string format function
String.prototype.format = function() {
    a = this;  
    for (k in arguments) {
      a = a.replace("{" + k + "}", arguments[k]);
    }
    return a
};