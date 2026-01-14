const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'nuke',
    description: 'Menghapus semua channel dan membuat ulang.',
    ownerOnly: true,
    args: false,
    category: 'owner',
    async execute(message) {
        await message.reply({
            embeds: [new EmbedBuilder().setColor('#FF0000').setDescription('⚠️ **PERINGATAN!** Perintah ini akan menghapus SEMUA channel di server ini. Konfirmasi dengan mengetik `ya` dalam 10 detik.')]
        });

        const filter = m => m.author.id === message.author.id && m.content.toLowerCase() === 'ya';
        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 10000 });

        collector.on('collect', async () => {
            await message.guild.channels.cache.forEach(channel => channel.delete().catch(() => {}));
            
            // Membuat channel kategori dan teks baru
            const category = await message.guild.channels.create({
                name: 'General',
                type: 4 // GUILD_CATEGORY
            });
            
            await message.guild.channels.create({
                name: 'general',
                type: 0, // GUILD_TEXT
                parent: category.id
            });

            const newChannel = message.guild.channels.cache.find(ch => ch.name === 'general');
            if(newChannel) {
                newChannel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#43B581')
                            .setTitle('💥 Server Telah Dinuked!')
                            .setDescription(`Server ini telah di-nuke oleh **${message.author.tag}**.`)
                            .setTimestamp()
                    ]
                });
            }
        });

        collector.on('end', (collected) => {
            if (collected.size === 0) {
                message.channel.send('Dibatalkan.');
            }
        });
    }
};