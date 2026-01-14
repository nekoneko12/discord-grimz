// commands/info/help.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Menampilkan semua command yang tersedia.',
    aliases: ['commands'],
    args: false,
    ownerOnly: false,
    category: 'info',
    async execute(message, args, client) {
        const embed = new EmbedBuilder()
            .setColor('#23272A')
            .setTitle('📖 Pusat Bantuan')
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 256 }))
            .setDescription(`Halo, saya adalah **${client.user.username}**. Bot yang dirancang untuk membantu mengelola server Anda dengan elegan dan efisien. Berikut adalah daftar command yang tersedia.`)
            .addFields(
                { 
                    name: '🔨 **Moderation**', 
                    value: '`kick`, `ban`, `clear`, `slowmode`, `lock`, `unlock`, `mute`, `unmute`, `timeout`, `untimeout`, `warn`, `unwarn`, `say`, `embed`, `addrole`, `removerole`',
                    inline: false 
                },
                { 
                    name: 'ℹ️ **Information**', 
                    value: '`help`, `serverinfo`, `userinfo`, `ping`, `avatar`, `botinfo`, `channelinfo`, `roles`, `about`',
                    inline: false 
                },
                { 
                    name: '🎉 **Giveaway**', 
                    value: '`giveaway (gcreate, gstart)`, `endgiveaway (gend, gstop)`, `rerollgiveaway (greroll, groll)`',
                    inline: false 
                },
                { 
                    name: '🎲 **Fun**', 
                    value: '`afk`, `ppsize`, `8ball`, `meme`, `roll`, `coinflip`, `howgay`, `rate`, `roast`, `ascii`, `joke`',
                    inline: false 
                },
                { 
                    name: '⭐ **Unique**', 
                    value: '`snipe`, `setuplogs`',
                    inline: false 
                }
            )
            .setFooter({ text: `Prefix saya adalah "!!" | Diminta oleh ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};