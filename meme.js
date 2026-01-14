const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'meme',
    description: 'Menampilkan meme acak dari Reddit.',
    args: false,
    ownerOnly: false,
    category: 'fun',
    async execute(message) {
        // Menggunakan API publik untuk meme
        const subreddits = ['memes', 'dankmemes', 'me_irl', 'wholesomememes'];
        const randSub = subreddits[Math.floor(Math.random() * subreddits.length)];
        
        try {
            const resp = await require('node-fetch')(`https://www.reddit.com/r/${randSub}/random/.json`);
            const data = await resp.json();
            const meme = data[0].data.children[0].data;

            const embed = new EmbedBuilder()
                .setColor('#23272A')
                .setTitle(meme.title)
                .setURL(`https://reddit.com${meme.permalink}`)
                .setImage(meme.url)
                .setFooter({ text: `👍 ${meme.ups} | 💬 ${meme.num_comments} | r/${meme.subreddit}` })
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            message.reply({
                embeds: [new EmbedBuilder().setColor('#992D22').setDescription('❌ Gagal mengambil meme. Coba lagi nanti.')]
            });
        }
    }
};