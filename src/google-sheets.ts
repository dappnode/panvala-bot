import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
  GoogleSpreadsheetRow,
} from "google-spreadsheet";
import { createPanvalaUser } from "./panvalaUser";
import { clientSecretJson, googleID } from "./params";
import { google } from "googleapis";

export const doc = new GoogleSpreadsheet(googleID);
if (!doc) {
  throw Error("the doc must exists");
}

export async function accessSpreadsheet() {
  return await doc.useServiceAccountAuth(clientSecretJson);
}

export async function readInfo() {
  return await doc.loadInfo(); // Loads sheets
}

function getSheet() {
  return doc.sheetsByIndex[0];
}

export async function addPanvalaUser({
  discord,
  address,
}: {
  discord: string;
  address: string;
}) {
  const sheet = getSheet();
  const panvalaUser = createPanvalaUser({ discord, address });
  await sheet.addRow({
    Discord: panvalaUser.discord,
    Id: panvalaUser.id,
    Grain: panvalaUser.grain,
    Address: panvalaUser.address,
    Time: panvalaUser.time,
  });
}

export async function getChecks() {
  await accessSpreadsheet();
  await readInfo();
  const sheet = doc.sheetsByIndex[0];
  return await sheet.getRows();
}
