const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Memblokir member dari server.',
    userPermissions: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],
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
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Anda tidak bisa memblokir diri sendiri.')]
            });
        }

        if (!member.bannable) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Saya tidak bisa memblokir member ini. Mungkin perannya lebih tinggi dari saya.')]
            });
        }

        const reason = args.slice(1).join(' ') || 'Tidak ada alasan yang diberikan.';
        if (reason.length < 10 && args.length > 1) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Alasan harus memiliki minimal 10 karakter.')]
            });
        }

        await member.ban({ reason: reason });

        const embed = new EmbedBuilder()
            .setColor('#992D22')
            .setTitle('🔨 Member Diban')
            .addFields(
                { name: 'Member', value: `${member.user.tag} (${member.id})`, inline: true },
                { name: 'Moderator', value: `${message.author.tag}`, inline: true },
                { name: 'Alasan', value: reason, inline: false }
            )
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};