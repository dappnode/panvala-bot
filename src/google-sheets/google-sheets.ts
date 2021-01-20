import fs, { readFileSync, writeFileSync } from "fs";
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
  GoogleSpreadsheetRow,
} from "google-spreadsheet";
import { createPanvalaUser } from "../panvala/panvalaUser";
import { clientSecretJson, googleID } from "../params/params";

export const doc = new GoogleSpreadsheet(googleID);
if (!doc) {
  throw Error("the doc must exists");
}
/**
 * Load necessary information to interact with sheets
 */
export async function loadSheets() {
  await doc.useServiceAccountAuth(clientSecretJson);
  await doc.loadInfo(); // Loads sheets
}

// Global variable for the current working sheet
// DO NOT USE GLOBAL VARIABLES as 'database'. Do txt file.
const getCurrentSheet = () =>
  readFileSync("./data/currentWorkingSheet.txt", "utf-8");

const setCurrentSheet = (sheetTitle: string) =>
  writeFileSync("./data/currentWorkingSheet.txt", sheetTitle);

/**
 * Sets the new currentWorkingSheet (if exists)
 * @param sheetTitle
 */
export async function changeSheet(sheetTitle: string): Promise<string> {
  const sheet = await getSheet(sheetTitle);
  fs.writeFileSync("./data/currentWorkingSheet.txt", sheetTitle);
  return "Successfully changed the default sheet";
}

/**
 * Returns the sheet, if does not exist throw error
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
  const currentSheet = getCurrentSheet();
  const sheet = await getSheet(currentSheet);
  const rows = await sheet.getRows();
  const matchIndex = rows.findIndex((row) => row.Discord === discord);
  rows[matchIndex].Address = address;

  await rows[matchIndex].save();
}

/**
 * Creates a new sheet
 * @param title
 * @returns
 */
export async function createSheet(sheetTitle: string): Promise<string> {
  try {
    await loadSheets();
    await doc.addSheet({
      headerValues: [
        "Discord",
        "Id",
        "Address",
        "Date",
        "GrainEarned",
        "LastGrainEarned",
      ],
      title: sheetTitle,
    });
    setCurrentSheet(sheetTitle);

    return "Successfully created sheet";
  } catch (e) {
    e.message = `Error creating sheet: ${sheetTitle}`;
    throw e;
  }
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
  const currentSheet = getCurrentSheet();
  const sheet = await getSheet(currentSheet);
  const panvalaUser = createPanvalaUser({ discord, address });
  try {
    const user = await userExists(discord);
    if (!user) {
      await sheet.addRow({
        Discord: panvalaUser.discord,
        Id: panvalaUser.id,
        GrainEarned: panvalaUser.grainEarned,
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
 * Checks if the user is already registered
 * @param discord
 */
export async function userExists(discord: string) {
  const currentSheet = getCurrentSheet();
  const sheet = await getSheet(currentSheet);
  const rows = await sheet.getRows();

  return rows.some((row) => row.Discord === discord);
}
