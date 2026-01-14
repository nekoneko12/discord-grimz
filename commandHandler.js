// handlers/commandHandler.js
const fs = require('fs');

module.exports = (client) => {
    console.log('📚 Memuat Command Handler...');

    const commandFolders = fs.readdirSync('./commands');
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../commands/${folder}/${file}`);
            if (command.name) {
                client.commands.set(command.name, command);
                if (command.aliases) {
                    command.aliases.forEach(alias => {
                        client.aliases.set(alias, command.name);
                    });
                }
            }
        }
    }
    console.log('✅ Semua command berhasil dimuat.');
};