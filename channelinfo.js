// commands/info/channelinfo.js
const { EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    name: 'channelinfo',
    description: 'Menampilkan informasi lengkap tentang channel.',
    aliases: ['cinfo', 'channel'],
    args: false,
    usage: '[#channel]',
    ownerOnly: false,
    category: 'info',
    async execute(message) {
        const channel = message.mentions.channels.first() || message.channel;
        
        let typeString = 'Tidak Diketahui';
        if (channel.type === ChannelType.GuildText) typeString = 'Teks';
        if (channel.type === ChannelType.GuildVoice) typeString = 'Suara';
        if (channel.type === ChannelType.GuildCategory) typeString = 'Kategori';
        if (channel.type === ChannelType.GuildAnnouncement) typeString = 'Pengumuman';
        if (channel.type === ChannelType.GuildStageVoice) typeString = 'Stage';
        if (channel.type === ChannelType.GuildForum) typeString = 'Forum';

        const embed = new EmbedBuilder()
            .setColor('#2C2F33')
            .setTitle(`📝 Informasi Channel: ${channel.name}`)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .addFields(
                { name: '🆔 ID Channel', value: channel.id, inline: true },
                { name: '📋 Tipe', value: typeString, inline: true },
                { name: '📅 Dibuat Pada', value: `<t:${parseInt(channel.createdTimestamp / 1000)}:F>`, inline: true }
            )
            .setFooter({ text: `Diminta oleh ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        if (channel.type === ChannelType.GuildText) {
            embed.addFields(
                { name: '📖 Topik', value: channel.topic || 'Tidak ada topik', inline: false },
                { name: '🔒 NSFW', value: channel.nsfw ? 'Ya' : 'Tidak', inline: true },
                { name: '⏱️ Slowmode', value: channel.rateLimitPerUser === 0 ? 'Tidak ada' : `${channel.rateLimitPerUser} detik`, inline: true }
            );
        }

        if (channel.type === ChannelType.GuildVoice) {
            embed.addFields(
                { name: '👥 Pengguna Terhubung', value: `${channel.members.size}`, inline: true },
                { name: '👤 Batas Pengguna', value: channel.userLimit === 0 ? 'Tidak ada' : `${channel.userLimit}`, inline: true },
                { name: '🔊 Bitrate', value: `${channel.bitrate}kbps`, inline: true }
            );
        }

        message.channel.send({ embeds: [embed] });
    }
};