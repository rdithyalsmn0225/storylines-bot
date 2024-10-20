// Variables:
require('dotenv').config();
const {
    Client,
    REST,
    Routes,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    PermissionsBitField,
    StringSelectMenuBuilder
} = require('discord.js');
const mysql = require("mysql");
const crypto = require("crypto");
const os = require("os");

// Discord Client:
const client = new Client({ intents: ["Guilds", "GuildMembers", "GuildMessages", "MessageContent"] });

// MySQL Connection:
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// Function to hash passwords:
function hashPassword(password) {
    return crypto.createHash('sha1').update(password).digest('hex');
}

// Function to get user IP:
function getUserIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'Unknown IP';
}

// Register Slash Command:
(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
            body: [{
                name: 'register',
                description: 'Start the registration process',
                type: 1
            }]
        });
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

// Client is ready:
client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Connect to MySQL:
db.connect(err => {
    if (err) return console.log(err);
    console.log(`MySQL has been connected!`);
});

// Handle messages:
client.on("messageCreate", message => {
    if (message.content.toLowerCase() === "ip") {
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('Server Information')
            .addFields(
                { name: 'HostName', value: 'Storylines Roleplay', inline: true },
                { name: 'Address', value: '204.10.192.68:7020', inline: true },
                { name: 'Players', value: '0 / 50', inline: true },
                { name: 'Ping', value: '19', inline: true },
                { name: 'Mode', value: 'End of the Line v1.0', inline: true },
                { name: 'Language', value: 'English', inline: true }
            )
            .setFooter({ text: 'Join us and enjoy the game!' });

        // Send the embed message
        message.reply({ embeds: [embed] });
    }
});

