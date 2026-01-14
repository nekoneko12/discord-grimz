const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'lock',
    description: 'Mengunci channel agar tidak bisa dikirim pesan.',
    userPermissions: [PermissionFlagsBits.ManageChannels],
    botPermissions: [PermissionFlagsBits.ManageChannels],
    args: false,
    ownerOnly: false,
    category: 'moderation',
    async execute(message, args) {
        const channel = message.channel;
        const reason = args.join(' ') || 'Tidak ada alasan yang diberikan.';
        if (reason.length < 10 && args.length > 0) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Alasan harus memiliki minimal 10 karakter.')]
            });
        }

        await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
            SendMessages: false
        });

        const embed = new EmbedBuilder()
            .setColor('#992D22')
            .setTitle('🔒 Channel Dikunci')
            .setDescription(`Channel ini telah dikunci. Tidak ada yang bisa mengirim pesan.`)
            .addFields(
                { name: 'Alasan', value: reason, inline: false },
                { name: 'Moderator', value: message.author.tag, inline: true }
            )
            .setTimestamp();

        channel.send({ embeds: [embed] });
    }
};