// handlers/eventHandler.js (Versi Gabungan)
const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const moment = require('moment');

module.exports = (client) => {
    console.log('📂 Memuat Event Handler...');

    // --- Event: guildCreate ---
    client.on('guildCreate', async (guild) => {
        console.log('✅ Bot ditambahkan ke server: ' + guild.name);
        const logChannel = guild.channels.cache.find(ch => ch.name === 'bot-logs' && ch.type === 0);
        const owner = await guild.fetchOwner();
        let inviter = 'Tidak diketahui';
        try {
            const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.BotAdd });
            const botAddLog = fetchedLogs.entries.first();
            if (botAddLog && botAddLog.target.id === client.user.id) inviter = botAddLog.executor.tag;
        } catch (e) { console.log('Tidak bisa mengambil audit log.'); }
        const embed = new EmbedBuilder()
            .setColor('#43B581').setTitle('✅ Bot Ditambahkan ke Server')
            .setDescription('Saya telah ditambahkan ke server **' + guild.name + '**!')
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                { name: '🆔 ID Server', value: guild.id, inline: true },
                { name: '👑 Pemilik Server', value: '`' + owner.user.tag + '`', inline: true },
                { name: '👤 Diundang Oleh', value: inviter, inline: true },
                { name: '👥 Jumlah Member', value: '`' + guild.memberCount + '`', inline: true }
            ).setTimestamp();
        if (logChannel) logChannel.send({ embeds: [embed] }).catch(() => {});
        owner.send({ embeds: [new EmbedBuilder().setColor('#43B581').setTitle('Terima Kasih Telah Mengundang Saya!').setDescription('Hai! Saya siap membantu server Anda. Ketik `!!help` untuk memulai.').setThumbnail(client.user.displayAvatarURL()) ] }).catch(() => {});
    });

    // --- Event: messageDelete ---
    client.on('messageDelete', (message) => {
        if (message.author.bot || !message.content) return;
        const snipeEmbed = new EmbedBuilder()
            .setColor('#23272A').setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setDescription('> ' + message.content)
            .setFooter({ text: 'Dihapus di #' + message.channel.name + ' • ' + moment(message.createdAt).format('LLLL') }).setTimestamp();
        if (message.attachments.size > 0) snipeEmbed.setImage(message.attachments.first().url);
        client.snipes.set(message.channel.id, { embed: snipeEmbed, author: message.author.id, timestamp: Date.now() });
    });

    // --- Event: webhookUpdate ---
    client.on('webhookUpdate', async (channel) => {
        const logChannel = channel.guild.channels.cache.find(ch => ch.name === 'bot-logs' && ch.type === 0);
        if (!logChannel) return;
        const fetchedLogs = await channel.guild.fetchAuditLogs({ limit: 5, type: AuditLogEvent.WebhookCreate });
        const webhookLog = fetchedLogs.entries.find(log => log.target.channelId === channel.id && log.createdTimestamp > (Date.now() - 5000));
        if (!webhookLog) return;
        const { executor, target } = webhookLog;
        const embed = new EmbedBuilder()
            .setColor('#FFA500').setTitle('⚠️ Webhook Baru Dibuat')
            .setDescription('Sebuah webhook baru telah dibuat di channel <#' + channel.id + '>.')
            .setThumbnail(executor.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '👤 Pembuat', value: '`' + executor.tag + ' (' + executor.id + ')`', inline: true },
                { name: '💬 Channel', value: '<#' + channel.id + '>', inline: true },
                { name: '🆔 ID Webhook', value: '`' + target.id + '`', inline: true }
            ).setTimestamp();
        logChannel.send({ embeds: [embed] }).catch(err => console.log('Gagal mengirim log webhook: ' + err));
    });

    // --- Event: inviteCreate ---
    client.on('inviteCreate', async (invite) => {
        const logChannel = invite.guild.channels.cache.find(ch => ch.name === 'bot-logs' && ch.type === 0);
        if (!logChannel) return;
        const embed = new EmbedBuilder()
            .setColor('#3498DB').setTitle('🔗 Invite Baru Dibuat')
            .setDescription('Sebuah invite baru telah dibuat untuk server ini.')
            .setThumbnail(invite.inviter.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '👤 Pembuat', value: '`' + invite.inviter.tag + ' (' + invite.inviter.id + ')`', inline: true },
                { name: '🔗 Kode Invite', value: 'https://discord.gg/' + invite.code, inline: true },
                { name: '💬 Channel', value: '<#' + invite.channelId + '>', inline: true }
            ).setTimestamp();
        logChannel.send({ embeds: [embed] }).catch(err => console.log('Gagal mengirim log invite: ' + err));
    });

    console.log('✅ Semua event berhasil dimuat.');
};