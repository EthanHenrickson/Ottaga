import type { UserSettingsTable } from "$lib/db/databaseTypes";
import { UserSettingsDatabase } from "$lib/db/userSettings/userSettings";
import type { UserSettingsTableRecord } from "$lib/types";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ locals }) => {
    const userID = locals.user.id
    const databaseResponse = await UserSettingsDatabase.getByUserID(userID)

    return json({ success: databaseResponse.success, data: databaseResponse.data });
};

export const POST: RequestHandler = async ({ locals, request }) => {
    const userID = locals.user.id
    const userSettingsData = await request.json() as UserSettingsTableRecord
    console.log(userSettingsData)
    const databaseResponse = await UserSettingsDatabase.updateByUserID(userID, userSettingsData)

    return json({ success: databaseResponse.success });
};
