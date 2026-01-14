const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'roast',
    description: 'Memberikan "roast" (ejekan) acak.',
    args: false,
    usage: '[@user]',
    ownerOnly: false,
    category: 'fun',
    async execute(message, args) {
        const user = message.mentions.users.first() || message.author;
        const roasts = [
            "Kamu begitu buruknya, bahkan CDI kamu gagal.",
            "Wajah kamu bisa membuat bawang menangis.",
            "Kamu punya dua bagian otak, 'kiri' dan 'kanan'. Di bagian kiri, tidak ada yang benar. Dan di bagian kanan, tidak ada yang tersisa.",
            "Aku tidak membenci kamu, tapi jika ada ombak yang membawa kamu pergi, aku tidak akan menolong.",
            "Kamu adalah alasan why geniuses like me prefer to be alone.",
            "Kamu begitu jelek, kamu bisa membuat kaca melengkung.",
            "Aku mencoba melihat dari sudut pandang kamu, tapi aku tidak bisa menjejalkan kepala saya ke lubang sekecil itu.",
            "Kamu sepenuhnya tidak berguna, seperti 'k' di 'knuckle'."
        ];
        const roast = roasts[Math.floor(Math.random() * roasts.length)];

        const embed = new EmbedBuilder()
            .setColor('#8B0000') // Warna merah gelap
            .setTitle('🔥 Roast!')
            .setDescription(`Hey ${user.username}, ${roast}`)
            .setFooter({ text: `Jangan baper ya 😂 | Diminta oleh ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};