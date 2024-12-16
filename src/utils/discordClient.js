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
                __**Cache:dividers:**__\nUntuk player yang sedang menggunakan client versi 0.3DL, anda bisa mendownloadnya disini atau di in-game.\n \
                __**Downloads Links:floppy_disk:**__\n[Storylines Models/Cache Downloads](https://www.mediafire.com/file/jj7oedecv8p3x5e/104.234.180.104.7020.rar/file)\n \
                __**Folder Place:open_file_folder:**__\n```C:\Users\...\Documents\GTA San Andreas User Files\SAMP\cache```\n \
                __**Cache Instalations Steps:pushpin:**__\n```1.Install cache yang sudah diberikan link di atas.\n2.Extract ke folder C:\Users\...\Documents\GTA San Andreas User Files\SAMP\cache\n3.Jika sudah silahkan login dan happy roleplaying!```'

            )
            .addFields(
                { name: '__**Primary Address**__', value: '```soon.com```', inline: true },
                { name: '__**Secondary Address**__', value: '```104.234.180.104```', inline: true },
                { name: '__**Server Port**__', value: '```7020```', inline: false },
                { name: '__**Language**__', value: '```Indonesia/English```', inline: true },
                { name: '__**Host Area**__', value: '```Singapore```', inline: true }
            )
            .setImage('https://imgur.com/cItULPa.png')
            .setFooter({ text: 'Storylines Roleplay', iconURL: 'https://imgur.com/cItULPa.png' });
        message.channel.send({ embeds: [embed] });
    }
});

module.exports = client;
