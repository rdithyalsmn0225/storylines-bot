const { Client, EmbedBuilder } = require('discord.js');

// Discord Client:
const client = new Client({ intents: ["Guilds", "GuildMembers", "GuildMessages", "MessageContent"] });

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
    if (message.content.toLowerCase() === 'ip') {
        const embed = new EmbedBuilder()
            .setColor(0xFFA500)
            .setTitle('Information')
            .setDescription(
                '__**Address Information:loudspeaker:**__\nUntuk memasuki server anda harus menginput server ip ke dalam sa-mp client.\n \
                __**Cache:dividers:**__\nUntuk player yang sedang menggunakan client versi 0.3DL, anda bisa mendownloadnya disini atau di in-game.'

            )
            .addFields(
                { name: '__**Primary Address**__', value: '```localhost.com```', inline: true },
                { name: '__**Secondary Address**__', value: '```127.0.0.1```', inline: true },
                { name: '__**Server Port**__', value: '```7777```', inline: false },
                { name: '__**Language**__', value: '```Indonesia/English```', inline: true },
                { name: '__**Host Area**__', value: '```Singapore```', inline: true }
            )
            .setImage('https://imgur.com/cItULPa.png')
            .setFooter({ text: 'Storylines Roleplay', iconURL: 'https://imgur.com/cItULPa.png' });
        message.channel.send({ embeds: [embed] });
    }
});

module.exports = client;
