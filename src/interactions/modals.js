const db = require('../utils/database');
const { hashPassword, getUserIP } = require('../utils/security');

module.exports = {
    async handleModalSubmit(interaction) {
        const { customId } = interaction;

        if (customId === 'register_modal') {
            const username = interaction.fields.getTextInputValue('username');
            const password = interaction.fields.getTextInputValue('password');
            const hashedPassword = hashPassword(password);
            const userIP = getUserIP();
        
            // Periksa apakah username atau Discord ID sudah ada
            db.query(
                'SELECT COUNT(*) AS count FROM masters WHERE acc_name = ? OR discord = ?',
                [username, interaction.user.id],
                (error, results) => {
                    if (error) {
                        console.error(error);
                        return interaction.reply({ content: 'There was an error while processing your request.', ephemeral: true });
                    }
        
                    const count = results[0].count;
        
                    if (count > 0) {
                        return interaction.reply({
                            content: 'This username or Discord ID is already registered.',
                            ephemeral: true,
                        });
                    }
        
                    // Tambahkan akun ke database
                    db.query(
                        'INSERT INTO masters (acc_name, acc_pass, discord, active_ip) VALUES (?, ?, ?, ?)',
                        [username, hashedPassword, interaction.user.id, userIP],
                        async (insertError, insertResults) => {
                            if (insertError) {
                                console.error(insertError);
                                return interaction.reply({
                                    content: 'There was an error while registering your account.',
                                    ephemeral: true,
                                });
                            }
        
                            try {
                                // Ubah nama panggilan pengguna di server tempat interaksi terjadi
                                const guild = interaction.guild;
                                const member = guild.members.cache.get(interaction.user.id);
        
                                if (member) {
                                    await member.setNickname(username);
                                    return interaction.reply({
                                        content: `Account registered successfully! Your nickname has been updated to ${username}.`,
                                        ephemeral: true,
                                    });
                                } else {
                                    return interaction.reply({
                                        content: 'Account registered successfully! However, your nickname could not be updated.',
                                        ephemeral: true,
                                    });
                                }
                            } catch (nicknameError) {
                                console.error(nicknameError);
                                return interaction.reply({
                                    content: 'Account registered successfully! However, there was an error updating your nickname.',
                                    ephemeral: true,
                                });
                            }
                        }
                    );
                }
            );
        } else if (customId === 'change_password_modal') {
            const newPassword = interaction.fields.getTextInputValue('new_password');
            const hashedPassword = hashPassword(newPassword);

            db.query('UPDATE masters SET acc_pass = ? WHERE discord = ?', [hashedPassword, interaction.user.id], (error, results) => {
                if (error) {
                    console.error(error);
                    return interaction.reply({ content: 'There was an error while changing your password.', ephemeral: true });
                }
                interaction.reply({ content: 'Password changed successfully!', ephemeral: true });
            });
        }
    }
};
