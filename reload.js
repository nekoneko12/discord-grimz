const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'reload',
    description: 'Me-reload sebuah command.',
    ownerOnly: true,
    args: true,
    usage: '<nama command>',
    category: 'owner',
    async execute(message, args, client) {
        const commandName = args[0].toLowerCase();
        const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));

        if (!command) {
            return message.channel.send({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription(`❌ Command \`${commandName}\` tidak ada.`)]
            });
        }

        delete require.cache[require.resolve(`../${command.category}/${command.name}.js`)];

        try {
            const newCommand = require(`../${command.category}/${command.name}.js`);
            client.commands.set(newCommand.name, newCommand);
            message.channel.send({
                embeds: [new EmbedBuilder().setColor('#43B581').setDescription(`✅ Command \`${commandName}\` telah di-reload.`)]
            });
        } catch (error) {
            console.error(error);
            message.channel.send({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription(`❌ Terjadi kesalahan saat me-reload command \`${commandName}\`:\n\`${error.message}\``)]
            });
        }
    }
};