import { db } from "@/lib/db";

export default async function getGridItems() {
    return await db.grid.toArray();
}