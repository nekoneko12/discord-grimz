const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'unwarn',
    description: 'Menghapus peringatan terakhir member.',
    userPermissions: [PermissionFlagsBits.KickMembers],
    args: true,
    usage: '<@member>',
    ownerOnly: false,
    category: 'moderation',
    async execute(message, args) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Member tidak ditemukan.')]
            });
        }

        const warnsPath = './warns.json';
        if (!fs.existsSync(warnsPath)) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Member ini tidak memiliki peringatan.')]
            });
        }

        let warns = JSON.parse(fs.readFileSync(warnsPath));
        if (!warns[member.id] || warns[member.id].length === 0) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Member ini tidak memiliki peringatan.')]
            });
        }

        warns[member.id].pop();
        if (warns[member.id].length === 0) {
            delete warns[member.id];
        }

        fs.writeFileSync(warnsPath, JSON.stringify(warns, null, 2));

        const embed = new EmbedBuilder()
            .setColor('#43B581')
            .setTitle('✅ Peringatan Dihapus')
            .setDescription(`Peringatan terakhir untuk ${member.user.tag} telah dihapus.`)
            .addFields(
                { name: 'Moderator', value: message.author.tag, inline: true }
            )
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};