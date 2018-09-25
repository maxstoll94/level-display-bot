# level-display-bot
A bot that reads the "level up" messages  of MEE6 and displays the users level next to their name.

## Instructions

### Configuration
1. First you will need to config your bot before you can run it. Here is a sample configuration.

```
 {
    "token": "your-bot-token",
    "logLevel": "debug",
    "targetChannelId": "your-channel-id",
    "displayFormat": " 𝐋𝐕 {0}" // {0} will be replaced by the level
 }
```

a. **token:** Token of your bot. You can create a bot [here](https://discordapp.com/developers/applications).

b. **logLevel:** Log level of the bot.

c. **targetChannelId:** The channel in which the MEEE6 Bot will log the "level up" notifications. If you wish to find out the id of the channel, click [here](https://support.discordapp.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)

d. **displayFormat:** The format in which the level is displayed next to the user. {0} is required and will be replaced by the level. Note: This bot will alway append
the username before the level display.

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