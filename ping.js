const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Menampilkan latency bot.',
    args: false,
    ownerOnly: false,
    category: 'info',
    async execute(message) {
        const msg = await message.channel.send('🏓 Pinging...');
        const embed = new EmbedBuilder()
            .setColor('#23272A')
            .setTitle('🏓 Pong!')
            .addFields(
                { name: '⏱️ Latency API', value: `\`${Math.round(message.client.ws.ping)}ms\``, inline: true },
                { name: '⏱️ Latency Message', value: `\`${msg.createdTimestamp - message.createdTimestamp}ms\``, inline: true }
            )
            .setTimestamp();
        
        msg.edit({ content: null, embeds: [embed] });
    }
};