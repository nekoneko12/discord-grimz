// commands/info/about.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'about',
    description: 'Menampilkan informasi tentang bot ini.',
    aliases: ['info'],
    args: false,
    ownerOnly: false,
    category: 'info',
    async execute(message, client) {
        const owner = await client.users.fetch(process.env.OWNER_ID);

        const embed = new EmbedBuilder()
            .setColor('#2C2F33')
            .setTitle(`Tentang ${client.user.username}`)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 256 }))
            .setDescription(`**${client.user.username}** adalah bot Discord yang dikembangkan dengan fokus pada kemudahan penggunaan, keandalan, dan desain yang elegan. Bot ini dirancang untuk membantu moderator dalam mengelola server, menyediakan berbagai command informatif dan menyenangkan, serta memastikan komunitas Anda tetap aman dan teratur.`)
            .addFields(
                { name: '👑 Pengembang', value: `${owner.tag}`, inline: true },
                { name: '📚 Library', value: `Discord.js v${require('discord.js').version}`, inline: true },
                { name: '🔗 Link Undangan', value: `[Klik di sini untuk mengundang saya]([https://discord.com/oauth2/authorize?client_id=1457426008318808257&permissions=8&integration_type=0&scope=bot])`, inline: false } // Ganti dengan link undangan bot Anda
            )
            .setImage(client.user.displayAvatarURL({ dynamic: true, size: 1024 })) // Menampilkan avatar besar
            .setFooter({ text: `Terima kasih telah menggunakan ${client.user.username}!`, iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};