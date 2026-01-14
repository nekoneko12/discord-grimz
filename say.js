const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'say',
    description: 'Membuat bot mengatakan sesuatu.',
    userPermissions: [PermissionFlagsBits.ManageMessages],
    args: true,
    usage: '<pesan minimal 1 karakter>',
    ownerOnly: false,
    category: 'moderation',
    async execute(message, args) {
        const text = args.join(' ');
        if (text.length < 1) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Pesan harus memiliki minimal 15 karakter.')]
            });
        }

        message.delete().catch(() => {});
        message.channel.send(text);
    }
};