const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'rate',
    description: 'Menilai sesuatu dari skala 1-10.',
    args: true,
    usage: '<sesuatu yang akan dinilai minimal 5 karakter>',
    ownerOnly: false,
    category: 'fun',
    async execute(message, args) {
        const thingToRate = args.join(' ');
        if (thingToRate.length < 5) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Harus minimal 5 karakter untuk dinilai.')]
            });
        }
        const rating = Math.floor(Math.random() * 10) + 1;
        
        const embed = new EmbedBuilder()
            .setColor('#23272A')
            .setTitle('⭐ Penilai')
            .addFields(
                { name: '📝 Dinilai', value: thingToRate, inline: false },
                { name: '⭐ Nilai', value: `**${rating}/10**`, inline: false }
            )
            .setFooter({ text: `Diminta oleh ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};