module.exports = {
  name: 'unban',
  async execute(client, message, args) {
    if (!message.member.permissions.has('BanMembers'))
      return message.reply('❌ Tidak ada izin.');

    const id = args[0];
    if (!id) return message.reply('Masukkan ID user.');

    await message.guild.members.unban(id);
    message.reply(`✅ User dengan ID ${id} di-unban.`);
  }
};
