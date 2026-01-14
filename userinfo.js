const { EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
    name: 'userinfo',
    description: 'Menampilkan informasi lengkap tentang user.',
    args: false,
    usage: '[@user]',
    ownerOnly: false,
    category: 'info',
    async execute(message, args) {
        const user = message.mentions.users.first() || message.author;
        const member = message.guild.members.cache.get(user.id);
        const joinedDiscord = moment(user.createdTimestamp).format('LLLL');
        const joinedServer = moment(member.joinedTimestamp).format('LLLL');
        
        const embed = new EmbedBuilder()
            .setColor('#23272A')
            .setTitle(`👤 Informasi User: ${user.username}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
            .addFields(
                { name: '🆔 ID User', value: user.id, inline: true },
                { name: '🤖 Bot?', value: user.bot ? 'Ya' : 'Tidak', inline: true },
                { name: '📅 Bergabung ke Discord', value: `<t:${parseInt(user.createdTimestamp / 1000)}:F>\n*${joinedDiscord}*`, inline: false },
                { name: '🏠 Bergabung ke Server', value: `<t:${parseInt(member.joinedTimestamp / 1000)}:F>\n*${joinedServer}*`, inline: false },
                { name: '🎭 Role', value: member.roles.cache.map(r => r).join(' ') || 'Tidak ada role', inline: false }
            )
            .setFooter({ text: `Diminta oleh ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};