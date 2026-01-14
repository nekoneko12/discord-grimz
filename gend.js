// commands/giveaway/endgiveaway.js
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'endgiveaway',
    aliases: ['gend', 'gstop'], // <-- TAMBAHKAN ALIASES DI SINI
    description: 'Mengakhiri giveaway secara paksa.',
    userPermissions: [PermissionFlagsBits.ManageMessages],
    args: true,
    usage: '<ID pesan giveaway>',
    ownerOnly: false,
    category: 'giveaway',
    async execute(message, args, client) {
        const messageId = args[0];
        if (!messageId) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Masukkan ID pesan giveaway.')]
            });
        }

        const giveaway = client.giveaways.get(messageId);
        if (!giveaway) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Giveaway dengan ID tersebut tidak ditemukan.')]
            });
        }

        const channel = client.channels.cache.get(giveaway.channelId);
        if (!channel) return;

        const giveawayMessage = await channel.messages.fetch(giveaway.messageId).catch(() => null);
        if (!giveawayMessage) return;

        const reactions = giveawayMessage.reactions.cache.get('🎉');
        if (!reactions) {
            const embed = new EmbedBuilder()
                .setColor('#992D22')
                .setTitle('🎉 Giveaway Berakhir')
                .setDescription(`Giveaway untuk **${giveaway.prize}** telah berakhir.\nTidak ada pemenang karena tidak ada yang berpartisipasi.`);
            giveawayMessage.edit({ embeds: [embed] });
            return client.giveaways.delete(messageId);
        }

        const users = await reactions.users.fetch();
        const participants = users.filter(u => !u.bot).array();

        if (participants.length === 0) {
            const embed = new EmbedBuilder()
                .setColor('#992D22')
                .setTitle('🎉 Giveaway Berakhir')
                .setDescription(`Giveaway untuk **${giveaway.prize}** telah berakhir.\nTidak ada pemenang karena tidak ada yang berpartisipasi.`);
            giveawayMessage.edit({ embeds: [embed] });
            return client.giveaways.delete(messageId);
        }

        const winners = [];
        for (let i = 0; i < Math.min(giveaway.winnerCount, participants.length); i++) {
            const winner = participants.splice(Math.floor(Math.random() * participants.length), 1)[0];
            winners.push(winner);
        }

        const embed = new EmbedBuilder()
            .setColor('#43B581')
            .setTitle('🎉 Giveaway Berakhir')
            .setDescription(`Selamat kepada ${winners.map(w => `<@${w.id}>`).join(', ')}! Anda memenangkan **${giveaway.prize}**!`)
            .setTimestamp();

        giveawayMessage.edit({ embeds: [embed] });
        channel.send(`Selamat ${winners.map(w => `<@${w.id}>`).join(', ')}! 🎉`);
        
        client.giveaways.delete(messageId);
    }
};