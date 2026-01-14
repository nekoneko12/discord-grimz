// commands/info/botinfo.js
const { EmbedBuilder } = require('discord.js');
const os = require('os');
const ms = require('ms');

module.exports = {
    name: 'botinfo',
    description: 'Menampilkan informasi lengkap tentang bot.',
    aliases: ['bot'],
    args: false,
    ownerOnly: false,
    category: 'info',
    async execute(message, client) {
        const owner = await client.users.fetch(process.env.OWNER_ID);
        
        const embed = new EmbedBuilder()
            .setColor('#2C2F33')
            .setTitle('🤖 Informasi Bot')
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 256 }))
            .addFields(
                { name: '📝 Nama Bot', value: client.user.tag, inline: true },
                { name: '🆔 ID Bot', value: client.user.id, inline: true },
                { name: '👑 Pemilik Bot', value: `${owner.tag} (${owner.id})`, inline: false },
                { name: '📅 Dibuat Pada', value: `<t:${parseInt(client.user.createdTimestamp / 1000)}:F>`, inline: true },
                { name: '⏳ Uptime', value: `${ms(client.uptime, { long: true })}`, inline: true },
                { name: '🌐 Server', value: `${client.guilds.cache.size}`, inline: true },
                { name: '👥 Pengguna', value: `${client.users.cache.size}`, inline: true },
                { name: '📚 Library', value: `Discord.js v${require('discord.js').version}`, inline: true },
                { name: '🟢 Node.js', value: `${process.version}`, inline: true },
                { name: '💾 Penggunaan Memori', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true }
            )
            .setFooter({ text: `Diminta oleh ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};