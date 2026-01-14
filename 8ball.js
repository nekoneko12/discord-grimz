const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: '8ball',
    description: 'Menanyakan sesuatu kepada bola 8 ajaib.',
    args: true,
    usage: '<pertanyaan minimal 10 karakter>',
    ownerOnly: false,
    category: 'fun',
    async execute(message, args) {
        const question = args.join(' ');
        if (question.length < 10) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Pertanyaan harus memiliki minimal 10 karakter.')]
            });
        }
        
        const responses = [
            "Tidak.", "Ya.", "Mungkin.", "Tidak mungkin.", "Coba tanya lagi.",
            "Saya tidak tahu.", "Tentu saja.", "Jelas tidak.", "Fokus dan tanya lagi.",
            "Tanda-tanda menunjukkan ya.", "Jangan mengandalkannya.", "Perspektif yang baik.", "Sangat diragukan."
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];

        const embed = new EmbedBuilder()
            .setColor('#23272A')
            .setTitle('🎱 Bola 8 Ajaib')
            .addFields(
                { name: '❓ Pertanyaan', value: question, inline: false },
                { name: '🎱 Jawaban', value: response, inline: false }
            )
            .setFooter({ text: `Ditanya oleh ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};