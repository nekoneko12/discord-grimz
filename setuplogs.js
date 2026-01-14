// commands/unique/setuplogs.js
const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    name: 'setuplogs',
    description: 'Membuat channel untuk log bot (invite, webhook, dll).',
    userPermissions: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.ManageChannels],
    args: false,
    ownerOnly: false,
    category: 'unique',
    async execute(message) {
        const channelName = 'bot-logs';
        const existingChannel = message.guild.channels.cache.find(c => c.name === channelName);

        if (existingChannel) {
            return message.reply({
                embeds: [new EmbedBuilder().setColor('#FFA500').setDescription(`⚠️ Channel \`${channelName}\` sudah ada.`)]
            });
        }

        // Membuat channel kategori terlebih dahulu agar lebih rapi
        let category = message.guild.channels.cache.find(c => c.name === 'SERVER LOGS' && c.type === ChannelType.GuildCategory);
        if (!category) {
            category = await message.guild.channels.create({
                name: 'SERVER LOGS',
                type: ChannelType.GuildCategory,
                permissionOverwrites: [
                    {
                        id: message.guild.roles.everyone,
                        deny: [PermissionFlagsBits.ViewChannel]
                    }
                ]
            });
        }

        // Membuat channel teks di dalam kategori
        await message.guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: category.id,
            permissionOverwrites: [
                {
                    id: message.guild.roles.everyone,
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: message.guild.members.me,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ReadMessageHistory]
                }
                // Anda bisa menambahkan role admin lain di sini jika perlu
                // {
                //     id: 'ID_ROLE_ADMIN',
                //     allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ReadMessageHistory]
                // }
            ]
        }).then(channel => {
            const embed = new EmbedBuilder()
                .setColor('#43B581')
                .setTitle('✅ Channel Log Dibuat')
                .setDescription(`Channel ${channel} telah dibuat untuk log bot. Saya akan mengirimkan log aktivitas penting di sini.`)
                .setTimestamp();
            
            channel.send({ embeds: [embed] });
            message.reply({
                embeds: [new EmbedBuilder().setColor('#43B581').setDescription(`✅ Channel log berhasil dibuat.`)]
            });
        });
    }
};