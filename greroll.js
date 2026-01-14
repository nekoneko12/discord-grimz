// commands/giveaway/rerollgiveaway.js
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'rerollgiveaway',
    aliases: ['greroll', 'groll'], // <-- TAMBAHKAN ALIASES DI SINI
    description: 'Memilih ulang pemenang giveaway yang sudah berakhir.',
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

        const channel = message.mentions.channels.first() || message.channel;
        const giveawayMessage = await channel.messages.fetch(messageId).catch(() => null);

        if (!giveawayMessage) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Pesan giveaway tidak ditemukan. Pastikan ID benar dan bot memiliki akses ke channel tersebut.')]
            });
        }

        const reactions = giveawayMessage.reactions.cache.get('🎉');
        if (!reactions) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Tidak ada reaksi 🎉 di pesan giveaway tersebut.')]
            });
        }

        const users = await reactions.users.fetch();
        const participants = users.filter(u => !u.bot).array();

        if (participants.length === 0) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Tidak ada yang berpartisipasi dalam giveaway ini.')]
            });
        }

        const embedDescription = giveawayMessage.embeds[0]?.description;
        let winnerCount = 1;
        if (embedDescription && embedDescription.includes('Pemenang')) {
            const match = embedDescription.match(/\*\*(\d+)\*\*/);
            if (match) {
                winnerCount = parseInt(match[1]);
            }
        }
        
        const winners = [];
        for (let i = 0; i < Math.min(winnerCount, participants.length); i++) {
            const winner = participants.splice(Math.floor(Math.random() * participants.length), 1)[0];
            winners.push(winner);
        }

        const rerollEmbed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('🎉 Pemenang Giveaway Dipilih Ulang')
            .setDescription(`Pemenang baru untuk giveaway ini adalah... ${winners.map(w => `<@${w.id}>`).join(', ')}!`)
            .setTimestamp();

        message.channel.send({ embeds: [rerollEmbed] });
    }
};