const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'inviteCreate',
    async execute(invite, client) {
        const logChannel = invite.guild.channels.cache.find(ch => ch.name === 'bot-logs' && ch.type === 0);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setColor('#3498DB')
            .setTitle('?? Invite Baru Dibuat')
            .setDescription('Sebuah invite baru telah dibuat untuk server ini.')
            .setThumbnail(invite.inviter.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '?? Pembuat', value: '' + invite.inviter.tag + ' (' + invite.inviter.id + ')', inline: true },
                { name: '?? Kode Invite', value: 'https://discord.gg/' + invite.code, inline: true },
                { name: '?? Channel', value: '<#' + invite.channelId + '>', inline: true },
                { name: '? Kadaluarsa', value: invite.maxAge ? '<t:' + parseInt((Date.now() + invite.maxAge * 1000) / 1000) + ':R>' : 'Tidak pernah', inline: true },
                { name: '?? Penggunaan Maksimal', value: invite.maxUses ? invite.maxUses.toString() : 'Tidak terbatas', inline: true },
                { name: '?? Sementara', value: invite.temporary ? 'Ya' : 'Tidak', inline: true }
            )
            .setTimestamp();

        logChannel.send({ embeds: [embed] }).catch(err => console.log('Gagal mengirim log invite: ' + err));
    }
};
