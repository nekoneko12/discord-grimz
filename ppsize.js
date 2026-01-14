const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ppsize',
    description: 'Melihat ukuran "sesuatu" seseorang secara acak.',
    args: false,
    usage: '[@user]',
    ownerOnly: false,
    category: 'fun',
    async execute(message, args) {
        const user = message.mentions.users.first() || message.author;
        const sizes = [
            "8D", "8=D", "8==D", "8===D", "8====D", 
            "8=====D", "8======D", "8=======D", "8========D", "8=========D",
            "8==========D", "8===========D", "8============D", "8=============D", "8==============D"
        ];
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
        const cm = Math.floor(Math.random() * 30) + 1; // 1-30 cm

        const embed = new EmbedBuilder()
            .setColor('#23272A')
            .setTitle(`📏 Ukuran "Alat" ${user.username}`)
            .setDescription(`Ukuran milik **${user.username}** adalah...\n\n**${randomSize}**\n\nEstimasi: **${cm} CM**`)
            .setImage('https://imgur.com/a/72YVkms') // Ganti dengan GIF yang sesuai jika perlu
            .setFooter({ text: 'Ini hanya untuk hiburan, jangan diseriusin! 😂', iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};