const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'snipe',
    description: 'Melihat pesan yang terakhir dihapus di channel ini.',
    args: false,
    ownerOnly: false,
    category: 'unique',
    async execute(message, args, client) {
        const snipe = client.snipes.get(message.channel.id);
        if (!snipe) {
            return message.channel.send({
                embeds: [new EmbedBuilder().setColor('#23272A').setDescription('Tidak ada pesan yang bisa di-snipe di channel ini.')]
            });
        }

        const author = await message.client.users.fetch(snipe.author).catch(() => null);
        const embed = snipe.embed
            .setAuthor({ name: author ? author.tag : 'User Tidak Dikenal', iconURL: author ? author.displayAvatarURL() : null })
            .setFooter({ text: `Disnipe oleh ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

        message.channel.send({ embeds: [embed] });
    }
};