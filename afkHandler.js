// handlers/afkHandler.js
const { EmbedBuilder } = require('discord.js');

module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        // Jangan proses jika bot, atau jika pesan adalah command AFK itu sendiri
        if (message.author.bot) return;
        if (message.content.startsWith('!!afk')) return; // TAMBAHKAN BARIS INI

        // --- LOGIKA UNTUK USER YANG KEMBALI DARI AFK ---
        if (client.afk.has(message.author.id)) {
            const afkData = client.afk.get(message.author.id);
            client.afk.delete(message.author.id);

            // Kembalikan nickname (Hanya jika bot punya izin)
            if (message.guild.members.me.permissions.has('ManageNicknames')) {
                message.member.setNickname(afkData.nickname).catch(err => console.log('Gagal reset nickname: ' + err));
            }

            const embed = new EmbedBuilder()
                .setColor('#43B581')
                .setDescription(`👋 Selamat datang kembali, **${message.author.username}!**`)
                .addFields({ name: 'Status AFK Berakhir', value: `Sebelumnya AFK dengan alasan: *${afkData.reason}*` })
                .setTimestamp();
            
            message.channel.send({ embeds: [embed] }).then(msg => {
                setTimeout(() => {
                    if (msg.deletable) msg.delete();
                }, 10000); 
            });
        }

        // --- LOGIKA UNTUK MENDAPATKAN USER YANG DI-TAG ---
        if (message.mentions.members.size > 0) {
            message.mentions.members.forEach(member => {
                // Pastikan tidak merespon jika user men-tag dirinya sendiri saat kembali
                if (member.id !== message.author.id && client.afk.has(member.id)) {
                    const afkData = client.afk.get(member.id);
                    const embed = new EmbedBuilder()
                        .setColor('#FFA500')
                        .setDescription(`💤 **${member.user.username}** sedang AFK.`)
                        .addFields({ name: 'Alasan', value: `*${afkData.reason}*` })
                        .setTimestamp();
                    
                    message.reply({ embeds: [embed] });
                }
            });
        }
    });
};