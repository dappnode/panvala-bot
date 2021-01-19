import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
  GoogleSpreadsheetRow,
} from "google-spreadsheet";
import { createPanvalaUser } from "./panvalaUser";
import { clientSecretJson, googleID } from "./params";

const keys = require("./keys.json");

let sheetTitle = "February";

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

export function getSheet() {
  return doc.sheetsByTitle[sheetTitle];
}

export async function addPanvalaUser({
  discord,
  address,
}: {
  discord: string;
  address: string;
}): Promise<string> {
  const sheet = getSheet();
  const panvalaUser = createPanvalaUser({ discord, address });
  try {
    await sheet.addRow({
      Discord: panvalaUser.discord,
      Id: panvalaUser.id,
      Grain: panvalaUser.grain,
      Address: panvalaUser.address,
      Time: panvalaUser.time,
    });
    return "Successfully added";
  } catch (e) {
    e.message = `Error adding panvala user ${panvalaUser}`;
    throw e;
  }
}

export async function createSheet(title: string): Promise<string> {
  try {
    await doc.addSheet({
      headerValues: ["Discord", "Id", "Address", "Date", "Grain"],
      title: title,
    });
    sheetTitle = title;
    return "Successfully created sheet";
  } catch (e) {
    e.message = `Error creating sheet: ${title}`;
    throw e;
  }
}
