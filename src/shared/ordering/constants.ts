import { type Prisma } from "@prisma/client";

const DEFAULT_ORDER_PARAMETERS: { id: Prisma.SortOrder } = { id: "asc" };

export { DEFAULT_ORDER_PARAMETERS };
