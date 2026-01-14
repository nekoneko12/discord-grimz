// index.js (Versi Perbaikan)
const { Client, GatewayIntentBits, Collection, Partials, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const dotenv = require('dotenv');
const express = require('express');

// Mengimpor handlers
const commandHandler = require('./handlers/commandHandler');
const eventHandler = require('./handlers/eventHandler');
const giveawayHandler = require('./handlers/giveawayHandler');
const afkHandler = require('./handlers/afkHandler');

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.User,
    ]
});

// Inisialisasi Collections
client.commands = new Collection();
client.aliases = new Collection();
client.snipes = new Collection();
client.giveaways = new Collection();
client.afk = new Collection();

// Event Ready (Diganti ke 'ready' agar standar discord.js)
client.on('ready', () => {
    console.log(`✅ ${client.user.username} telah online!`);
    console.log(`📊 Berjalan di ${client.guilds.cache.size} server.`);

    // --- KODE UNTUK JOIN VOICE CHANNEL 24/7 ---
    const voiceChannelId = process.env.VOICE_CHANNEL_ID;
    if (voiceChannelId) {
        client.guilds.cache.forEach(guild => {
            const voiceChannel = guild.channels.cache.get(voiceChannelId);
            if (voiceChannel && voiceChannel.type === 2) {
                try {
                    const connection = joinVoiceChannel({
                        channelId: voiceChannel.id,
                        guildId: guild.id,
                        adapterCreator: guild.voiceAdapterCreator,
                        selfDeaf: false,
                        selfMute: false
                    });
                    
                    const player = createAudioPlayer();
                    const resource = createAudioResource('./silence.mp3');
                    
                    player.play(resource);
                    connection.subscribe(player);
                    
                    console.log(`🎤 Bot telah bergabung dengan voice channel: ${voiceChannel.name} di server ${guild.name}`);
                } catch (err) {
                    console.error('Gagal join voice:', err);
                }
            }
        });
    }

    // Memulai Giveaway Handler
    if (typeof giveawayHandler === 'function') giveawayHandler(client);
    console.log('🎉 Giveaway Handler telah dimulai.');

    // Status Bot (Setelan Awal: #MAMADGANG)
    const statuses = [
        { name: '#MAMADGANG', type: 0 },
        { name: 'Menjaga ketertiban.', type: 3 },
        { name: 'Mengawasi server.', type: 3 },
        { name: '!!help | Komunitas Aman', type: 0 },
        { name: 'Sistem: Online', type: 0 },
        { name: 'Menyediakan solusi.', type: 2 }
    ];

    let currentStatus = 0;
    client.user.setActivity(statuses[0].name, { type: statuses[0].type });
    
    setInterval(() => {
        currentStatus = (currentStatus + 1) % statuses.length;
        client.user.setActivity(statuses[currentStatus].name, { type: statuses[currentStatus].type });
    }, 30000);
});

// Event untuk menjalankan command
client.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;
    
    const prefix = '!!';
    if (!message.content.startsWith(prefix)) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    const command = client.commands.get(commandName) || 
                    client.commands.get(client.aliases.get(commandName));
    
    if (!command) return;
    
    // Cek apakah command hanya untuk owner
    if (command.ownerOnly && message.author.id !== process.env.OWNER_ID) {
        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('#2C2F33')
                    .setTitle('Akses Ditolak')
                    .setDescription('Command ini hanya dapat digunakan oleh pemilik bot.')
                    .setFooter({ text: `Diminta oleh ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                    .setTimestamp()
            ]
        });
    }

    // Cek permission Bot
    if (command.botPermissions) {
        const neededPerms = [];
        command.botPermissions.forEach(p => {
            if (!message.guild.members.me.permissions.has(p)) neededPerms.push(p);
        });
        if (neededPerms.length > 0) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#2C2F33')
                        .setTitle('Saya Membutuhkan Permission')
                        .setDescription(`Saya membutuhkan permission:\n\`${neededPerms.join('`, `')}\``)
                        .setFooter({ text: `Diminta oleh ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                        .setTimestamp()
                ]
            });
        }
    }
    
    // Cek permission User
    if (command.userPermissions) {
        const neededPerms = [];
        command.userPermissions.forEach(p => {
            if (!message.member.permissions.has(p)) neededPerms.push(p);
        });
        if (neededPerms.length > 0) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#2C2F33')
                        .setTitle('Anda Membutuhkan Permission')
                        .setDescription(`Anda membutuhkan permission:\n\`${neededPerms.join('`, `')}\``)
                        .setFooter({ text: `Diminta oleh ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                        .setTimestamp()
                ]
            });
        }
    }

    // Cek argumen
    if (command.args && !args.length) {
        let reply = 'Anda tidak memberikan argumen yang cukup.';
        if (command.usage) {
            reply += `\n\n**Cara Penggunaan:**\n\`${prefix}${command.name} ${command.usage}\``;
        }
        
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('#2C2F33')
                    .setTitle('Kesalahan Penggunaan')
                    .setDescription(reply)
                    .setFooter({ text: `Diminta oleh ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                    .setTimestamp()
            ]
        });
    }
    
    try {
        await command.execute(message, args, client);
    } catch (error) {
        console.error(error);
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('#992D22')
                    .setTitle('Terjadi Kesalahan')
                    .setDescription('Terjadi kesalahan saat menjalankan command ini.')
                    .setFooter({ text: `Diminta oleh ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                    .setTimestamp()
            ]
        });
    }
});

// Memanggil Handlers
commandHandler(client);
eventHandler(client);
afkHandler(client);

// Login bot
client.login(process.env.DISCORD_TOKEN);

// --- KODE UNTUK RENDER ---
const app = express();
app.get('/', (req, res) => res.send('Bot #MAMADGANG is online!'));
app.listen(3000, () => console.log(`Web server listening on port 3000`));