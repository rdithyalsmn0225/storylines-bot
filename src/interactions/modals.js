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

            db.query('INSERT INTO masters (acc_name, acc_pass, discord, ip) VALUES (?, ?, ?, ?)', [username, hashedPassword, interaction.user.id, userIP], (error, results) => {
                if (error) {
                    console.error(error);
                    return interaction.reply({ content: 'There was an error while registering your account.', ephemeral: true });
                }
                interaction.reply({ content: 'Account registered successfully!', ephemeral: true });
            });

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
