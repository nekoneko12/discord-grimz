const { EmbedBuilder, AuditLogEvent } = require('discord.js');

module.exports = {
    name: 'webhookUpdate',
    async execute(channel, client) {
        const logChannel = channel.guild.channels.cache.find(ch => ch.name === 'bot-logs' && ch.type === 0);
        if (!logChannel) return;

        const fetchedLogs = await channel.guild.fetchAuditLogs({
            limit: 5,
            type: AuditLogEvent.WebhookCreate,
        });

        const webhookLog = fetchedLogs.entries.find(log => 
            log.target.channelId === channel.id && 
            log.createdTimestamp > (Date.now() - 5000)
        );

        if (!webhookLog) return;

        const { executor, target } = webhookLog;

        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('?? Webhook Baru Dibuat')
            .setDescription('Sebuah webhook baru telah dibuat di channel <#' + channel.id + '>.')
            .setThumbnail(executor.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '?? Pembuat', value: '' + executor.tag + ' (' + executor.id + ')', inline: true },
                { name: '?? Channel', value: '<#' + channel.id + '>', inline: true },
                { name: '?? ID Webhook', value: '' + target.id + '', inline: true },
                { name: '?? Nama Webhook', value: target.name, inline: true },
                { name: '?? Dibuat Pada', value: '<t:' + parseInt(target.createdTimestamp / 1000) + ':F>', inline: false }
            )
            .setTimestamp();

        logChannel.send({ embeds: [embed] }).catch(err => console.log('Gagal mengirim log webhook: ' + err));
    }
};
