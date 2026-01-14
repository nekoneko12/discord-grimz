const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'removerole',
    description: 'Menghapus role dari member.',
    userPermissions: [PermissionFlagsBits.ManageRoles],
    botPermissions: [PermissionFlagsBits.ManageRoles],
    args: true,
    usage: '<@member> <@role>',
    ownerOnly: false,
    category: 'moderation',
    async execute(message, args) {
        const member = message.mentions.members.first();
        if (!member) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Member tidak ditemukan.')]
            });
        }

        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
        if (!role) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Role tidak ditemukan.')]
            });
        }

        if (!member.roles.cache.has(role.id)) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription(`❌ ${member.user.tag} tidak memiliki role ${role.name}.`)]
            });
        }

        if (role.position >= message.guild.members.me.roles.highest.position) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Saya tidak bisa menghapus role ini karena posisinya lebih tinggi atau sama dengan role tertinggi saya.')]
            });
        }

        await member.roles.remove(role);

        const embed = new EmbedBuilder()
            .setColor('#992D22')
            .setTitle('❌ Role Dihapus')
            .setDescription(`Role ${role} telah dihapus dari ${member.user.tag}.`)
            .setFooter({ text: `Dilakukan oleh ${message.author.tag}` })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};