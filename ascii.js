const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ascii',
    description: 'Mengubah teks menjadi bentuk ASCII.',
    args: true,
    usage: '<teks minimal 5 karakter>',
    ownerOnly: false,
    category: 'fun',
    async execute(message, args) {
        const text = args.join(' ');
        if (text.length < 5) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Teks harus memiliki minimal 5 karakter.')]
            });
        }
        if (text.length > 20) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Teks terlalu panjang, maksimal 20 karakter.')]
            });
        }

        // Font dari figlet-api
        const figlet = require('figlet');
        figlet.text(text, {
            font: 'Standard',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        }, function(err, data) {
            if (err) {
                return message.reply({
                    embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Terjadi kesalahan.')]
                });
            }
            message.channel.send(`\`\`\`${data}\`\`\``);
        });
    }
};