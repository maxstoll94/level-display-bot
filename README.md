# level-display-bot
A bot that reads the "level up" messages  of MEE6 and displays the users level next to their name.

## Instructions

### Configuration
1. First you will need to config your bot before you can run it. Here is a sample configuration.

```
 {
    "token": "",
    "logLevel": "debug",
    "targetChannelName": "level-display-bot",
    "displayFormat": " | 𝗟𝘃𝗹 {0}",
    "notifyUserID": ""
 }
```

a. **token:** Token of your bot. You can create a bot [here](https://discordapp.com/developers/applications).

b. **logLevel:** Log level of the bot.

c. **targetChannelName:** The name of the channel in which the MEEE6 Bot will log the "level up" notifications.

d. **displayFormat:** The format in which the level is displayed next to the user. {0} is required and will be replaced by the level. Note: This bot will alway append
the username before the level display.

e. **notifyUserID:** Snowflake ID of the user/channel that should be notified when the bot receives an error.

### Install packages

Open a command prompt in the same directory as the bot and run:

```
npm install
```

If you do not have npm installed, click [here](https://www.npmjs.com/get-npm). Note: This will also install Node.js, which is required for the next step

### Run the Bot

In the same comman prompt run the following command

```
node bot.js
```

Viola! Your bot should be up and running and will listen and react on level up messages from MEE6.

### Additional Information

a. Make sure the bot is part of a role that has all priveleges enabled.

b. Make sure the MEEE6 bot logs display messages into the channel matching the channel id in the configuration. This can be configured under levels tab in the dashboard.