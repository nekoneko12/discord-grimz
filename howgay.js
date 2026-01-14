const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'howgay',
    description: 'Menghitung seberapa "gay" seseorang.',
    args: false,
    usage: '[@user]',
    ownerOnly: false,
    category: 'fun',
    async execute(message, args) {
        const user = message.mentions.users.first() || message.author;
        const gayRate = Math.floor(Math.random() * 101);
        
        const embed = new EmbedBuilder()
            .setColor('#FF69B4') // Warna pink
            .setTitle(`🌈 Mesin Penghitung "Gay"`)
            .setDescription(`**${user.username}** adalah **${gayRate}%** gay!`)
            .setImage('https://imgur.com/a/WxBfUw2') // Ganti dengan GIF yang sesuai
            .setFooter({ text: 'Ini hanya untuk hiburan! 🏳️‍🌈', iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};