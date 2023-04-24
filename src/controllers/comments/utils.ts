import prisma from "prisma";
import { isNotEmptyString } from "shared/utils/validation";

async function validateCreationData(
  data: any
): Promise<Record<string, string> | undefined> {
  const errors: Record<string, string> = {};

  if ("content" in data) {
    if (!isNotEmptyString(data.content)) {
      errors.content = "must be not empty string";
    }
  } else {
    errors.content = "required";
  }

  if (!(await prisma.post.findUnique({ where: { id: data.postId } }))) {
    errors.postId = "post with this id wasn't found";
  }

  return Object.keys(errors).length ? errors : undefined;
}

export { validateCreationData };
