const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'warn',
    description: 'Memberikan peringatan kepada member.',
    userPermissions: [PermissionFlagsBits.KickMembers], // Menggunakan kick sebagai acuan level mod
    args: true,
    usage: '<@member> <alasan minimal 10 karakter>',
    ownerOnly: false,
    category: 'moderation',
    async execute(message, args) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Member tidak ditemukan.')]
            });
        }

        const reason = args.slice(1).join(' ');
        if (!reason || reason.length < 10) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Anda harus memberikan alasan minimal 10 karakter.')]
            });
        }

        const warnsPath = './warns.json';
        let warns = {};
        if (fs.existsSync(warnsPath)) {
            warns = JSON.parse(fs.readFileSync(warnsPath));
        }

        if (!warns[member.id]) warns[member.id] = [];
        warns[member.id].push({
            moderator: message.author.id,
            reason: reason,
            timestamp: new Date().toISOString()
        });

        fs.writeFileSync(warnsPath, JSON.stringify(warns, null, 2));

        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('⚠️ Member Diberi Peringatan')
            .addFields(
                { name: 'Member', value: `${member.user.tag} (${member.id})`, inline: true },
                { name: 'Moderator', value: `${message.author.tag}`, inline: true },
                { name: 'Alasan', value: reason, inline: false },
                { name: 'Total Peringatan', value: `${warns[member.id].length}`, inline: true }
            )
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};