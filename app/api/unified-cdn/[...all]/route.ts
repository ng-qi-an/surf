import { ucdn } from "@/ucdn";
import { toNextHandler } from "unified-cdn-api/handlers/nextjs";
import { convertFileTypesToList } from "unified-cdn-api/helpers";
export const POST = toNextHandler(ucdn, {
    client: {
        uploads: {
            data: {
                allowedFileTypes: convertFileTypesToList(["images", "documents", "text"])
            }
        }
    }
})