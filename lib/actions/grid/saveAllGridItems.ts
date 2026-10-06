import { db, GridItemType } from "@/lib/db";

export default  async function saveAllGridItems(items: GridItemType[]) {
    const orderedItems = items.map((item, position) => ({ ...item, position }));

    await db.transaction("rw", db.grid, async () => {
        await db.grid.clear();
        await db.grid.bulkAdd(orderedItems);
    });

    console.log("Saved all grid items to the database:", orderedItems);
    return await db.grid.orderBy("position").toArray();
}
