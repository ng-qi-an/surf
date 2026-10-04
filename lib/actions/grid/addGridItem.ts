import { db, GridItemType } from "@/lib/db";

export default  async function addGridItem(props: GridItemType) {
    await db.grid.add(props);
    return await db.grid.toArray();
}