const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'clear',
    description: 'Menghapus pesan secara massal.',
    userPermissions: [PermissionFlagsBits.ManageMessages],
    botPermissions: [PermissionFlagsBits.ManageMessages],
    args: true,
    usage: '<jumlah 1-100>',
    ownerOnly: false,
    category: 'moderation',
    async execute(message, args) {
        const amount = parseInt(args[0]);

        if (isNaN(amount) || amount < 1 || amount > 100) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Masukkan jumlah pesan antara 1 dan 100.')]
            });
        }

        await message.channel.bulkDelete(amount, true).catch(err => {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Tidak dapat menghapus pesan yang lebih dari 14 hari.')]
            });
        });

        const embed = new EmbedBuilder()
            .setColor('#23272A')
            .setDescription(`✅ Berhasil menghapus \`${amount}\` pesan.`)
            .setFooter({ text: `Dilakukan oleh ${message.author.tag}` })
            .setTimestamp();

        message.channel.send({ embeds: [embed] }).then(msg => {
            setTimeout(() => msg.delete(), 5000);
        });
    }
};