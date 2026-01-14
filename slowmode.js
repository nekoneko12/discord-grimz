const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'slowmode',
    description: 'Mengatur slowmode pada channel.',
    userPermissions: [PermissionFlagsBits.ManageChannels],
    botPermissions: [PermissionFlagsBits.ManageChannels],
    args: true,
    usage: '<detik>',
    ownerOnly: false,
    category: 'moderation',
    async execute(message, args) {
        const amount = parseInt(args[0]);
        if (isNaN(amount)) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Masukkan angka yang valid untuk detik.')]
            });
        }

        if (amount > 21600) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Slowmode tidak bisa lebih dari 21600 detik (6 jam).')]
            });
        }

        await message.channel.setRateLimitPerUser(amount);

        const embed = new EmbedBuilder()
            .setColor('#23272A')
            .setTitle('⏱️ Slowmode Diatur')
            .setDescription(`Slowmode untuk channel ini telah diatur menjadi \`${amount}\` detik.`)
            .setFooter({ text: `Diatur oleh ${message.author.tag}` })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};