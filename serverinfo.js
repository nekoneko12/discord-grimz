const { EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
    name: 'serverinfo',
    description: 'Menampilkan informasi lengkap tentang server.',
    args: false,
    ownerOnly: false,
    category: 'info',
    async execute(message) {
        const { guild } = message;
        const owner = await guild.fetchOwner();
        
        const embed = new EmbedBuilder()
            .setColor('#23272A')
            .setTitle(`📊 Informasi Server: ${guild.name}`)
            .setThumbnail(guild.iconURL({ dynamic: true, size: 256 }))
            .addFields(
                { name: '🆔 ID Server', value: guild.id, inline: true },
                { name: '👑 Pemilik Server', value: `${owner.user.tag} (${owner.id})`, inline: true },
                { name: '📅 Dibuat Pada', value: `<t:${parseInt(guild.createdTimestamp / 1000)}:F>`, inline: false },
                { name: '👥 Anggota', value: `Total: **${guild.memberCount}**\nManusia: **${guild.members.cache.filter(m => !m.user.bot).size}**\nBot: **${guild.members.cache.filter(m => m.user.bot).size}**`, inline: true },
                { name: '💬 Channel', value: `Total: **${guild.channels.cache.size}**\nTeks: **${guild.channels.cache.filter(c => c.type === 0).size}**\nSuara: **${guild.channels.cache.filter(c => c.type === 2).size}**`, inline: true },
                { name: '🎭 Role', value: `**${guild.roles.cache.size}** Role`, inline: true },
                { name: '🌍 Region', value: `${guild.preferredLocale.toUpperCase()}`, inline: true },
                { name: '🔒 Tingkat Keamanan', value: `**${guild.verificationLevel}**`, inline: true },
                { name: '🚀 Boost Level', value: `Level **${guild.premiumTier}** dengan **${guild.premiumSubscriptionCount || 0}** Boost`, inline: true }
            )
            .setImage(guild.bannerURL({ dynamic: true, size: 1024 }))
            .setFooter({ text: `Diminta oleh ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};