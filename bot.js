var Discord = require('discord.io');
var logger = require('winston');
var config = require('./config.json');

var levelRegex = /level\s\d+/;
var intRegex = /\d+/;
var userIDRegex = /<@!\d{18}>/;
var onlyIDRegex = /[^\d{18}]+/g;
var targetChannelID = config.targetChannelID;

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
});

bot.on('message', function(botuser, botID, channelID, message, event) {
    logger.info("----------------------New Message Received!--------------------------");
    logger.info("Channel: " + channelID);

    if (null != message && channelID == targetChannelID && botuser == "MEE6") {
        logger.info("Message: " + message);
        var levelString = levelRegex.exec(message);

        if (null != levelString){
            logger.info("LevelString: " + levelString);
            var level = intRegex.exec(levelString);

            if (null != level){
                logger.info("Level: " + level);
                var userID = userIDRegex.exec(message).toString().replace(onlyIDRegex, '');
                
                if (null != userID){
                    logger.info("UserID: " + userID);        
                    var user = bot.users[userID];

                    if (null != user){
                        bot.editNickname({
                            serverID: bot.channels[channelID].guild_id,
                            userID: userID,
                            nick: user.username + " 𝐋𝐕 " + level
                        }, function(data){
                            logger.error(data);
                        });
                    }
                }
            }   
        }       
    }
});