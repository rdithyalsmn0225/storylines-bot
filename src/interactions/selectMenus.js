const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const db = require('../utils/database');

module.exports = {
    async handleInteraction(interaction) {
        // Ensure interaction is valid
        if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;

        // Handle button interactions
        if (interaction.isButton()) {
            if (interaction.customId === 'delete_character') {
                await this.showDeleteCharacter(interaction);
            } else if (interaction.customId === 'show_character') {
                await this.showCharacterSelection(interaction);
            }
        }

        // Handle select menus
        if (interaction.isStringSelectMenu()) {
            await this.handleSelectMenuInteraction(interaction);
        }
    },

    async handleSelectMenuInteraction(interaction) {
        if (interaction.customId === 'select_character_show') {
            const selectedCharId = interaction.values[0];

            db.query('SELECT char_name, pMoney, pLastSkin FROM characters WHERE char_dbid = ?', [selectedCharId], async (error, characterResults) => {
                if (error) {
                    console.error('Database Query Error:', error);
                    return interaction.reply({ content: 'There was an error while processing your request.', ephemeral: true });
                }

                if (characterResults.length > 0) {
                    const character = characterResults[0];
                    // Replace this with the actual URL where your images are hosted
                    const skinImageUrl = `https://assets.open.mp/assets/images/skins/${character.pLastSkin}.png`; // Use the correct URL pattern
                    const characterEmbed = new EmbedBuilder()
                        .setTitle('Character Details')
                        .addFields(
                            { name: 'Name', value: character.char_name, inline: true },
                            { name: 'Money', value: `$${character.pMoney}`, inline: true },
                            { name: 'Skin ID', value: String(character.pLastSkin), inline: true }
                        )
                        .setImage(skinImageUrl); // Set the skin image
                
                    try {
                        await interaction.user.send({ embeds: [characterEmbed] });
                        await interaction.reply({ content: 'Character details have been sent to your DM.', ephemeral: true });
                    } catch (dmError) {
                        console.error('DM Error:', dmError);
                        await interaction.reply({ content: 'Unable to send DM. Please check your privacy settings.', ephemeral: true });
                    }
                } else {
                    await interaction.reply({ content: 'Character not found.', ephemeral: true });
                }
            });
        } else if (interaction.customId === 'select_character_delete') {
            const selectedCharId = interaction.values[0];

            db.query('DELETE FROM characters WHERE char_dbid = ?', [selectedCharId], (error, results) => {
                if (error) {
                    console.error('Delete Query Error:', error);
                    return interaction.reply({ content: 'There was an error while trying to delete the character.', ephemeral: true });
                }

                if (results.affectedRows > 0) {
                    interaction.reply({ content: 'Character successfully deleted.', ephemeral: true });
                } else {
                    interaction.reply({ content: 'Character not found or already deleted.', ephemeral: true });
                }
            });
        }
    },

    async showCharacterSelection(interaction) {
        db.query('SELECT acc_dbid FROM masters WHERE discord = ?', [interaction.user.id], (error, results) => {
            if (error) {
                console.error('Database Query Error:', error);
                return interaction.reply({ content: 'There was an error retrieving characters.', ephemeral: true });
            }

            if (results.length === 0) {
                return interaction.reply({ content: 'No account found associated with your Discord ID.', ephemeral: true });
            }

            const masterDbid = results[0].acc_dbid;

            db.query('SELECT char_name FROM characters WHERE master_dbid = ?', [masterDbid], (error, characterResults) => {
                if (error) {
                    console.error('Database Query Error:', error);
                    return interaction.reply({ content: 'There was an error retrieving characters.', ephemeral: true });
                }

                if (characterResults.length === 0) {
                    return interaction.reply({ content: 'No characters found.', ephemeral: true });
                }

                const options = characterResults.map(row => ({
                    label: row.char_name,
                    value: row.char_name
                }));

                const selectMenu = new StringSelectMenuBuilder()
                    .setCustomId('select_character_show')
                    .setPlaceholder('Choose a character')
                    .addOptions(options);

                const actionRow = new ActionRowBuilder().addComponents(selectMenu);

                interaction.reply({ content: 'Please select a character:', components: [actionRow], ephemeral: true });
            });
        });
    },

    async showDeleteCharacter(interaction) {
        db.query('SELECT acc_dbid FROM masters WHERE discord = ?', [interaction.user.id], (error, results) => {
            if (error) {
                console.error('Database Query Error:', error);
                return interaction.reply({ content: 'There was an error retrieving characters for deletion.', ephemeral: true });
            }

            if (results.length === 0) {
                return interaction.reply({ content: 'No account found associated with your Discord ID.', ephemeral: true });
            }

            const masterDbid = results[0].acc_dbid;

            db.query('SELECT char_dbid, char_name FROM characters WHERE master_dbid = ?', [masterDbid], (error, characterResults) => {
                if (error) {
                    console.error('Database Query Error:', error);
                    return interaction.reply({ content: 'There was an error retrieving characters for deletion.', ephemeral: true });
                }

                if (characterResults.length === 0) {
                    return interaction.reply({ content: 'No characters found to delete.', ephemeral: true });
                }

                const options = characterResults.map(row => ({
                    label: row.char_name,
                    value: row.char_dbid.toString()
                }));

                const selectMenu = new StringSelectMenuBuilder()
                    .setCustomId('select_character_delete')
                    .setPlaceholder('Select a character to delete')
                    .addOptions(options);

                const actionRow = new ActionRowBuilder().addComponents(selectMenu);

                interaction.reply({ content: 'Select a character to delete:', components: [actionRow], ephemeral: true });
            });
        });
    },

    getSkinImageUrl(skinId) {
        return `https://gta.fandom.com/wiki/Special:FilePath/SkinID_${skinId}.png`; // Adjust the URL pattern based on how images are stored on GTA Wiki
    },
};
