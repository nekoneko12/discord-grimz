const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'roll',
    description: 'Mengocok dadu.',
    args: false,
    usage: '[jumlah sisi, default 6]',
    ownerOnly: false,
    category: 'fun',
    async execute(message, args) {
        let sides = 6;
        if (args[0]) {
            sides = parseInt(args[0]);
            if (isNaN(sides) || sides < 2 || sides > 100) {
                return message.reply({
                    embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Jumlah sisi harus antara 2 dan 100.')]
                });
            }
        }
        
        const result = Math.floor(Math.random() * sides) + 1;
        
        const embed = new EmbedBuilder()
            .setColor('#23272A')
            .setTitle('🎲 Mengocok Dadu')
            .setDescription(`${message.author.username} mengocok dadu **${sides}** sisi...`)
            .addFields(
                { name: 'Hasilnya', value: `**${result}**`, inline: false }
            )
            .setFooter({ text: `Diminta oleh ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};