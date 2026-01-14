// commands/info/avatar.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'avatar',
    description: 'Menampilkan avatar pengguna dalam resolusi tinggi.',
    aliases: ['av', 'pfp'],
    args: false,
    usage: '[@user]',
    ownerOnly: false,
    category: 'info',
    async execute(message, args) {
        const user = message.mentions.users.first() || message.author;

        const embed = new EmbedBuilder()
            .setColor('#2C2F33')
            .setTitle(`🖼️ Avatar ${user.username}`)
            .setDescription(`**[Unduh Avatar (128x128)](${user.displayAvatarURL({ size: 128, extension: 'png' })})** | **[Unduh Avatar (1024x1024)](${user.displayAvatarURL({ size: 1024, extension: 'png' })})** | **[Unduh Avatar (4096x4096)](${user.displayAvatarURL({ size: 4096, extension: 'png' })})**`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
            .setFooter({ text: `Diminta oleh ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};