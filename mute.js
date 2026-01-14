const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'mute',
    description: 'Membisukan member.',
    userPermissions: [PermissionFlagsBits.ModerateMembers],
    botPermissions: [PermissionFlagsBits.ModerateMembers],
    args: true,
    usage: '<@member> [alasan minimal 10 karakter]',
    ownerOnly: false,
    category: 'moderation',
    async execute(message, args) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Member tidak ditemukan.')]
            });
        }

        if (member.id === message.author.id) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Anda tidak bisa membisukan diri sendiri.')]
            });
        }

        if (!member.moderatable) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Saya tidak bisa membisukan member ini.')]
            });
        }

        const reason = args.slice(1).join(' ') || 'Tidak ada alasan yang diberikan.';
        if (reason.length < 10 && args.length > 1) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Alasan harus memiliki minimal 10 karakter.')]
            });
        }

        await member.timeout(28 * 24 * 60 * 60 * 1000, reason); // Mute maksimal 28 hari

        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('🔇 Member Dibisukan (Timeout)')
            .addFields(
                { name: 'Member', value: `${member.user.tag} (${member.id})`, inline: true },
                { name: 'Moderator', value: `${message.author.tag}`, inline: true },
                { name: 'Alasan', value: reason, inline: false },
                { name: 'Durasi', value: '28 Hari (Maksimal)', inline: true }
            )
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};