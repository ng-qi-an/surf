import { db, GridItemType } from "@/lib/db";

export default  async function addGridItem(props: GridItemType) {
    const lastItem = await db.grid.orderBy("position").last();
    const position = (lastItem?.position ?? -1) + 1;
    await db.grid.add({ ...props, position });
    return await db.grid.orderBy("position").toArray();
}
