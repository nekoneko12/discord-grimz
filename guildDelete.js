// events/guildDelete.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildDelete',
    execute(guild) {
        console.log(`❌ Bot dikeluarkan dari server: ${guild.name} (ID: ${guild.id})`);
    }
};