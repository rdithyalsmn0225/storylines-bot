const { Client } = require('discord.js');

// Discord Client:
const client = new Client({ intents: ["Guilds", "GuildMembers", "GuildMessages", "MessageContent"] });

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

module.exports = client;
