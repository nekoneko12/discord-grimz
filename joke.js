const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'joke',
    description: 'Menceritakan lelucon acak.',
    args: false,
    ownerOnly: false,
    category: 'fun',
    async execute(message) {
        const jokes = [
            "Kenapa komputer jadi dokter? Karena dia punya banyak 'virus'!",
            "Apa bedanya guru dengan kalkulator? Guru bisa ngitung dosa, kalkulator ngitung angka doang.",
            "Masa lalu adalah sejarah, masa depan adalah misteri, dan hari ini adalah hadiah. Itulah kenapa disebut 'present'.",
            "Kenapa ikan tidak suka bermain komputer? Karena takut ketemu 'mouse'.",
            "Apa persamaannya kamu dengan tanggal 1 April? Sama-sama suka nge-prank."
        ];
        const joke = jokes[Math.floor(Math.random() * jokes.length)];

        const embed = new EmbedBuilder()
            .setColor('#23272A')
            .setTitle('😂 Lelucon Acak')
            .setDescription(joke)
            .setFooter({ text: `Diminta oleh ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};