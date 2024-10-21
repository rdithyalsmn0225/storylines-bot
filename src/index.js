require('dotenv').config();
const client = require('./utils/discordClient');
const { handleButtonInteraction } = require('./interactions/buttons');
const { handleModalSubmit } = require('./interactions/modals');
const { handleSelectMenuInteraction } = require('./interactions/selectMenus');

// Load Commands:
client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        const command = require(`./commands/${interaction.commandName}`);
        command.execute(interaction);
    } else if (interaction.isButton()) {
        handleButtonInteraction(interaction);
    } else if (interaction.isModalSubmit()) {
        handleModalSubmit(interaction);
    } else if (interaction.isStringSelectMenu()) {
        handleSelectMenuInteraction(interaction);
    }
});

client.login(process.env.TOKEN);
