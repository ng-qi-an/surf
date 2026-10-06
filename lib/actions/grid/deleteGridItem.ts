import { db } from "@/lib/db";

export default async function deleteGridItem(id: string) {
    await db.grid.delete(id);
    return await db.grid.orderBy("position").toArray();
}
