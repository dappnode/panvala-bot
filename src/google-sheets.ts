import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
  GoogleSpreadsheetRow,
} from "google-spreadsheet";
import { createPanvalaUser } from "./panvalaUser";
import { clientSecretJson, googleID } from "./params";

export const doc = new GoogleSpreadsheet(googleID);
if (!doc) {
  throw Error("the doc must exists");
}

export async function loadSheets() {
  await doc.useServiceAccountAuth(clientSecretJson);
  await doc.loadInfo(); // Loads sheets
}

let SHEET_TITLE = "February";
/**
 * Sets the global variable with the sheet (if exists)
 * @param sheetTitle
 */
export async function changeSheet(sheetTitle: string): Promise<string> {
  const sheet = await getSheet(sheetTitle);
  SHEET_TITLE = sheetTitle;
  return "Successfully changed the default sheet";
}

/**
 * Returns the sheet, if does not exist error
 * @param sheetTitle
 * @returns
 */
export async function getSheet(
  sheetTitle: string
): Promise<GoogleSpreadsheetWorksheet> {
  await loadSheets();
  const sheet = doc.sheetsByTitle[sheetTitle];
  if (sheet === undefined) throw Error(`Sheet does not exist: ${sheetTitle}`);
  return sheet;
}

/**
 * Adds panvala user as new row (if already exists, updates the address)
 * @param param0
 * @returns
 */
export async function addPanvalaUser({
  discord,
  address,
}: {
  discord: string;
  address: string;
}): Promise<string> {
  const sheet = await getSheet(SHEET_TITLE);
  const panvalaUser = createPanvalaUser({ discord, address });
  try {
    const user = await userExists(discord);
    if (!user) {
      await sheet.addRow({
        Discord: panvalaUser.discord,
        Id: panvalaUser.id,
        Grain: panvalaUser.grain,
        Address: panvalaUser.address,
        Date: panvalaUser.time,
      });
      return "Successfully added";
    } else {
      await editExistingUser({ discord, address });
      return "Successfully updated address";
    }
  } catch (e) {
    e.message = `Error adding panvala user ${panvalaUser}`;
    throw e;
  }
}

/**
 * Creates a new sheet
 * @param title
 * @returns
 */
export async function createSheet(title: string): Promise<string> {
  try {
    await loadSheets();
    await doc.addSheet({
      headerValues: ["Discord", "Id", "Address", "Date", "Grain"],
      title: title,
    });
    SHEET_TITLE = title;
    return "Successfully created sheet";
  } catch (e) {
    e.message = `Error creating sheet: ${title}`;
    throw e;
  }
}
/**
 * Checks if the user is already registered
 * @param discord
 */
export async function userExists(discord: string) {
  const sheet = await getSheet(SHEET_TITLE);
  const rows = await sheet.getRows();

  return rows.some((row) => row.Discord === discord);
}

/**
 * Edits the existing user with the new address provided
 * @param param0
 */
export async function editExistingUser({
  discord,
  address,
}: {
  discord: string;
  address: string;
}) {
  const sheet = await getSheet(SHEET_TITLE);
  const rows = await sheet.getRows();
  const matchIndex = rows.findIndex((row) => row.Discord === discord);
  rows[matchIndex].Address = address;

  await rows[matchIndex].save();
}
