import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
  GoogleSpreadsheetRow,
} from "google-spreadsheet";
import { stringify } from "querystring";
import { clientSecretJson, googleID } from "./params";

export const doc = new GoogleSpreadsheet(googleID);
if (!doc) {
  throw Error("the doc must exists");
}

export const getDate = function () {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
};

export async function accessSpreadsheet() {
  return await doc.useServiceAccountAuth(clientSecretJson);
}

export async function readInfo() {
  return await doc.loadInfo(); // Loads sheets
}

// FIRST SHEET (CHECK-in CHECK-out)

async function createPanvalaUser({
  sheet,
  discord,
  address,
  grain = 0,
}: {
  sheet: GoogleSpreadsheetWorksheet;
  discord: string;
  address: string;
  grain: number | undefined;
}) {
  const time = getDate();
  return await sheet.addRow({
    discord: discord,
    address: address,
    grain: grain,
    time: time,
  });
}

export async function addPanvalaUser({
  discord,
  address,
}: {
  discord: string;
  address: string;
}): Promise<string> {
  await accessSpreadsheet();
  await readInfo();
  const sheet = doc.sheetsByIndex[0];
  await createPanvalaUser({ sheet, discord, address, grain: 0 });
  return "Successfull checked in";
}

export async function getChecks() {
  await accessSpreadsheet();
  await readInfo();
  const sheet = doc.sheetsByIndex[0];
  return await sheet.getRows();
}
