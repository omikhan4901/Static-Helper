const axios = require("axios");
const bossToColumnMap = require("./sheetRanges.json");

// Delay function
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function findColumnForBoss(bossName, bossToColumnMap) {
 
  const bossNameLower = bossName.toLowerCase();

   
  for (const key of Object.keys(bossToColumnMap)) {
    const keyLower = key.toLowerCase();
 
    if (bossNameLower.startsWith(keyLower)) {
      return bossToColumnMap[key];
    }
  }
  return null;  
}

async function parseDPSReport(lastWeekNo, raids, interaction, date) {
  const raidArr = [];
  for (raid in raids) {
    const fullUrl = `https://dps.report/getjson?permalink=${raids[raid]}`;
    const eta = ((raids.length - raid) * 10) / 60;
    await interaction.editReply(
      `${raids.length - raid} files left, estimated time: ${eta.toFixed(
        2
      )} minutes left.`
    );
    const res = await axios.get(fullUrl);

    await interaction.editReply(
      `${raids.length - raid} files left, estimated time: ${eta.toFixed(
        2
      )} minutes left..`
    );

    const data = res.data;
    if (data.success) {
      await wait(10000);
      await interaction.editReply(
        `${raids.length - raid} files left, estimated time: ${eta.toFixed(
          2
        )} minutes left...`
      );
      const col = findColumnForBoss(data.fightName, bossToColumnMap);
      duration = data.duration.replace(/\s*\d+ms/, "");
      raidArr.push({
        range: `'Raid Logs'!${col}${+lastWeekNo + 3}`,
        values: [[`=HYPERLINK("${raids[raid]}", "${duration}")`]],
      });
    }
  }
  raidArr.push({
    range: `'Raid Logs'!B${+lastWeekNo + 3}`,
    values: [[date]],
  });
  raidArr.push({
    range: `'Raid Logs'!A${+lastWeekNo + 3}`,
    values: [[+lastWeekNo + 1]],
  });

  return raidArr;
}

module.exports = { parseDPSReport };