// Handle Slash Commands:
client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        const { commandName, channelId, member } = interaction;

        if (commandName === 'register') {
            if (channelId !== '1284103870661922897') {
                return interaction.reply({ content: "This command can only be used in the specified channel.", ephemeral: true });
            }

            if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return interaction.reply({ content: "You aren't authorized to use this.", ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor(0xFFA500)
                .setTitle('User Control Panel')
                .setDescription('The User Control panel is a means for players to manage and create their UCP accounts, such as changing account passwords, creating accounts, viewing the characters you own, and also deleting the characters you own.')
                .setImage('https://imgur.com/cItULPa.png')
                .addFields(
                    { name: '__**Create Account Button**__', value: 'The button to create an account so you can access the in-game, must fill in the Username, Password format.', inline: false },
                    { name: '__**Change Password Button**__', value: 'Button to change your account password, if you forget the password', inline: false },
                    { name: '__**Display Characters Button**__', value: 'The Display character button will display the characters you have in-game', inline: false },
                    { name: '__**Delete Characters Button**__', value: 'The button to delete a character that you have in-game and it will be deleted permanently', inline: false },
                    { name: '__**Important Notice**__', value: 'DO NOT share your account password and secret word. If you make a mistake or get banned, the staff will not be responsible.', inline: false }
                );

            const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('create_account')
                        .setLabel('Register Accounts')
                        .setStyle(ButtonStyle.Success)
                        .setEmoji('📩'),

                    new ButtonBuilder()
                        .setCustomId('donations')
                        .setLabel('Donations')
                        .setStyle(ButtonStyle.Success)
                        .setEmoji('💰'),

                    new ButtonBuilder()
                        .setCustomId('show_character')
                        .setLabel('Display Character')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('📨'),

                    new ButtonBuilder()
                        .setCustomId('change_password')
                        .setLabel('Change Password')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔑'),

                    new ButtonBuilder()
                        .setCustomId('delete_character')
                        .setLabel('Delete Character')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🗑')
                );

            await interaction.reply({ embeds: [embed], components: [button] });
        }
    // Interaction Button Handling:
    } else if (interaction.isButton()) {
        // Create Account Button:
        if (interaction.customId === 'create_account') {
            const modal = new ModalBuilder()
                .setCustomId('register_modal')
                .setTitle('Register Account')
                .addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('username')
                            .setLabel('Username')
                            .setStyle(TextInputStyle.Short)
                            .setMinLength(5)
                            .setMaxLength(12)
                            .setRequired(true)
                    ),
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('password')
                            .setLabel('Password')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    ),
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('secret_word')
                            .setLabel('Code')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    )
                );

            await interaction.showModal(modal);

        // Donations Button:
        } else if (interaction.customId === 'donations') {
            await interaction.reply({ content: "SOON", ephemeral: true });

        // Change Password Button:
        } else if (interaction.customId === 'change_password') {
            const modal = new ModalBuilder()
                .setCustomId('change_password_modal')
                .setTitle('Change Password')
                .addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('new_password')
                            .setLabel('Enter New Password')
                            .setStyle(TextInputStyle.Short)
                            .setMinLength(8)
                            .setRequired(true)
                    )
                );

            await interaction.showModal(modal);

        // Show Character Button:
        } else if (interaction.customId === 'show_character') {
            const user = interaction.user;

            db.query('SELECT acc_dbid FROM masters WHERE discord = ?', [user.id], (error, results) => {
                if (error) {
                    console.error(error);
                    return interaction.reply({ content: 'There was an error while processing your request.', ephemeral: true });
                }

                if (results.length === 0) {
                    return interaction.reply({ content: 'No account found linked to your Discord ID.', ephemeral: true });
                }

                const accDbid = results[0].acc_dbid;

                db.query('SELECT char_name, char_masters, pMoney, pLastSkin FROM characters WHERE master_dbid = ?', [accDbid], async (error, charResults) => {
                    if (error) {
                        console.error(error);
                        return interaction.reply({ content: 'There was an error while fetching character data.', ephemeral: true });
                    }

                    if (charResults.length === 0) {
                        return interaction.reply({ content: 'No characters found linked to your account.', ephemeral: true });
                    }

                    const characterOptions = charResults.map((character, index) => ({
                        label: character.char_name,
                        description: `Character ${index + 1}`,
                        value: character.char_name
                    }));

                    const selectMenu = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('select_character')
                                .setPlaceholder('Select a character')
                                .addOptions(characterOptions)
                        );

                    await interaction.reply({ content: 'Please select a character:', components: [selectMenu] });
                });
            });

        // Delete Character Button:
        } else if (interaction.customId === 'delete_character') {
            const modal = new ModalBuilder()
                .setCustomId('delete_character_modal')
                .setTitle('Delete Character')
                .addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('character_name')
                            .setLabel('Enter Character Name to Delete')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    )
                );

            await interaction.showModal(modal);
        }
    } else if (interaction.isModalSubmit()) {
        const { customId } = interaction;

        if (customId === 'register_modal') {
            const username = interaction.fields.getTextInputValue('username');
            const password = interaction.fields.getTextInputValue('password');
            const secretWord = interaction.fields.getTextInputValue('secret_word');
            const hashedPassword = hashPassword(password);
            const userIP = getUserIP();

            // Save the new account in the database
            db.query('INSERT INTO masters (username, password, secret_word, discord, ip) VALUES (?, ?, ?, ?, ?)', [username, hashedPassword, secretWord, interaction.user.id, userIP], (error, results) => {
                if (error) {
                    console.error(error);
                    return interaction.reply({ content: 'There was an error while registering your account.', ephemeral: true });
                }
                interaction.reply({ content: 'Account registered successfully!', ephemeral: true });
            });

        } else if (customId === 'change_password_modal') {
            const newPassword = interaction.fields.getTextInputValue('new_password');
            const hashedPassword = hashPassword(newPassword);

            db.query('UPDATE masters SET password = ? WHERE discord = ?', [hashedPassword, interaction.user.id], (error, results) => {
                if (error) {
                    console.error(error);
                    return interaction.reply({ content: 'There was an error while changing your password.', ephemeral: true });
                }
                interaction.reply({ content: 'Password changed successfully!', ephemeral: true });
            });

        } else if (customId === 'delete_character_modal') {
            const characterName = interaction.fields.getTextInputValue('character_name');

            db.query('DELETE FROM characters WHERE char_name = ? AND master_dbid = (SELECT acc_dbid FROM masters WHERE discord = ?)', [characterName, interaction.user.id], (error, results) => {
                if (error) {
                    console.error(error);
                    return interaction.reply({ content: 'There was an error while deleting the character.', ephemeral: true });
                }
                interaction.reply({ content: 'Character deleted successfully!', ephemeral: true });
            });
        }
    } else if (interaction.isStringSelectMenu()) {
        const { customId } = interaction;

        if (customId === 'select_character') {
            const characterName = interaction.values[0];

            // Display character information (assuming a function fetchCharacterInfo exists)
            db.query('SELECT * FROM characters WHERE char_name = ? AND master_dbid = (SELECT acc_dbid FROM masters WHERE discord = ?)', [characterName, interaction.user.id], (error, results) => {
                if (error) {
                    console.error(error);
                    return interaction.reply({ content: 'There was an error while fetching character data.', ephemeral: true });
                }

                if (results.length === 0) {
                    return interaction.reply({ content: 'Character not found.', ephemeral: true });
                }

                const characterInfo = results[0];
                // Display character info here
                const embed = new EmbedBuilder()
                    .setColor(0x00FFFF)
                    .setTitle(`Character Info: ${characterInfo.char_name}`)
                    .addFields(
                        { name: 'Money', value: `${characterInfo.pMoney}`, inline: true },
                        { name: 'Last Skin', value: `${characterInfo.pLastSkin}`, inline: true }
                    );

                interaction.reply({ embeds: [embed] });
            });
        }
    }
});

// Login to Discord:
client.login(process.env.DISCORD_TOKEN);