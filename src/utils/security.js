const crypto = require("crypto");
const os = require("os");

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

module.exports = { hashPassword, getUserIP };
