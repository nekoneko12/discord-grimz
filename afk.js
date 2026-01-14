// commands/fun/afk.js
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'afk',
    description: 'Mengatur status AFK Anda.',
    args: false,
    usage: '[alasan minimal 10 karakter]',
    ownerOnly: false,
    category: 'fun',
    async execute(message, args, client) {
        // PINDAHKAN ke dalam sini agar 'args' terbaca
        const reason = args.join(' ') || 'Tidak ada alasan';

        // Logika minimal 10 karakter (hanya jika user memberikan alasan)
        if (args.length > 0 && reason.length < 0) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Alasan AFK harus memiliki minimal 10 karakter.')]
            });
        }

        // Cek permission bot untuk mengubah nickname
        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageNicknames)) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Saya tidak memiliki izin untuk mengubah nickname.')]
            });
        }

        // Cek apakah user sudah AFK
        if (client.afk.has(message.author.id)) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#FFA500').setDescription('⚠️ Anda sudah dalam status AFK.')]
            });
        }

        // Simpan data AFK
        const originalNickname = message.member.nickname || message.author.username;
        client.afk.set(message.author.id, {
            reason: reason,
            nickname: originalNickname
        });

        // Ubah nickname menjadi [AFK] Nama
        const newNickname = `[AFK] ${originalNickname}`;
        try {
            if (newNickname.length > 32) {
                await message.member.setNickname(`[AFK] ${originalNickname.slice(0, 25)}`);
            } else {
                await message.member.setNickname(newNickname);
            }
        } catch (err) {
            console.log('Gagal mengubah nickname (biasanya karena Role bot di bawah user): ' + err);
        }

        const embed = new EmbedBuilder()
            .setColor('#23272A')
            .setTitle('💤 Status AFK Diatur')
            .setDescription(`Saya telah mengatur status AFK Anda sebagai **#MAMADGANG** member.`)
            .addFields(
                { name: 'Alasan', value: `*${reason}*`, inline: false },
                { name: 'Cara membatalkan', value: 'Ketik apa saja di chat untuk membatalkan status AFK.', inline: false }
            )
            .setTimestamp();

        message.channel.send({ embeds: [embed] }).then(msg => {
            setTimeout(() => {
                if (msg.deletable) msg.delete().catch(() => null);
            }, 10000);
        });
    }
};