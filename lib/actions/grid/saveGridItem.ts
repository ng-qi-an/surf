import { db, GridItemType } from "@/lib/db";

export default  async function saveGridItem(itemId: string, data: Partial<GridItemType>) {
    await (db.grid as any).update(itemId, {
        ...data,
        updatedAt: new Date()
    });
    return await db.grid.orderBy("position").toArray();
}
