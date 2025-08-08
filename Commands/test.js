const { SlashCommandBuilder } = require("discord.js");
const sheets = require("../sheetsclient");
const {SPREADSHEET_ID} = require("../credentials.json") ; // from the sheet URL

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Basic Test Command"),
  async execute(interaction) {
    try {
       const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `'Raid Logs'!A:A`,
        });
        console.log(res.data.values)
      await interaction.reply("No data found.");
    } catch (error) {
      console.error("❌ Google Sheets error:", error);
      await interaction.reply("Failed to access Google Sheets.");
    }
  },
};
