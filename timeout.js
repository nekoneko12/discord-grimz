// commands/moderation/timeout.js
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'timeout',
    description: 'Memberikan timeout kepada member untuk durasi tertentu.',
    userPermissions: [PermissionFlagsBits.ModerateMembers],
    botPermissions: [PermissionFlagsBits.ModerateMembers],
    args: true,
    usage: '<@member> <durasi> [alasan minimal 10 karakter]',
    examples: [
        '!!timeout @user 10m Berkata kasar',
        '!!timeout @user 1h Spam chat',
        '!!timeout @user 1d Melanggar aturan server'
    ],
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
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Anda tidak bisa memberi timeout pada diri sendiri.')]
            });
        }

        if (!member.moderatable) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Saya tidak bisa memberi timeout pada member ini.')]
            });
        }

        const time = args[1];
        if (!time) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Anda harus memasukkan durasi. Contoh: `10m`, `1h`, `1d`.')]
            });
        }

        const msTime = ms(time);
        if (!msTime) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Durasi tidak valid. Contoh: `10m`, `1h`, `1d`.')]
            });
        }

        const reason = args.slice(2).join(' ') || 'Tidak ada alasan yang diberikan.';
        if (reason.length < 10 && args.length > 2) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Alasan harus memiliki minimal 10 karakter.')]
            });
        }

        await member.timeout(msTime, reason);

        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('⏳ Member Diberi Timeout')
            .addFields(
                { name: 'Member', value: `${member.user.tag} (${member.id})`, inline: true },
                { name: 'Moderator', value: `${message.author.tag}`, inline: true },
                { name: 'Durasi', value: `\`${time}\``, inline: true },
                { name: 'Alasan', value: reason, inline: false }
            )
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};