const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'coinflip',
    description: 'Melempar koin.',
    aliases: ['flip'],
    args: false,
    ownerOnly: false,
    category: 'fun',
    async execute(message) {
        const choices = ['Kepala', 'Ekor'];
        const result = choices[Math.floor(Math.random() * choices.length)];
        const emoji = result === 'Kepala' ? '👑' : '🦅';
        
        const embed = new EmbedBuilder()
            .setColor('#23272A')
            .setTitle('🪙 Lempar Koin')
            .setDescription(`${message.author.username} melempar koin ke udara...`)
            .addFields(
                { name: 'Hasilnya', value: `${emoji} **${result}**`, inline: false }
            )
            .setFooter({ text: `Diminta oleh ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};