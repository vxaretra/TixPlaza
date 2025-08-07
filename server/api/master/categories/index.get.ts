import { ResGetCategories } from "~/dto/categories";
import { prisma } from "~/prisma/db";

export default defineEventHandler<Promise<ResGetCategories>>(async (event) => {
  const session = await requireUserSession(event);
  const user = session.user;

  const categories = await prisma.categoriesMaster.findMany({
    orderBy: {
      categoryId: "asc",
    },
  });

  const response: ResGetCategories = {
    data: categories.map((categories) => {
      return {
        id: categories.categoryId,
        label: categories.name,
        icon: categories.icon,
      };
    }),
  };

  return response;
});
