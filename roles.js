// commands/info/roles.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'roles',
    description: 'Menampilkan semua role yang ada di server.',
    aliases: ['rolelist'],
    args: false,
    ownerOnly: false,
    category: 'info',
    async execute(message) {
        const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
        const totalRoles = roles.length;

        const embed = new EmbedBuilder()
            .setColor('#2C2F33')
            .setTitle('🎭 Daftar Role Server')
            .setDescription(`Berikut adalah daftar semua role di server **${message.guild.name}** (Total: ${totalRoles})`)
            .addFields(
                { name: 'Roles', value: roles.length > 0 ? roles.join(' ') : 'Tidak ada role.', inline: false }
            )
            .setFooter({ text: `Diminta oleh ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        // Jika terlalu banyak role, kirim sebagai file atau bagi menjadi beberapa embed
        if (roles.join(' ').length > 1024) {
            embed.setDescription(`Berikut adalah daftar role di server **${message.guild.name}** (Total: ${totalRoles}).\n\nDaftar role terlalu panjang untuk ditampilkan di embed.`);
            message.channel.send({ embeds: [embed] });
            return message.channel.send(`\`\`\`${roles.join(', ')}\`\`\``, { code: 'md' });
        }

        message.channel.send({ embeds: [embed] });
    }
};