// handlers/giveawayHandler.js
const { EmbedBuilder } = require('discord.js');

module.exports = (client) => {
    setInterval(async () => {
        if (client.giveaways.size === 0) return;

        const now = Date.now();
        const giveawaysToEnd = client.giveaways.filter(g => now >= g.endAt);

        if (giveawaysToEnd.size === 0) return;

        giveawaysToEnd.forEach(async (giveaway) => {
            try {
                const channel = await client.channels.fetch(giveaway.channelId).catch(() => null);
                if (!channel) return client.giveaways.delete(giveaway.messageId);

                const giveawayMessage = await channel.messages.fetch(giveaway.messageId).catch(() => null);
                if (!giveawayMessage) return client.giveaways.delete(giveaway.messageId);

                const reactions = giveawayMessage.reactions.cache.get('🎉');
                if (!reactions) {
                    const embed = new EmbedBuilder()
                        .setColor('#992D22')
                        .setTitle('🎉 Giveaway Berakhir')
                        .setDescription(`Giveaway untuk **${giveaway.prize}** telah berakhir.\nTidak ada pemenang karena tidak ada yang berpartisipasi.`);
                    giveawayMessage.edit({ embeds: [embed] }).catch(() => {});
                    return client.giveaways.delete(giveaway.messageId);
                }

                const users = await reactions.users.fetch();
                const participants = users.filter(u => !u.bot).array();

                if (participants.length === 0) {
                    const embed = new EmbedBuilder()
                        .setColor('#992D22')
                        .setTitle('🎉 Giveaway Berakhir')
                        .setDescription(`Giveaway untuk **${giveaway.prize}** telah berakhir.\nTidak ada pemenang karena tidak ada yang berpartisipasi.`);
                    giveawayMessage.edit({ embeds: [embed] }).catch(() => {});
                    return client.giveaways.delete(giveaway.messageId);
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

                await giveawayMessage.edit({ embeds: [embed] }).catch(() => {});
                await channel.send(`Selamat ${winners.map(w => `<@${w.id}>`).join(', ')}! 🎉`).catch(() => {});
                
                client.giveaways.delete(giveaway.messageId);

            } catch (error) {
                console.error(`Gagal mengakhiri giveaway ${giveaway.messageId}:`, error);
                client.giveaways.delete(giveaway.messageId);
            }
        });

    }, 5000); // Dijalankan setiap 5 detik
};