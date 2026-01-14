const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'unmute',
    description: 'Membuka bisu member.',
    userPermissions: [PermissionFlagsBits.ModerateMembers],
    botPermissions: [PermissionFlagsBits.ModerateMembers],
    args: true,
    usage: '<@member>',
    ownerOnly: false,
    category: 'moderation',
    async execute(message, args) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Member tidak ditemukan.')]
            });
        }
        
        if (!member.isCommunicationDisabled()) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Member ini sedang tidak dalam status bisu.')]
            });
        }

        await member.timeout(null);

        const embed = new EmbedBuilder()
            .setColor('#43B581')
            .setTitle('🔊 Member Dibuka Bisunya')
            .addFields(
                { name: 'Member', value: `${member.user.tag} (${member.id})`, inline: true },
                { name: 'Moderator', value: `${message.author.tag}`, inline: true }
            )
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};