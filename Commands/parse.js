const { SlashCommandBuilder } = require("discord.js");
const sheets = require("../sheetsclient");
const { parseDPSReport } = require("../dpsParser");

const {SPREADSHEET_ID} = require("../credentials.json") ; 

module.exports = {
  data: new SlashCommandBuilder()
    .setName("parse")
    .setDescription("Parse a message with multiple dps.report links")
    .addStringOption((option) =>
      option
        .setName("logs")
        .setDescription("Paste all the dps.report links here")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("date")
        .setDescription("The date these logs were taken.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const message = interaction.options.getString("logs");
    const date = interaction.options.getString("date");
    const raids = message.split(" ");

    await interaction.deferReply();

    // Getting Last Week No.
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'Raid Logs'!A:A`,
    });
    const lastWeekNo = res.data.values[res.data.values.length - 1][0];
    if (typeof value !== "number" || isNaN(value)) {
      lastWeekNo = 1
    }
    const finalData = await parseDPSReport(
      lastWeekNo,
      raids,
      interaction,
      date
    );

    const resource = {
      valueInputOption: "USER_ENTERED",
      data: [...finalData],
    };

    await interaction.editReply(`Working on the sheets...`);
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource,
    });
    const msg = await interaction.editReply(`Done!`);
  },
};
