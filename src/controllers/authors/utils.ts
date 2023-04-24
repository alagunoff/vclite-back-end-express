import prisma from "prisma";
import {
  isNotEmptyString,
  isPositiveInteger,
  createValidationResult,
} from "shared/utils/validation";

async function validateCreationData(
  data: any
): Promise<ReturnType<typeof createValidationResult>> {
  const errors: Record<string, string> = {};

  if ("description" in data && !isNotEmptyString(data.description)) {
    errors.description = "must be not empty string";
  }

  if ("userId" in data) {
    if (isPositiveInteger(data.userId)) {
      if (
        !(await prisma.user.findUnique({
          where: {
            id: data.userId,
          },
        }))
      ) {
        errors.userId = "user with this id wasn't found";
      }
    } else {
      errors.userId = "must be positive integer";
    }
  } else {
    errors.userId = "required";
  }

  return createValidationResult(errors);
}

export { validateCreationData };
