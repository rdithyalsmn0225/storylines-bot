const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const db = require('../utils/database');

module.exports = {
    async handleButtonInteraction(interaction) {
        const user = interaction.user;

        // Handle Create Account modal
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
                    )
                );

            await interaction.showModal(modal);
        // Handle donations button
        } else if (interaction.customId === 'donations') {
            await interaction.reply({ content: "SOON", ephemeral: true });
        // Handle Change Password modal
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
        // Handle Show Character button
        } else if (interaction.customId === 'show_character') {
            db.query('SELECT acc_dbid FROM masters WHERE discord = ?', [user.id], async (error, results) => {
                if (error) {
                    console.error('Database Query Error:', error);
                    return interaction.reply({ content: 'There was an error while processing your request.', ephemeral: true });
                }

                if (results.length > 0) {
                    const masterDbid = results[0].acc_dbid;

                    db.query('SELECT char_name, char_dbid FROM characters WHERE master_dbid = ?', [masterDbid], async (error, characterResults) => {
                        if (error) {
                            console.error('Database Query Error:', error);
                            return interaction.reply({ content: 'There was an error while processing your request.', ephemeral: true });
                        }

                        if (characterResults.length > 0) {
                            const options = characterResults.map(character => ({
                                label: character.char_name,
                                value: String(character.char_dbid)
                            }));

                            const selectMenu = new StringSelectMenuBuilder()
                                .setCustomId('select_character_show')
                                .setPlaceholder('Select a character to display')
                                .addOptions(options);

                            const row = new ActionRowBuilder().addComponents(selectMenu);

                            await interaction.reply({ content: 'Please select a character to display:', components: [row], ephemeral: true });
                        } else {
                            await interaction.reply({ content: 'No characters found associated with your account.', ephemeral: true });
                        }
                    });
                } else {
                    await interaction.reply({ content: 'No account found associated with your Discord ID.', ephemeral: true });
                }
            });
        // Handle Delete Character button
        } else if (interaction.customId === 'delete_character') {
            db.query('SELECT acc_dbid FROM masters WHERE discord = ?', [user.id], async (error, results) => {
                if (error) {
                    console.error('Database Query Error:', error);
                    return interaction.reply({ content: 'There was an error while processing your request.', ephemeral: true });
                }

                if (results.length > 0) {
                    const masterDbid = results[0].acc_dbid;

                    db.query('SELECT char_name, char_dbid FROM characters WHERE master_dbid = ?', [masterDbid], async (error, characterResults) => {
                        if (error) {
                            console.error('Database Query Error:', error);
                            return interaction.reply({ content: 'There was an error while processing your request.', ephemeral: true });
                        }

                        if (characterResults.length > 0) {
                            const options = characterResults.map(character => ({
                                label: character.char_name,
                                value: String(character.char_dbid)
                            }));

                            const selectMenu = new StringSelectMenuBuilder()
                                .setCustomId('select_character_delete')
                                .setPlaceholder('Select a character to delete')
                                .addOptions(options);

                            const row = new ActionRowBuilder().addComponents(selectMenu);

                            await interaction.reply({ content: 'Please select a character to delete:', components: [row], ephemeral: true });
                        } else {
                            await interaction.reply({ content: 'No characters found associated with your account.', ephemeral: true });
                        }
                    });
                } else {
                    await interaction.reply({ content: 'No account found associated with your Discord ID.', ephemeral: true });
                }
            });
        }
    }
};
