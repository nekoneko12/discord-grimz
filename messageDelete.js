const { EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
    name: 'messageDelete',
    execute(message, client) {
        if (message.author.bot || !message.content) return;
        
        const snipeEmbed = new EmbedBuilder()
            .setColor('#23272A')
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setDescription('> ' + message.content)
            .setFooter({ text: 'Dihapus di #' + message.channel.name + ' • ' + moment(message.createdAt).format('LLLL') })
            .setTimestamp();
            
        if (message.attachments.size > 0) {
            snipeEmbed.setImage(message.attachments.first().url);
        }
        
        client.snipes.set(message.channel.id, {
            embed: snipeEmbed,
            author: message.author.id,
            timestamp: Date.now()
        });
    }
};
