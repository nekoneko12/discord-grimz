// commands/owner/stats.js
const { EmbedBuilder } = require('discord.js');
const os = require('os');
const ms = require('ms');

module.exports = {
    name: 'stats',
    description: 'Menampilkan statistik detail bot dan sistem.',
    ownerOnly: true,
    category: 'owner',
    async execute(message, client) {

        // --- Statistik Bot ---
        const guildCount = client.guilds.cache.size;
        const userCount = client.users.cache.size;
        const channelCount = client.channels.cache.size;
        const commandCount = client.commands.size;
        const uptime = ms(client.uptime, { long: true });
        const nodeVersion = process.version;
        const djsVersion = require('discord.js').version;
        const botMemoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

        // --- Statistik Sistem ---
        const cpuModel = os.cpus()[0].model;
        const osPlatform = os.platform();
        const osArch = os.arch();
        const totalMemory = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const freeMemory = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
        const usedMemory = (totalMemory - freeMemory).toFixed(2);

        const embed = new EmbedBuilder()
            .setColor('#2C2F33') // Warna abu-abu gelap
            .setTitle('📊 Statistik Bot & Sistem')
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 256 }))
            .addFields(
                // Bagian Statistik Bot
                { 
                    name: '🤖 Statistik Bot', 
                    value: 
                        `**📡 Server:** \`${guildCount}\`\n` +
                        `**👥 Pengguna:** \`${userCount}\`\n` +
                        `**💬 Channel:** \`${channelCount}\`\n` +
                        `**⌨️ Commands:** \`${commandCount}\`\n` +
                        `**⏳ Uptime:** \`${uptime}\`\n` +
                        `**💾 Memory Bot:** \`${botMemoryUsage} MB\`\n` +
                        `**📚 Discord.js:** \`v${djsVersion}\`\n` +
                        `**🟢 Node.js:** \`${nodeVersion}\``
                    , inline: false 
                },
                // Bagian Statistik Sistem
                { 
                    name: '💻 Statistik Sistem', 
                    value:
                        `**🖥️ OS:** \`${osPlatform} (${osArch})\`\n` +
                        `**🔧 CPU:** \`${cpuModel}\`\n` +
                        `**💾 Total Memory:** \`${totalMemory} GB\`\n` +
                        `**📉 Memory Digunakan:** \`${usedMemory} GB\`\n` +
                        `**📈 Memory Tersedia:** \`${freeMemory} GB\``
                    , inline: false 
                }
            )
            .setFooter({ text: `Diminta oleh ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};