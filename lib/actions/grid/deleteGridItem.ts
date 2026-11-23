import { db } from "@/lib/db";

export default async function deleteGridItem(id: string) {
    console.log("Deleting item with id:", id);
    await db.grid.delete(id);
    return await db.grid.orderBy("position").toArray();
}
