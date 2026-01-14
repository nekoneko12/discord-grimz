// commands/giveaway/giveaway.js
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'giveaway',
    aliases: ['gcreate', 'gstart'], // <-- TAMBAHKAN ALIASES DI SINI
    description: 'Memulai sebuah giveaway.',
    userPermissions: [PermissionFlagsBits.ManageMessages],
    args: true,
    usage: '<waktu> <jumlah pemenang> <hadiah minimal 10 karakter>',
    ownerOnly: false,
    category: 'giveaway',
    async execute(message, args, client) {
        if (!args[0] || !args[1] || !args[2]) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Format salah. Gunakan `!!giveaway <waktu> <jumlah pemenang> <hadiah>.`')]
            });
        }

        const giveawayChannel = message.channel;
        const giveawayDuration = args[0];
        const giveawayWinnerCount = parseInt(args[1]);
        const giveawayPrize = args.slice(2).join(' ');

        if (isNaN(giveawayWinnerCount) || giveawayWinnerCount < 1) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Jumlah pemenang harus berupa angka dan minimal 1.')]
            });
        }
        
        if (giveawayPrize.length < 10) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Hadiah harus memiliki minimal 10 karakter.')]
            });
        }

        const giveawayEmbed = new EmbedBuilder()
            .setColor('#43B581')
            .setTitle('🎉 GIVEAWAY! 🎉')
            .addFields(
                { name: 'Hadiah', value: `**${giveawayPrize}**`, inline: false },
                { name: 'Hosted By', value: `${message.author.tag}`, inline: true },
                { name: 'Pemenang', value: `**${giveawayWinnerCount}**`, inline: true },
                { name: 'Berakhir dalam', value: `<t:${parseInt((Date.now() + ms(giveawayDuration)) / 1000)}:R>`, inline: true }
            )
            .setTimestamp();

        const giveawayMessage = await giveawayChannel.send({ embeds: [giveawayEmbed] });
        await giveawayMessage.react('🎉');

        client.giveaways.set(giveawayMessage.id, {
            channelId: giveawayChannel.id,
            messageId: giveawayMessage.id,
            guildId: message.guild.id,
            prize: giveawayPrize,
            winnerCount: giveawayWinnerCount,
            host: message.author.id,
            endAt: Date.now() + ms(giveawayDuration)
        });

        message.delete().catch(() => {});
    }
};