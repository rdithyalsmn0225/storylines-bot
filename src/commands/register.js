const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// Register Slash Command:
module.exports = {
    data: {
        name: 'register',
        description: 'Start the registration process',
        type: 1
    },
    async execute(interaction) {
        const { channelId, member } = interaction;

        if (channelId !== '1318194683406454845') {
            return interaction.reply({ content: "This command can only be used in the specified channel.", ephemeral: true });
        }

        if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: "You aren't authorized to use this.", ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0xFFA500)
            .setTitle('User Control Panel')
            .setDescription('The User Control panel is a means for players to manage and create their UCP accounts...')
            .setImage('https://imgur.com/cItULPa.png')
            .addFields(
                { name: '__**Create Account Button**__', value: 'The button to create an account...', inline: false },
                { name: '__**Change Password Button**__', value: 'Button to change your account password...', inline: false },
                { name: '__**Display Characters Button**__', value: 'The Display character button...', inline: false },
                { name: '__**Delete Characters Button**__', value: 'The button to delete a character...', inline: false },
                { name: '__**Important Notice**__', value: 'DO NOT share your account username & password...', inline: false }
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
};
