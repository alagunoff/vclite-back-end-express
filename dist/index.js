"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
var import_express9 = __toESM(require("express"));
var import_swagger_ui_express = __toESM(require("swagger-ui-express"));

// src/components/auth/router.ts
var import_express = require("express");

// src/shared/validation/utils.ts
function isNotEmptyString(value) {
  return typeof value === "string" && value !== "";
}
function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}
function isStringPositiveInteger(value) {
  const valueAsNumber = Number(value);
  return Number.isInteger(valueAsNumber) && valueAsNumber > 0;
}
function isBase64ImageDataUrl(value) {
  return typeof value === "string" && /^data:image\/(jpe?g|png);base64,/.test(value);
}
function isDateString(value) {
  return typeof value === "string" ? !Number.isNaN(Date.parse(value)) : false;
}
function isPositiveIntegersNotEmptyArray(value) {
  return Array.isArray(value) && !!value.length && !value.some(
    (item) => !Number.isInteger(item) || item <= 0
  );
}
function isStringPositiveIntegersNotEmptyArray(value) {
  return Array.isArray(value) && !!value.length && !value.some((item) => {
    const itemAsNumber = Number(item);
    return !Number.isInteger(itemAsNumber) || itemAsNumber <= 0;
  });
}
function isBase64ImageDataUrlsNotEmptyArray(value) {
  return Array.isArray(value) && !!value.length && !value.some((item) => !isBase64ImageDataUrl(item));
}

// src/components/auth/validators.ts
function validateLoginData(data) {
  const errors = {};
  if ("username" in data) {
    if (!isNotEmptyString(data.username)) {
      errors.username = "must be not empty string";
    }
  } else {
    errors.username = "required";
  }
  if ("password" in data) {
    if (!isNotEmptyString(data.password)) {
      errors.password = "must be not empty string";
    }
  } else {
    errors.password = "required";
  }
  return Object.keys(errors).length ? {
    validatedData: void 0,
    errors
  } : {
    validatedData: {
      username: data.username,
      password: data.password
    },
    errors: void 0
  };
}

// src/components/auth/services.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_bcryptjs = __toESM(require("bcryptjs"));

// src/shared/env.ts
var import_envalid = require("envalid");
var dotenv = __toESM(require("dotenv"));
dotenv.config();
var env = (0, import_envalid.cleanEnv)(process.env, {
  JWT_SECRET_KEY: (0, import_envalid.str)(),
  DATABASE_URL: (0, import_envalid.str)()
});
var env_default = env;

// src/shared/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var prisma_default = prisma;

// src/components/auth/services.ts
function logIn(_0, _1, _2) {
  return __async(this, arguments, function* ({ username, password }, onSuccess, onFailure) {
    const user = yield prisma_default.user.findUnique({ where: { username } });
    if (user) {
      const isProvidedPasswordCorrect = import_bcryptjs.default.compareSync(
        password,
        user.password
      );
      if (isProvidedPasswordCorrect) {
        onSuccess(import_jsonwebtoken.default.sign(String(user.id), env_default.JWT_SECRET_KEY));
      } else {
        onFailure("incorrectPassword");
      }
    } else {
      onFailure("userNotFound");
    }
  });
}

// src/components/auth/constants.ts
var FAILURE_REASON_TO_RESPONSE_STATUS_CODE = {
  incorrectPassword: 403,
  userNotFound: 404
};

// src/components/auth/controllers.ts
function logIn2(req, res) {
  return __async(this, null, function* () {
    const {
      validatedData: validatedLoginData,
      errors: loginDataValidationErrors
    } = validateLoginData(req.body);
    if (loginDataValidationErrors) {
      res.status(400).json(loginDataValidationErrors);
    } else {
      void logIn(
        validatedLoginData,
        (userJwtToken) => {
          res.send(userJwtToken);
        },
        (failureReason) => {
          res.status(FAILURE_REASON_TO_RESPONSE_STATUS_CODE[failureReason]).end();
        }
      );
    }
  });
}

// src/components/auth/router.ts
var router = (0, import_express.Router)();
router.post("/login", logIn2);
var router_default = router;

// src/components/users/router.ts
var import_express2 = require("express");

// src/middlewares/auth.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));
function authenticateUser(onlyAdmin) {
  return function(req, res, next) {
    return __async(this, null, function* () {
      var _a;
      if ((_a = req.headers.authorization) == null ? void 0 : _a.startsWith("Bearer ")) {
        const token = req.headers.authorization.slice(7);
        try {
          const decodedJwt = import_jsonwebtoken2.default.verify(token, env_default.JWT_SECRET_KEY);
          const authenticatedUser = yield prisma_default.user.findUnique({
            where: {
              id: Number(decodedJwt)
            }
          });
          if (authenticatedUser) {
            if (onlyAdmin) {
              if (authenticatedUser.isAdmin) {
                req.authenticatedUser = authenticatedUser;
                next();
              } else {
                res.status(404).end();
              }
            } else {
              req.authenticatedUser = authenticatedUser;
              next();
            }
          } else {
            res.status(onlyAdmin ? 404 : 401).end();
          }
        } catch (error) {
          console.log(error);
          res.status(onlyAdmin ? 404 : 401).end();
        }
      } else {
        res.status(onlyAdmin ? 404 : 401).end();
      }
    });
  };
}
function authenticateAuthor(req, res, next) {
  return __async(this, null, function* () {
    var _a;
    const authenticatedAuthor = yield prisma_default.author.findUnique({
      where: {
        userId: (_a = req.authenticatedUser) == null ? void 0 : _a.id
      }
    });
    if (authenticatedAuthor) {
      req.authenticatedAuthor = authenticatedAuthor;
      next();
    } else {
      res.status(403).end();
    }
  });
}

// src/components/users/services.ts
var import_jsonwebtoken3 = __toESM(require("jsonwebtoken"));
var import_bcryptjs2 = __toESM(require("bcryptjs"));

// src/shared/images/utils.ts
var import_path2 = __toESM(require("path"));
var import_fs = __toESM(require("fs"));

// src/shared/constants.ts
var import_path = __toESM(require("path"));
var APP_HOST_NAME = "http://localhost:3000";
var projectAbsolutePath = import_path.default.join(__dirname, "../..");

// src/shared/images/utils.ts
function saveImage(base64ImageDataUrl, folderName, imageFileName) {
  const [imageMediatype, base64Image] = base64ImageDataUrl.slice(5).split(";base64,");
  const imageFileNameWithExtension = `${imageFileName}.${imageMediatype.split("/")[1]}`;
  const folderAbsolutePath = `${projectAbsolutePath}/static/images/${folderName}`;
  import_fs.default.mkdirSync(folderAbsolutePath, { recursive: true });
  import_fs.default.writeFileSync(
    `${folderAbsolutePath}/${imageFileNameWithExtension}`,
    Buffer.from(base64Image, "base64")
  );
  return `${APP_HOST_NAME}/api/static/images/${folderName}/${imageFileNameWithExtension}`;
}
function getHostedImageAbsolutePath(imageUrl) {
  return `${projectAbsolutePath}/${imageUrl.replace(
    `${APP_HOST_NAME}/api/`,
    ""
  )}`;
}
function getHostedImageFolderName(imageUrl) {
  return import_path2.default.basename(import_path2.default.dirname(getHostedImageAbsolutePath(imageUrl)));
}
function deleteHostedImage(imageUrl) {
  import_fs.default.unlinkSync(getHostedImageAbsolutePath(imageUrl));
}
function deleteHostedImageFolder(imageUrl) {
  import_fs.default.rmSync(import_path2.default.dirname(getHostedImageAbsolutePath(imageUrl)), {
    recursive: true,
    force: true
  });
}

// src/components/users/services.ts
function createUser(_0, _1, _2) {
  return __async(this, arguments, function* ({ image, username, password, firstName, lastName }, onSuccess, onFailure) {
    const user = yield prisma_default.user.findUnique({ where: { username } });
    if (user) {
      onFailure();
    } else {
      const createdUser = yield prisma_default.user.create({
        data: {
          image: saveImage(image, "users", username),
          username,
          password: import_bcryptjs2.default.hashSync(password),
          firstName,
          lastName
        }
      });
      onSuccess(import_jsonwebtoken3.default.sign(String(createdUser.id), env_default.JWT_SECRET_KEY));
    }
  });
}
function deleteUserById(id, onSuccess, onFailure) {
  return __async(this, null, function* () {
    try {
      const deletedUser = yield prisma_default.user.delete({ where: { id } });
      deleteHostedImage(deletedUser.image);
      onSuccess();
    } catch (error) {
      console.log(error);
      onFailure();
    }
  });
}

// src/components/users/validators.ts
function validateCreationData(data) {
  const errors = {};
  if ("image" in data) {
    if (!isBase64ImageDataUrl(data.image)) {
      errors.image = "must be base64 image in data URL format with mediatype";
    }
  } else {
    errors.image = "required";
  }
  if ("username" in data) {
    if (!isNotEmptyString(data.username)) {
      errors.username = "must be not empty string";
    }
  } else {
    errors.username = "required";
  }
  if ("password" in data) {
    if (!isNotEmptyString(data.password)) {
      errors.password = "must be not empty string";
    }
  } else {
    errors.password = "required";
  }
  if ("firstName" in data) {
    if (!isNotEmptyString(data.firstName)) {
      errors.firstName = "must be not empty string";
    }
  }
  if ("lastName" in data) {
    if (!isNotEmptyString(data.lastName)) {
      errors.lastName = "must be not empty string";
    }
  }
  return Object.keys(errors).length ? {
    validatedData: void 0,
    errors
  } : {
    validatedData: {
      image: data.image,
      username: data.username,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName
    },
    errors: void 0
  };
}

// src/components/users/controllers.ts
function createUser2(req, res) {
  return __async(this, null, function* () {
    const {
      validatedData: validatedCreationData,
      errors: creationDataValidationErrors
    } = validateCreationData(req.body);
    if (creationDataValidationErrors) {
      res.status(400).json(creationDataValidationErrors);
    } else {
      void createUser(
        validatedCreationData,
        (userJwtToken) => {
          res.status(201).send(userJwtToken);
        },
        () => {
          res.status(422).end();
        }
      );
    }
  });
}
function getUser(req, res) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    res.json({
      id: (_a = req.authenticatedUser) == null ? void 0 : _a.id,
      image: (_b = req.authenticatedUser) == null ? void 0 : _b.image,
      username: (_c = req.authenticatedUser) == null ? void 0 : _c.username,
      firstName: (_d = req.authenticatedUser) == null ? void 0 : _d.firstName,
      lastName: (_e = req.authenticatedUser) == null ? void 0 : _e.lastName,
      isAdmin: (_f = req.authenticatedUser) == null ? void 0 : _f.isAdmin,
      createdAt: (_g = req.authenticatedUser) == null ? void 0 : _g.createdAt
    });
  });
}
function deleteUser(req, res) {
  return __async(this, null, function* () {
    void deleteUserById(
      Number(req.params.id),
      () => {
        res.status(204).end();
      },
      () => {
        res.status(404).end();
      }
    );
  });
}

// src/components/users/router.ts
var router2 = (0, import_express2.Router)();
router2.post("", createUser2);
router2.get("", authenticateUser(), getUser);
router2.delete("/:id(\\d+)", authenticateUser(true), deleteUser);
var router_default2 = router2;

// src/components/authors/router.ts
var import_express3 = require("express");

// src/shared/pagination/utils.ts
function validatePaginationQueryParameters(queryParameters) {
  const errors = {};
  if ("pageNumber" in queryParameters) {
    if (!isStringPositiveInteger(queryParameters.pageNumber)) {
      errors.pageNumber = "must be positive integer";
    }
    if (!("itemsNumber" in queryParameters)) {
      errors.itemsNumber = "required";
    }
  }
  if ("itemsNumber" in queryParameters) {
    if (!isStringPositiveInteger(queryParameters.itemsNumber)) {
      errors.itemsNumber = "must be positive integer";
    }
    if (!("pageNumber" in queryParameters)) {
      errors.pageNumber = "required";
    }
  }
  return Object.keys(errors).length ? {
    validatedData: void 0,
    errors
  } : {
    validatedData: {
      pageNumber: queryParameters.pageNumber,
      itemsNumber: queryParameters.itemsNumber
    },
    errors: void 0
  };
}
function createPaginationParameters({
  pageNumber,
  itemsNumber
}) {
  if (typeof pageNumber === "string" && typeof itemsNumber === "string") {
    const itemsNumberAsNumber = Number(itemsNumber);
    return {
      skip: (Number(pageNumber) - 1) * itemsNumberAsNumber,
      take: itemsNumberAsNumber
    };
  }
}
function calculatePagesTotalNumber(itemsTotalNumber, filteredItemsTotalNumber) {
  return itemsTotalNumber && filteredItemsTotalNumber ? Math.ceil(itemsTotalNumber / filteredItemsTotalNumber) : 1;
}

// src/components/authors/services.ts
function createAuthor(_0, _1) {
  return __async(this, arguments, function* ({ description, userId }, onSuccess) {
    yield prisma_default.author.create({ data: { description, userId } });
    onSuccess();
  });
}
function getAuthors(validatedPaginationQueryParameters, onSuccess) {
  return __async(this, null, function* () {
    const authors = yield prisma_default.author.findMany(__spreadProps(__spreadValues({}, createPaginationParameters(validatedPaginationQueryParameters)), {
      select: {
        id: true,
        description: true
      }
    }));
    const authorsTotalNumber = yield prisma_default.author.count();
    onSuccess(
      authors,
      authorsTotalNumber,
      calculatePagesTotalNumber(authorsTotalNumber, authors.length)
    );
  });
}
function updateAuthorById(_0, _1, _2) {
  return __async(this, arguments, function* (id, { description }, onSuccess) {
    yield prisma_default.author.update({ where: { id }, data: { description } });
    onSuccess();
  });
}
function deleteAuthorById(id, onSuccess, onFailure) {
  return __async(this, null, function* () {
    try {
      yield prisma_default.author.delete({ where: { id } });
      onSuccess();
    } catch (error) {
      console.log(error);
      onFailure();
    }
  });
}

// src/components/authors/validators.ts
function validateCreationData2(data) {
  return __async(this, null, function* () {
    const errors = {};
    if ("description" in data) {
      if (!isNotEmptyString(data.description)) {
        errors.description = "must be not empty string";
      }
    }
    if ("userId" in data) {
      if (isPositiveInteger(data.userId)) {
        if (!(yield prisma_default.user.findUnique({ where: { id: data.userId } }))) {
          errors.userId = "user with this id doesn't exist";
        }
      } else {
        errors.userId = "must be positive integer";
      }
    } else {
      errors.userId = "required";
    }
    return Object.keys(errors).length ? {
      validatedData: void 0,
      errors
    } : {
      validatedData: {
        description: data.description,
        userId: data.userId
      },
      errors: void 0
    };
  });
}
function validateUpdateData(data) {
  const errors = {};
  if ("description" in data) {
    if (!isNotEmptyString(data.description)) {
      errors.description = "must be not empty string";
    }
  }
  return Object.keys(errors).length ? {
    validatedData: void 0,
    errors
  } : {
    validatedData: {
      description: data.description
    },
    errors: void 0
  };
}

// src/components/authors/controllers.ts
function createAuthor2(req, res) {
  return __async(this, null, function* () {
    const {
      validatedData: validatedCreationData,
      errors: creationDataValidationErrors
    } = yield validateCreationData2(req.body);
    if (creationDataValidationErrors) {
      res.status(400).json(creationDataValidationErrors);
    } else {
      void createAuthor(validatedCreationData, () => {
        res.status(201).end();
      });
    }
  });
}
function getAuthors2(req, res) {
  return __async(this, null, function* () {
    const {
      validatedData: validatedPaginationQueryParameters,
      errors: paginationQueryParametersValidationErrors
    } = validatePaginationQueryParameters(req.query);
    if (paginationQueryParametersValidationErrors) {
      res.status(400).json(paginationQueryParametersValidationErrors);
    } else {
      void getAuthors(
        validatedPaginationQueryParameters,
        (authors, authorsTotalNumber, pagesTotalNumber) => {
          res.json({ authors, authorsTotalNumber, pagesTotalNumber });
        }
      );
    }
  });
}
function updateAuthor(req, res) {
  return __async(this, null, function* () {
    const authorToUpdate = yield prisma_default.author.findUnique({
      where: { id: Number(req.params.id) }
    });
    if (authorToUpdate) {
      const {
        validatedData: validatedUpdateData,
        errors: updateDataValidationErrors
      } = validateUpdateData(req.body);
      if (updateDataValidationErrors) {
        res.status(400).json(updateDataValidationErrors);
      } else {
        void updateAuthorById(
          authorToUpdate.id,
          validatedUpdateData,
          () => {
            res.status(204).end();
          }
        );
      }
    } else {
      res.status(404).end();
    }
  });
}
function deleteAuthor(req, res) {
  return __async(this, null, function* () {
    void deleteAuthorById(
      Number(req.params.id),
      () => {
        res.status(204).end();
      },
      () => {
        res.status(404).end();
      }
    );
  });
}

// src/components/authors/router.ts
var router3 = (0, import_express3.Router)();
router3.post("", authenticateUser(true), createAuthor2);
router3.get("", authenticateUser(true), getAuthors2);
router3.patch("/:id(\\d+)", authenticateUser(true), updateAuthor);
router3.delete("/:id(\\d+)", authenticateUser(true), deleteAuthor);
var router_default3 = router3;

// src/components/tags/router.ts
var import_express4 = require("express");

// src/components/tags/services.ts
function createTag(_0, _1) {
  return __async(this, arguments, function* ({ name }, onSuccess) {
    yield prisma_default.tag.create({ data: { name } });
    onSuccess();
  });
}
function getTags(validatedPaginationQueryParameters, onSuccess) {
  return __async(this, null, function* () {
    const tags = yield prisma_default.tag.findMany(__spreadValues({}, createPaginationParameters(validatedPaginationQueryParameters)));
    const tagsTotalNumber = yield prisma_default.tag.count();
    onSuccess(
      tags,
      tagsTotalNumber,
      calculatePagesTotalNumber(tagsTotalNumber, tags.length)
    );
  });
}
function updateTagById(_0, _1, _2) {
  return __async(this, arguments, function* (id, { name }, onSuccess) {
    yield prisma_default.tag.update({ where: { id }, data: { name } });
    onSuccess();
  });
}
function deleteTagById(id, onSuccess, onFailure) {
  return __async(this, null, function* () {
    try {
      yield prisma_default.tag.delete({ where: { id } });
      onSuccess();
    } catch (error) {
      console.log(error);
      onFailure();
    }
  });
}

// src/components/tags/validators.ts
function validateCreationData3(data) {
  return __async(this, null, function* () {
    const errors = {};
    if ("name" in data) {
      if (isNotEmptyString(data.name)) {
        if (yield prisma_default.tag.findUnique({ where: { name: data.name } })) {
          errors.name = "tag with the same name already exists";
        }
      } else {
        errors.name = "must be not empty string";
      }
    } else {
      errors.name = "required";
    }
    return Object.keys(errors).length ? {
      validatedData: void 0,
      errors
    } : {
      validatedData: {
        name: data.name
      },
      errors: void 0
    };
  });
}
function validateUpdateData2(data) {
  return __async(this, null, function* () {
    const errors = {};
    if ("name" in data) {
      if (isNotEmptyString(data.name)) {
        if (yield prisma_default.tag.findUnique({ where: { name: data.name } })) {
          errors.name = "tag with the same name already exists";
        }
      } else {
        errors.name = "must be not empty string";
      }
    }
    return Object.keys(errors).length ? {
      validatedData: void 0,
      errors
    } : {
      validatedData: {
        name: data.name
      },
      errors: void 0
    };
  });
}

// src/components/tags/controllers.ts
function createTag2(req, res) {
  return __async(this, null, function* () {
    const {
      validatedData: validatedCreationData,
      errors: creationDataValidationErrors
    } = yield validateCreationData3(req.body);
    if (creationDataValidationErrors) {
      res.status(400).json(creationDataValidationErrors);
    } else {
      void createTag(validatedCreationData, () => {
        res.status(201).end();
      });
    }
  });
}
function getTags2(req, res) {
  return __async(this, null, function* () {
    const {
      validatedData: validatedPaginationQueryParameters,
      errors: paginationQueryParametersValidationErrors
    } = validatePaginationQueryParameters(req.query);
    if (paginationQueryParametersValidationErrors) {
      res.status(400).json(paginationQueryParametersValidationErrors);
    } else {
      void getTags(
        validatedPaginationQueryParameters,
        (tags, tagsTotalNumber, pagesTotalNumber) => {
          res.json({ tags, tagsTotalNumber, pagesTotalNumber });
        }
      );
    }
  });
}
function updateTag(req, res) {
  return __async(this, null, function* () {
    const tagToUpdate = yield prisma_default.tag.findUnique({
      where: {
        id: Number(req.params.id)
      }
    });
    if (tagToUpdate) {
      const {
        validatedData: validatedUpdateData,
        errors: updateDataValidationErrors
      } = yield validateUpdateData2(req.body);
      if (updateDataValidationErrors) {
        res.status(400).json(updateDataValidationErrors);
      } else {
        void updateTagById(tagToUpdate.id, validatedUpdateData, () => {
          res.status(204).end();
        });
      }
    } else {
      res.status(404).end();
    }
  });
}
function deleteTag(req, res) {
  return __async(this, null, function* () {
    void deleteTagById(
      Number(req.params.id),
      () => {
        res.status(204).end();
      },
      () => {
        res.status(404).end();
      }
    );
  });
}

// src/components/tags/router.ts
var router4 = (0, import_express4.Router)();
router4.post("", authenticateUser(true), createTag2);
router4.get("", getTags2);
router4.patch("/:id(\\d+)", authenticateUser(true), updateTag);
router4.delete("/:id(\\d+)", authenticateUser(true), deleteTag);
var router_default4 = router4;

// src/components/categories/router.ts
var import_express5 = require("express");

// src/components/categories/utils.ts
function includeSubcategories(category) {
  return __async(this, null, function* () {
    const subcategories = yield prisma_default.category.findMany({
      where: {
        parentCategoryId: category.id
      },
      select: {
        id: true,
        name: true
      }
    });
    if (subcategories.length) {
      category.subcategories = subcategories;
      for (const subcategory of subcategories) {
        yield includeSubcategories(subcategory);
      }
    }
  });
}

// src/components/categories/services.ts
function createCategory(_0, _1) {
  return __async(this, arguments, function* ({ name, parentCategoryId }, onSuccess) {
    yield prisma_default.category.create({ data: { name, parentCategoryId } });
    onSuccess();
  });
}
function getCategories(validatedPaginationQueryParameters, onSuccess) {
  return __async(this, null, function* () {
    const categories = yield prisma_default.category.findMany(__spreadProps(__spreadValues({
      where: {
        parentCategoryId: null
      }
    }, createPaginationParameters(validatedPaginationQueryParameters)), {
      select: {
        id: true,
        name: true
      }
    }));
    const categoriesTotalNumber = yield prisma_default.category.count({
      where: { parentCategoryId: null }
    });
    for (const category of categories) {
      yield includeSubcategories(category);
    }
    onSuccess(
      categories,
      categoriesTotalNumber,
      calculatePagesTotalNumber(categoriesTotalNumber, categories.length)
    );
  });
}
function updateCategoryById(_0, _1, _2) {
  return __async(this, arguments, function* (id, { name, parentCategoryId }, onSuccess) {
    yield prisma_default.category.update({
      where: {
        id
      },
      data: {
        name,
        parentCategoryId
      }
    });
    onSuccess();
  });
}
function deleteCategoryById(id, onSuccess, onFailure) {
  return __async(this, null, function* () {
    try {
      yield prisma_default.category.delete({ where: { id } });
      onSuccess();
    } catch (error) {
      console.log(error);
      onFailure();
    }
  });
}

// src/components/categories/validators.ts
function validateCreationData4(data) {
  return __async(this, null, function* () {
    const errors = {};
    if ("name" in data) {
      if (isNotEmptyString(data.name)) {
        if (yield prisma_default.category.findUnique({ where: { name: data.name } })) {
          errors.name = "category with the same name already exists";
        }
      } else {
        errors.name = "must be not empty string";
      }
    } else {
      errors.name = "required";
    }
    if ("parentCategoryId" in data) {
      if (isPositiveInteger(data.parentCategoryId)) {
        if (!(yield prisma_default.category.findUnique({
          where: { id: data.parentCategoryId }
        }))) {
          errors.parentCategoryId = "parent category with this id doesn't exist";
        }
      } else {
        errors.parentCategoryId = "must be positive integer";
      }
    }
    return Object.keys(errors).length ? {
      validatedData: void 0,
      errors
    } : {
      validatedData: {
        name: data.name,
        parentCategoryId: data.parentCategoryId
      },
      errors: void 0
    };
  });
}
function validateUpdateData3(data) {
  return __async(this, null, function* () {
    const errors = {};
    if ("name" in data) {
      if (isNotEmptyString(data.name)) {
        if (yield prisma_default.category.findUnique({ where: { name: data.name } })) {
          errors.name = "category with the same name already exists";
        }
      } else {
        errors.name = "must be not empty string";
      }
    }
    if ("parentCategoryId" in data) {
      const isParentCategoryIdPositiveInteger = isPositiveInteger(
        data.parentCategoryId
      );
      if (isParentCategoryIdPositiveInteger || data.parentCategoryId === null) {
        if (isParentCategoryIdPositiveInteger && !(yield prisma_default.category.findUnique({
          where: { id: data.parentCategoryId }
        }))) {
          errors.parentCategoryId = "parent category with this id doesn't exist";
        }
      } else {
        errors.parentCategoryId = "must be positive integer or null";
      }
    }
    return Object.keys(errors).length ? {
      validatedData: void 0,
      errors
    } : {
      validatedData: {
        name: data.name,
        parentCategoryId: data.parentCategoryId
      },
      errors: void 0
    };
  });
}

// src/components/categories/controllers.ts
function createCategory2(req, res) {
  return __async(this, null, function* () {
    const {
      validatedData: validatedCreationData,
      errors: creationDataValidationErrors
    } = yield validateCreationData4(req.body);
    if (creationDataValidationErrors) {
      res.status(400).json(creationDataValidationErrors);
    } else {
      void createCategory(validatedCreationData, () => {
        res.status(201).end();
      });
    }
  });
}
function getCategories2(req, res) {
  return __async(this, null, function* () {
    const {
      validatedData: validatedPaginationQueryParameters,
      errors: paginationQueryParametersValidationErrors
    } = validatePaginationQueryParameters(req.query);
    if (paginationQueryParametersValidationErrors) {
      res.status(400).json(paginationQueryParametersValidationErrors);
    } else {
      void getCategories(
        validatedPaginationQueryParameters,
        (categories, categoriesTotalNumber, pagesTotalNumber) => {
          res.json({ categories, categoriesTotalNumber, pagesTotalNumber });
        }
      );
    }
  });
}
function updateCategory(req, res) {
  return __async(this, null, function* () {
    const categoryToUpdate = yield prisma_default.category.findUnique({
      where: {
        id: Number(req.params.id)
      }
    });
    if (categoryToUpdate) {
      const {
        validatedData: validatedUpdateData,
        errors: updateDataValidationErrors
      } = yield validateUpdateData3(req.body);
      if (updateDataValidationErrors) {
        res.status(400).json(updateDataValidationErrors);
      } else {
        void updateCategoryById(
          categoryToUpdate.id,
          validatedUpdateData,
          () => {
            res.status(204).end();
          }
        );
      }
    } else {
      res.status(404).end();
    }
  });
}
function deleteCategory(req, res) {
  return __async(this, null, function* () {
    void deleteCategoryById(
      Number(req.params.id),
      () => {
        res.status(204).end();
      },
      () => {
        res.status(404).end();
      }
    );
  });
}

// src/components/categories/router.ts
var router5 = (0, import_express5.Router)();
router5.post("", authenticateUser(true), createCategory2);
router5.get("", getCategories2);
router5.patch("/:id(\\d+)", authenticateUser(true), updateCategory);
router5.delete("/:id(\\d+)", authenticateUser(true), deleteCategory);
var router_default5 = router5;

// src/components/posts/router.ts
var import_express7 = require("express");

// src/components/posts/comments/router.ts
var import_express6 = require("express");

// src/components/posts/comments/services.ts
function createComment(_0, _1) {
  return __async(this, arguments, function* ({ content, postId }, onSuccess) {
    yield prisma_default.comment.create({ data: { content, postId } });
    onSuccess();
  });
}
function getCommentsByPostId(postId, validatedPaginationQueryParameters, onSuccess) {
  return __async(this, null, function* () {
    const comments = yield prisma_default.comment.findMany(__spreadProps(__spreadValues({
      where: {
        postId
      }
    }, createPaginationParameters(validatedPaginationQueryParameters)), {
      select: {
        id: true,
        content: true
      }
    }));
    const commentsTotalNumber = yield prisma_default.comment.count({
      where: {
        postId
      }
    });
    onSuccess(
      comments,
      commentsTotalNumber,
      calculatePagesTotalNumber(commentsTotalNumber, comments.length)
    );
  });
}
function deleteCommentsByPostId(postId, onSuccess) {
  return __async(this, null, function* () {
    yield prisma_default.comment.deleteMany({ where: { postId } });
    onSuccess();
  });
}

// src/components/posts/comments/validators.ts
function validateCreationData5(data) {
  const errors = {};
  if ("content" in data) {
    if (!isNotEmptyString(data.content)) {
      errors.content = "must be not empty string";
    }
  } else {
    errors.content = "required";
  }
  return Object.keys(errors).length ? {
    validatedData: void 0,
    errors
  } : {
    validatedData: {
      content: data.content,
      postId: data.postId
    },
    errors: void 0
  };
}

// src/components/posts/comments/controllers.ts
function createComment2(req, res) {
  return __async(this, null, function* () {
    const postToCreateCommentFor = yield prisma_default.post.findUnique({
      where: {
        id: Number(req.params.postId),
        isDraft: false
      }
    });
    if (postToCreateCommentFor) {
      const {
        validatedData: validatedCreationData,
        errors: creationDataValidationErrors
      } = validateCreationData5(__spreadProps(__spreadValues({}, req.body), {
        postId: postToCreateCommentFor.id
      }));
      if (creationDataValidationErrors) {
        res.status(400).json(creationDataValidationErrors);
      } else {
        void createComment(validatedCreationData, () => {
          res.status(201).end();
        });
      }
    } else {
      res.status(404).end();
    }
  });
}
function getComments(req, res) {
  return __async(this, null, function* () {
    const postToGetCommentsFor = yield prisma_default.post.findUnique({
      where: {
        id: Number(req.params.postId),
        isDraft: false
      }
    });
    if (postToGetCommentsFor) {
      const {
        validatedData: validatedPaginationQueryParameters,
        errors: paginationQueryParametersValidationErrors
      } = validatePaginationQueryParameters(req.query);
      if (paginationQueryParametersValidationErrors) {
        res.status(400).json(paginationQueryParametersValidationErrors);
      } else {
        void getCommentsByPostId(
          postToGetCommentsFor.id,
          validatedPaginationQueryParameters,
          (comments, commentsTotalNumber, pagesTotalNumber) => {
            res.json({ comments, commentsTotalNumber, pagesTotalNumber });
          }
        );
      }
    } else {
      res.status(404).end();
    }
  });
}
function deleteComments(req, res) {
  return __async(this, null, function* () {
    const postToDeleteCommentsFrom = yield prisma_default.post.findUnique({
      where: {
        id: Number(req.params.postId),
        isDraft: false
      }
    });
    if (postToDeleteCommentsFrom) {
      void deleteCommentsByPostId(postToDeleteCommentsFrom.id, () => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  });
}

// src/components/posts/comments/router.ts
var router6 = (0, import_express6.Router)({ mergeParams: true });
router6.post("", authenticateUser(), createComment2);
router6.get("", getComments);
router6.delete("", authenticateUser(true), deleteComments);
var router_default6 = router6;

// src/components/posts/services.ts
var import_crypto = __toESM(require("crypto"));

// src/components/posts/utils.ts
function createFilterParameters({
  titleContains,
  contentContains,
  authorFirstName,
  categoryId,
  tagId,
  tagIdIn,
  tagIdAll,
  createdAt,
  createdAtLt,
  createdAtGt
}) {
  const filterParameters = {
    isDraft: false
  };
  if (titleContains) {
    filterParameters.title = {
      contains: titleContains
    };
  }
  if (contentContains) {
    filterParameters.content = {
      contains: contentContains
    };
  }
  if (authorFirstName) {
    filterParameters.author = {
      user: {
        firstName: authorFirstName
      }
    };
  }
  if (categoryId) {
    filterParameters.category = {
      id: Number(categoryId)
    };
  }
  if (tagId) {
    filterParameters.tags = {
      some: {
        id: Number(tagId)
      }
    };
  }
  if (tagIdIn) {
    filterParameters.OR = tagIdIn.map((tagId2) => ({
      tags: {
        some: {
          id: Number(tagId2)
        }
      }
    }));
  }
  if (tagIdAll) {
    filterParameters.AND = tagIdAll.map((tagId2) => ({
      tags: {
        some: {
          id: Number(tagId2)
        }
      }
    }));
  }
  if (createdAt) {
    const desiredDate = new Date(createdAt);
    const nextDayAfterDesiredDate = new Date(createdAt);
    nextDayAfterDesiredDate.setDate(nextDayAfterDesiredDate.getDate() + 1);
    filterParameters.createdAt = {
      gte: desiredDate,
      lt: nextDayAfterDesiredDate
    };
  }
  if (createdAtLt) {
    filterParameters.createdAt = {
      lt: new Date(createdAtLt)
    };
  }
  if (createdAtGt) {
    const nextDayAfterDesiredDate = new Date(createdAtGt);
    nextDayAfterDesiredDate.setDate(nextDayAfterDesiredDate.getDate() + 1);
    filterParameters.createdAt = {
      gte: nextDayAfterDesiredDate
    };
  }
  return filterParameters;
}
function createOrderParameters({
  orderBy
}) {
  const orderParams = {};
  if (orderBy === "createdAt") {
    orderParams.createdAt = "asc";
  }
  if (orderBy === "-createdAt") {
    orderParams.createdAt = "desc";
  }
  if (orderBy === "authorFirstName") {
    orderParams.author = {
      user: {
        firstName: "asc"
      }
    };
  }
  if (orderBy === "-authorFirstName") {
    orderParams.author = {
      user: {
        firstName: "desc"
      }
    };
  }
  if (orderBy === "category") {
    orderParams.category = {
      category: "asc"
    };
  }
  if (orderBy === "-category") {
    orderParams.category = {
      category: "desc"
    };
  }
  if (orderBy === "imagesNumber") {
    orderParams.extraImages = {
      _count: "asc"
    };
  }
  if (orderBy === "-imagesNumber") {
    orderParams.extraImages = {
      _count: "desc"
    };
  }
  return orderParams;
}

// src/components/posts/services.ts
function createPost(_0, _1) {
  return __async(this, arguments, function* ({
    image,
    extraImages,
    title,
    content,
    authorId,
    categoryId,
    tagsIds
  }, onSuccess) {
    const postImagesFolderName = `posts/${import_crypto.default.randomUUID()}`;
    yield prisma_default.post.create({
      data: {
        image: saveImage(image, postImagesFolderName, "main"),
        extraImages: extraImages ? {
          createMany: {
            data: extraImages.map((extraImage, index) => ({
              image: saveImage(
                extraImage,
                postImagesFolderName,
                `extra-${index}`
              )
            }))
          }
        } : void 0,
        title,
        content,
        author: {
          connect: {
            id: authorId
          }
        },
        category: {
          connect: {
            id: categoryId
          }
        },
        tags: {
          connect: tagsIds.map((tagId) => ({
            id: tagId
          }))
        }
      }
    });
    onSuccess();
  });
}
function getPosts(validatedFilterQueryParameters, validatedPaginationQueryParameters, validatedOrderQueryParameters, onSuccess) {
  return __async(this, null, function* () {
    const filterParameters = createFilterParameters(
      validatedFilterQueryParameters
    );
    const posts = yield prisma_default.post.findMany(__spreadProps(__spreadValues({
      where: filterParameters
    }, createPaginationParameters(validatedPaginationQueryParameters)), {
      orderBy: createOrderParameters(validatedOrderQueryParameters),
      select: {
        id: true,
        image: true,
        extraImages: {
          select: {
            id: true,
            image: true
          }
        },
        title: true,
        content: true,
        author: {
          select: {
            id: true,
            description: true
          }
        },
        category: {
          select: {
            id: true,
            name: true
          }
        },
        tags: {
          select: {
            id: true,
            name: true
          }
        },
        comments: {
          select: {
            id: true,
            content: true
          }
        },
        createdAt: true
      }
    }));
    const postsTotalNumber = yield prisma_default.post.count({
      where: filterParameters
    });
    for (const post of posts) {
      yield includeSubcategories(post.category);
    }
    onSuccess(
      posts,
      postsTotalNumber,
      calculatePagesTotalNumber(postsTotalNumber, posts.length)
    );
  });
}
function updatePostById(_0, _1, _2) {
  return __async(this, arguments, function* (id, {
    image,
    extraImages,
    title,
    content,
    authorId,
    categoryId,
    tagsIds
  }, onSuccess) {
    const updatedPost = yield prisma_default.post.update({
      where: {
        id
      },
      data: {
        title,
        content,
        authorId,
        categoryId,
        tags: tagsIds ? {
          set: [],
          connect: tagsIds.map((tagId) => ({
            id: tagId
          }))
        } : void 0
      }
    });
    if (image != null ? image : extraImages) {
      const postToUpdateImagesFolderName = `posts/${getHostedImageFolderName(
        updatedPost.image
      )}`;
      if (image) {
        saveImage(image, postToUpdateImagesFolderName, "main");
      }
      if (extraImages) {
        const postToUpdateExtraImages = yield prisma_default.postExtraImage.findMany({
          where: {
            postId: id
          }
        });
        for (const postToUpdateExtraImage of postToUpdateExtraImages) {
          const deletedPostToUpdateExtraImage = yield prisma_default.postExtraImage.delete({
            where: {
              id: postToUpdateExtraImage.id
            }
          });
          deleteHostedImage(deletedPostToUpdateExtraImage.image);
        }
        yield prisma_default.post.update({
          where: {
            id
          },
          data: {
            extraImages: {
              createMany: {
                data: extraImages.map((extraImage, index) => ({
                  image: saveImage(
                    extraImage,
                    postToUpdateImagesFolderName,
                    `extra-${index}`
                  )
                }))
              }
            }
          }
        });
      }
    }
    onSuccess();
  });
}
function deletePostById(id, onSuccess, onFailure) {
  return __async(this, null, function* () {
    try {
      const deletedPost = yield prisma_default.post.delete({
        where: {
          id,
          isDraft: false
        }
      });
      deleteHostedImageFolder(deletedPost.image);
      onSuccess();
    } catch (error) {
      console.log(error);
      onFailure();
    }
  });
}

// src/components/posts/constants.ts
var ORDER_VALID_VALUES = [
  "createdAt",
  "-createdAt",
  "authorFirstName",
  "-authorFirstName",
  "category",
  "-category",
  "imagesNumber",
  "-imagesNumber"
];

// src/components/posts/validators.ts
function validateCreationData6(data) {
  return __async(this, null, function* () {
    const errors = {};
    if ("image" in data) {
      if (!isBase64ImageDataUrl(data.image)) {
        errors.image = "must be base64 image in data URL format with mediatype";
      }
    } else {
      errors.image = "required";
    }
    if ("extraImages" in data) {
      if (!isBase64ImageDataUrlsNotEmptyArray(data.extraImages)) {
        errors.extraImages = "must be not empty array of base64 images in data URL formats with mediatypes";
      }
    }
    if ("title" in data) {
      if (!isNotEmptyString(data.title)) {
        errors.title = "must be not empty string";
      }
    } else {
      errors.title = "required";
    }
    if ("content" in data) {
      if (!isNotEmptyString(data.content)) {
        errors.content = "must be not empty string";
      }
    } else {
      errors.content = "required";
    }
    if ("categoryId" in data) {
      if (isPositiveInteger(data.categoryId)) {
        if (!(yield prisma_default.category.findUnique({ where: { id: data.categoryId } }))) {
          errors.categoryId = "category with this id doesn't exist";
        }
      } else {
        errors.categoryId = "must be positive integer";
      }
    } else {
      errors.categoryId = "required";
    }
    if ("tagsIds" in data) {
      if (isPositiveIntegersNotEmptyArray(data.tagsIds)) {
        for (const tagId of data.tagsIds) {
          const tag = yield prisma_default.tag.findUnique({
            where: { id: tagId }
          });
          if (!tag) {
            const errorMessage = "tag with this id doesn't exist";
            if ("tagsIds" in errors && typeof errors.tagsIds === "object") {
              errors.tagsIds[tagId] = errorMessage;
            } else {
              errors.tagsIds = {
                [tagId]: errorMessage
              };
            }
          }
        }
      } else {
        errors.tagsIds = "must be not empty positive integers array";
      }
    } else {
      errors.tagsIds = "required";
    }
    return Object.keys(errors).length ? {
      validatedData: void 0,
      errors
    } : {
      validatedData: {
        image: data.image,
        extraImages: data.extraImages,
        title: data.title,
        content: data.content,
        authorId: data.authorId,
        categoryId: data.categoryId,
        tagsIds: data.tagsIds
      },
      errors: void 0
    };
  });
}
function validateFilterQueryParameters(queryParameters) {
  const errors = {};
  if ("titleContains" in queryParameters) {
    if (!isNotEmptyString(queryParameters.titleContains)) {
      errors.titleContains = "must be not empty string";
    }
  }
  if ("contentContains" in queryParameters) {
    if (!isNotEmptyString(queryParameters.contentContains)) {
      errors.contentContains = "must be not empty string";
    }
  }
  if ("authorFirstName" in queryParameters) {
    if (!isNotEmptyString(queryParameters.authorFirstName)) {
      errors.authorFirstName = "must be not empty string";
    }
  }
  if ("categoryId" in queryParameters) {
    if (!isStringPositiveInteger(queryParameters.categoryId)) {
      errors.categoryId = "must be positive integer";
    }
  }
  if ("tagId" in queryParameters) {
    if (!isStringPositiveInteger(queryParameters.tagId)) {
      errors.tagId = "must be positive integer";
    }
  }
  if ("tagIdIn" in queryParameters) {
    if (!isStringPositiveIntegersNotEmptyArray(queryParameters.tagIdIn)) {
      errors.tagIdIn = "must be positive integers delimited by ampersand";
    }
  }
  if ("tagIdAll" in queryParameters) {
    if (!isStringPositiveIntegersNotEmptyArray(queryParameters.tagIdAll)) {
      errors.tagIdAll = "must be positive integers delimited by ampersand";
    }
  }
  if ("createdAt" in queryParameters) {
    if (!isDateString(queryParameters.createdAt)) {
      errors.createdAt = "must be string representation of a date";
    }
  }
  if ("createdAtLt" in queryParameters) {
    if (!isDateString(queryParameters.createdAtLt)) {
      errors.createdAtLt = "must be string representation of a date";
    }
  }
  if ("createdAtGt" in queryParameters) {
    if (!isDateString(queryParameters.createdAtGt)) {
      errors.createdAtGt = "must be string representation of a date";
    }
  }
  return Object.keys(errors).length ? {
    validatedData: void 0,
    errors
  } : {
    validatedData: {
      titleContains: queryParameters.titleContains,
      contentContains: queryParameters.contentContains,
      authorFirstName: queryParameters.authorFirstName,
      categoryId: queryParameters.categoryId,
      tagId: queryParameters.tagId,
      tagIdIn: queryParameters.tagIdIn,
      tagIdAll: queryParameters.tagIdAll,
      createdAt: queryParameters.createdAt,
      createdAtLt: queryParameters.createdAtLt,
      createdAtGt: queryParameters.createdAtGt
    },
    errors: void 0
  };
}
function validateOrderQueryParameters(queryParameters) {
  const errors = {};
  if ("orderBy" in queryParameters) {
    if (typeof queryParameters.orderBy !== "string" || !ORDER_VALID_VALUES.includes(queryParameters.orderBy)) {
      errors.orderBy = `must be one of the following strings [${String(
        ORDER_VALID_VALUES
      )}]`;
    }
  }
  return Object.keys(errors).length ? {
    validatedData: void 0,
    errors
  } : {
    validatedData: {
      orderBy: queryParameters.orderBy
    },
    errors: void 0
  };
}
function validateUpdateData4(data, isPostBeingValidated = true) {
  return __async(this, null, function* () {
    const errors = {};
    if ("image" in data) {
      if (!isBase64ImageDataUrl(data.image)) {
        errors.image = "must be base64 image in data URL format with mediatype";
      }
    }
    if ("extraImages" in data) {
      if (!isBase64ImageDataUrlsNotEmptyArray(data.extraImages)) {
        errors.extraImages = "must be array of base64 images in data URL formats with mediatypes";
      }
    }
    if ("title" in data) {
      if (!isNotEmptyString(data.title)) {
        errors.title = "must be not empty string";
      }
    }
    if ("content" in data) {
      if (!isNotEmptyString(data.content)) {
        errors.content = "must be not empty string";
      }
    }
    if (isPostBeingValidated && "authorId" in data) {
      if (isPositiveInteger(data.authorId)) {
        if (!(yield prisma_default.author.findUnique({ where: { id: data.authorId } }))) {
          errors.authorId = "author with this id doesn't exist";
        }
      } else {
        errors.authorId = "must be positive integer";
      }
    }
    if ("categoryId" in data) {
      if (isPositiveInteger(data.categoryId)) {
        if (!(yield prisma_default.category.findUnique({ where: { id: data.categoryId } }))) {
          errors.categoryId = "category with this id doesn't exist";
        }
      } else {
        errors.categoryId = "must be positive integer";
      }
    }
    if ("tagsIds" in data) {
      if (isPositiveIntegersNotEmptyArray(data.tagsIds)) {
        for (const tagId of data.tagsIds) {
          const tag = yield prisma_default.tag.findUnique({
            where: { id: tagId }
          });
          if (!tag) {
            const errorMessage = "tag with this id doesn't exist";
            if ("tagsIds" in errors && typeof errors.tagsIds === "object") {
              errors.tagsIds[tagId] = errorMessage;
            } else {
              errors.tagsIds = {
                [tagId]: errorMessage
              };
            }
          }
        }
      } else {
        errors.tagsIds = "must be not empty positive integers array";
      }
    }
    return Object.keys(errors).length ? {
      validatedData: void 0,
      errors
    } : {
      validatedData: {
        image: data.image,
        extraImages: data.extraImages,
        title: data.title,
        content: data.content,
        authorId: isPostBeingValidated ? data.authorId : void 0,
        categoryId: data.categoryId,
        tagsIds: data.tagsIds
      },
      errors: void 0
    };
  });
}

// src/components/posts/controllers.ts
function createPost2(req, res) {
  return __async(this, null, function* () {
    var _a;
    const {
      validatedData: validatedCreationData,
      errors: creationDataValidationErrors
    } = yield validateCreationData6(__spreadProps(__spreadValues({}, req.body), {
      authorId: (_a = req.authenticatedAuthor) == null ? void 0 : _a.id
    }));
    if (creationDataValidationErrors) {
      res.status(400).json(creationDataValidationErrors);
    } else {
      void createPost(validatedCreationData, () => {
        res.status(201).end();
      });
    }
  });
}
function getPosts2(req, res) {
  return __async(this, null, function* () {
    const {
      validatedData: validatedFilterQueryParameters,
      errors: filterQueryParametersValidationErrors
    } = validateFilterQueryParameters(req.query);
    if (filterQueryParametersValidationErrors) {
      res.status(400).json(filterQueryParametersValidationErrors);
    } else {
      const {
        validatedData: validatedPaginationQueryParameters,
        errors: paginationQueryParametersValidationErrors
      } = validatePaginationQueryParameters(req.query);
      if (paginationQueryParametersValidationErrors) {
        res.status(400).json(paginationQueryParametersValidationErrors);
      } else {
        const {
          validatedData: validatedOrderQueryParameters,
          errors: orderQueryParametersValidationErrors
        } = validateOrderQueryParameters(req.query);
        if (orderQueryParametersValidationErrors) {
          res.status(400).json(orderQueryParametersValidationErrors);
        } else {
          void getPosts(
            validatedFilterQueryParameters,
            validatedPaginationQueryParameters,
            validatedOrderQueryParameters,
            (posts, postsTotalNumber, pagesTotalNumber) => {
              res.json({ posts, postsTotalNumber, pagesTotalNumber });
            }
          );
        }
      }
    }
  });
}
function updatePost(req, res) {
  return __async(this, null, function* () {
    const postToUpdate = yield prisma_default.post.findUnique({
      where: {
        id: Number(req.params.id),
        isDraft: false
      }
    });
    if (postToUpdate) {
      const {
        validatedData: validatedUpdateData,
        errors: updateDataValidationErrors
      } = yield validateUpdateData4(req.body);
      if (updateDataValidationErrors) {
        res.status(400).json(updateDataValidationErrors);
      } else {
        void updatePostById(postToUpdate.id, validatedUpdateData, () => {
          res.status(204).end();
        });
      }
    } else {
      res.status(404).end();
    }
  });
}
function deletePost(req, res) {
  return __async(this, null, function* () {
    void deletePostById(
      Number(req.params.id),
      () => {
        res.status(204).end();
      },
      () => {
        res.status(404).end();
      }
    );
  });
}

// src/components/posts/router.ts
var router7 = (0, import_express7.Router)();
router7.post("", authenticateUser(), authenticateAuthor, createPost2);
router7.get("", getPosts2);
router7.patch("/:id(\\d+)", authenticateUser(true), updatePost);
router7.delete("/:id(\\d+)", authenticateUser(true), deletePost);
router7.use("/:postId(\\d+)/comments", router_default6);
var router_default7 = router7;

// src/components/drafts/router.ts
var import_express8 = require("express");

// src/components/drafts/services.ts
var import_crypto2 = __toESM(require("crypto"));
function createDraft(_0, _1) {
  return __async(this, arguments, function* ({
    image,
    extraImages,
    title,
    content,
    authorId,
    categoryId,
    tagsIds
  }, onSuccess) {
    const draftImagesFolderName = `posts/${import_crypto2.default.randomUUID()}`;
    yield prisma_default.post.create({
      data: {
        image: saveImage(image, draftImagesFolderName, "main"),
        extraImages: extraImages ? {
          createMany: {
            data: extraImages.map((extraImage, index) => ({
              image: saveImage(
                extraImage,
                draftImagesFolderName,
                `extra-${index}`
              )
            }))
          }
        } : void 0,
        title,
        content,
        author: {
          connect: {
            id: authorId
          }
        },
        category: {
          connect: {
            id: categoryId
          }
        },
        tags: {
          connect: tagsIds.map((tagId) => ({
            id: tagId
          }))
        },
        isDraft: true
      }
    });
    onSuccess();
  });
}
function getDraftsByAuthorId(authorId, validatedPaginationQueryParameters, onSuccess) {
  return __async(this, null, function* () {
    const drafts = yield prisma_default.post.findMany(__spreadProps(__spreadValues({
      where: {
        isDraft: true,
        author: {
          id: authorId
        }
      }
    }, createPaginationParameters(validatedPaginationQueryParameters)), {
      select: {
        id: true,
        image: true,
        extraImages: {
          select: {
            id: true,
            image: true
          }
        },
        title: true,
        content: true,
        author: {
          select: {
            id: true,
            description: true
          }
        },
        category: {
          select: {
            id: true,
            name: true
          }
        },
        tags: {
          select: {
            id: true,
            name: true
          }
        },
        comments: {
          select: {
            id: true,
            content: true
          }
        },
        createdAt: true
      }
    }));
    const draftsTotalNumber = yield prisma_default.post.count({
      where: {
        isDraft: true,
        author: {
          id: authorId
        }
      }
    });
    for (const draft of drafts) {
      yield includeSubcategories(draft.category);
    }
    onSuccess(
      drafts,
      draftsTotalNumber,
      calculatePagesTotalNumber(draftsTotalNumber, drafts.length)
    );
  });
}
function updateDraftById(_0, _1, _2) {
  return __async(this, arguments, function* (id, {
    image,
    extraImages,
    title,
    content,
    categoryId,
    tagsIds
  }, onSuccess) {
    const updatedDraft = yield prisma_default.post.update({
      where: {
        id
      },
      data: {
        title,
        content,
        categoryId,
        tags: tagsIds ? {
          set: [],
          connect: tagsIds.map((tagId) => ({
            id: tagId
          }))
        } : void 0
      }
    });
    if (image != null ? image : extraImages) {
      const draftToUpdateImagesFolderName = `posts/${getHostedImageFolderName(
        updatedDraft.image
      )}`;
      if (image) {
        saveImage(image, draftToUpdateImagesFolderName, "main");
      }
      if (extraImages) {
        const draftToUpdateExtraImages = yield prisma_default.postExtraImage.findMany({
          where: {
            postId: id
          }
        });
        for (const draftToUpdateExtraImage of draftToUpdateExtraImages) {
          const deletedPostToUpdateExtraImage = yield prisma_default.postExtraImage.delete({
            where: {
              id: draftToUpdateExtraImage.id
            }
          });
          deleteHostedImage(deletedPostToUpdateExtraImage.image);
        }
        yield prisma_default.post.update({
          where: {
            id
          },
          data: {
            extraImages: {
              createMany: {
                data: extraImages.map((extraImage, index) => ({
                  image: saveImage(
                    extraImage,
                    draftToUpdateImagesFolderName,
                    `extra-${index}`
                  )
                }))
              }
            }
          }
        });
      }
    }
    onSuccess();
  });
}
function publishAuthorDraft(draftId, authorId, onSuccess, onFailure) {
  return __async(this, null, function* () {
    try {
      yield prisma_default.post.update({
        where: {
          id: draftId,
          isDraft: true,
          authorId
        },
        data: {
          isDraft: false
        }
      });
      onSuccess();
    } catch (error) {
      console.log(error);
      onFailure();
    }
  });
}
function deleteAuthorDraft(draftId, authorId, onSuccess, onFailure) {
  return __async(this, null, function* () {
    try {
      const deletedDraft = yield prisma_default.post.delete({
        where: {
          id: draftId,
          isDraft: true,
          authorId
        }
      });
      deleteHostedImageFolder(deletedDraft.image);
      onSuccess();
    } catch (error) {
      console.log(error);
      onFailure();
    }
  });
}

// src/components/drafts/controllers.ts
function createDraft2(req, res) {
  return __async(this, null, function* () {
    var _a;
    const {
      validatedData: validatedCreationData,
      errors: creationDataValidationErrors
    } = yield validateCreationData6(__spreadProps(__spreadValues({}, req.body), {
      authorId: (_a = req.authenticatedAuthor) == null ? void 0 : _a.id
    }));
    if (creationDataValidationErrors) {
      res.status(400).json(creationDataValidationErrors);
    } else {
      void createDraft(validatedCreationData, () => {
        res.status(201).end();
      });
    }
  });
}
function getDrafts(req, res) {
  return __async(this, null, function* () {
    var _a;
    const {
      validatedData: validatedPaginationQueryParameters,
      errors: paginationQueryParametersValidationErrors
    } = validatePaginationQueryParameters(req.query);
    if (paginationQueryParametersValidationErrors) {
      res.status(400).json(paginationQueryParametersValidationErrors);
    } else {
      void getDraftsByAuthorId(
        (_a = req.authenticatedAuthor) == null ? void 0 : _a.id,
        validatedPaginationQueryParameters,
        (drafts, draftsTotalNumber, pagesTotalNumber) => {
          res.json({ drafts, draftsTotalNumber, pagesTotalNumber });
        }
      );
    }
  });
}
function updateDraft(req, res) {
  return __async(this, null, function* () {
    var _a;
    const draftToUpdate = yield prisma_default.post.findUnique({
      where: {
        id: Number(req.params.id),
        isDraft: true,
        authorId: (_a = req.authenticatedAuthor) == null ? void 0 : _a.id
      }
    });
    if (draftToUpdate) {
      const {
        validatedData: validatedUpdateData,
        errors: updateDataValidationErrors
      } = yield validateUpdateData4(req.body, false);
      if (updateDataValidationErrors) {
        res.status(400).json(updateDataValidationErrors);
      } else {
        void updateDraftById(
          draftToUpdate.id,
          validatedUpdateData,
          () => {
            res.status(204).end();
          }
        );
      }
    } else {
      res.status(404).end();
    }
  });
}
function publishDraft(req, res) {
  return __async(this, null, function* () {
    var _a;
    void publishAuthorDraft(
      Number(req.params.id),
      (_a = req.authenticatedAuthor) == null ? void 0 : _a.id,
      () => {
        res.status(204).end();
      },
      () => {
        res.status(404).end();
      }
    );
  });
}
function deleteDraft(req, res) {
  return __async(this, null, function* () {
    var _a;
    void deleteAuthorDraft(
      Number(req.params.id),
      (_a = req.authenticatedAuthor) == null ? void 0 : _a.id,
      () => {
        res.status(204).end();
      },
      () => {
        res.status(404).end();
      }
    );
  });
}

// src/components/drafts/router.ts
var router8 = (0, import_express8.Router)();
router8.post("", authenticateUser(), authenticateAuthor, createDraft2);
router8.get("", authenticateUser(), authenticateAuthor, getDrafts);
router8.patch("/:id(\\d+)", authenticateUser(), authenticateAuthor, updateDraft);
router8.post(
  "/:id(\\d+)/publish",
  authenticateUser(),
  authenticateAuthor,
  publishDraft
);
router8.delete(
  "/:id(\\d+)",
  authenticateUser(),
  authenticateAuthor,
  deleteDraft
);
var router_default8 = router8;

// api-docs.json
var api_docs_default = {
  openapi: "3.0.3",
  info: {
    title: "API docs for VClite",
    version: "1.0.0"
  },
  servers: [
    {
      url: "http://localhost:3000/api"
    }
  ],
  paths: {
    "/auth/login": {
      post: {
        tags: ["auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: {
                    type: "string",
                    minLength: 1
                  },
                  password: {
                    type: "string",
                    format: "password",
                    minLength: 1
                  }
                },
                required: ["username", "password"]
              }
            }
          }
        },
        responses: {
          "200": {
            $ref: "#/components/responses/JWT"
          },
          "400": {
            $ref: "#/components/responses/ValidationErrors"
          },
          "403": {
            description: "Password is incorrect"
          }
        }
      }
    },
    "/users": {
      post: {
        tags: ["users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  image: {
                    type: "string",
                    format: "base64"
                  },
                  username: {
                    type: "string",
                    minLength: 1
                  },
                  password: {
                    type: "string",
                    format: "password",
                    minLength: 1
                  },
                  firstName: {
                    type: "string",
                    minLength: 1
                  },
                  lastName: {
                    type: "string",
                    minLength: 1
                  }
                },
                required: ["image", "username", "password"]
              }
            }
          }
        },
        responses: {
          "201": {
            $ref: "#/components/responses/JWT"
          },
          "400": {
            $ref: "#/components/responses/ValidationErrors"
          },
          "422": {
            description: "User with this username already exists"
          }
        }
      },
      get: {
        tags: ["users"],
        security: [{ JWT: [] }],
        description: "Get info about **the** user assosiated with provided JWT",
        responses: {
          "200": {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "integer",
                      minimum: 1
                    },
                    image: {
                      type: "string",
                      format: "uri",
                      example: "https://localhost:3000/static/images/users/oleg.jpg"
                    },
                    username: {
                      type: "string",
                      minLength: 1,
                      example: "oleg"
                    },
                    firstName: {
                      type: "string",
                      minLength: 1,
                      nullable: true,
                      example: null
                    },
                    lastName: {
                      type: "string",
                      minLength: 1,
                      nullable: true,
                      example: null
                    },
                    isAdmin: {
                      type: "boolean"
                    },
                    createdAt: {
                      type: "string",
                      format: "date-time"
                    }
                  },
                  required: [
                    "id",
                    "image",
                    "username",
                    "firstName",
                    "lastName",
                    "isAdmin",
                    "createdAt"
                  ]
                }
              }
            }
          },
          "401": {}
        }
      }
    },
    "/users/{id}": {
      delete: {
        tags: ["users"],
        security: [{ JWT: [] }],
        parameters: [
          {
            $ref: "#/components/parameters/id"
          }
        ],
        responses: {
          "204": {},
          "404": {
            $ref: "#/components/responses/NotFoundOrNotAdmin"
          }
        }
      }
    },
    "/authors": {
      post: {
        tags: ["authors"],
        security: [{ JWT: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  description: {
                    type: "string",
                    minLength: 1
                  },
                  userId: {
                    type: "integer",
                    minimum: 1
                  }
                },
                required: ["userId"]
              }
            }
          }
        },
        responses: {
          "201": {},
          "400": {
            $ref: "#/components/responses/ValidationErrors"
          },
          "404": {
            $ref: "#/components/responses/NotAdmin"
          }
        }
      },
      get: {
        tags: ["authors"],
        security: [{ JWT: [] }],
        parameters: [
          {
            $ref: "#/components/parameters/pageNumber"
          },
          {
            $ref: "#/components/parameters/itemsNumber"
          }
        ],
        responses: {
          "200": {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    authors: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Author"
                      }
                    },
                    authorsTotalNumber: {
                      type: "integer",
                      minimum: 0
                    },
                    pagesTotalNumber: {
                      type: "integer",
                      minimum: 1
                    }
                  },
                  required: [
                    "authors",
                    "authorsTotalNumber",
                    "pagesTotalNumber"
                  ]
                }
              }
            }
          },
          "404": {
            $ref: "#/components/responses/NotAdmin"
          }
        }
      }
    },
    "/authors/{id}": {
      patch: {
        tags: ["authors"],
        security: [{ JWT: [] }],
        parameters: [
          {
            $ref: "#/components/parameters/id"
          }
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  description: {
                    type: "string",
                    minLength: 1
                  },
                  userId: {
                    type: "integer",
                    minimum: 1
                  }
                }
              }
            }
          }
        },
        responses: {
          "204": {},
          "400": {
            $ref: "#/components/responses/ValidationErrors"
          },
          "404": {
            $ref: "#/components/responses/NotFoundOrNotAdmin"
          }
        }
      },
      delete: {
        tags: ["authors"],
        security: [{ JWT: [] }],
        parameters: [
          {
            $ref: "#/components/parameters/id"
          }
        ],
        responses: {
          "204": {},
          "404": {
            $ref: "#/components/responses/NotFoundOrNotAdmin"
          }
        }
      }
    },
    "/tags": {
      post: {
        tags: ["tags"],
        security: [{ JWT: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    minLength: 1
                  }
                },
                required: ["name"]
              }
            }
          }
        },
        responses: {
          "201": {},
          "400": {
            $ref: "#/components/responses/ValidationErrors"
          },
          "404": {
            $ref: "#/components/responses/NotAdmin"
          }
        }
      },
      get: {
        tags: ["tags"],
        parameters: [
          {
            $ref: "#/components/parameters/pageNumber"
          },
          {
            $ref: "#/components/parameters/itemsNumber"
          }
        ],
        responses: {
          "200": {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    tags: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Tag"
                      }
                    },
                    tagsTotalNumber: {
                      type: "integer",
                      minimum: 0
                    },
                    pagesTotalNumber: {
                      type: "integer",
                      minimum: 1
                    }
                  },
                  required: ["tags", "tagsTotalNumber", "pagesTotalNumber"]
                }
              }
            }
          }
        }
      }
    },
    "/tags/{id}": {
      patch: {
        tags: ["tags"],
        security: [{ JWT: [] }],
        parameters: [
          {
            $ref: "#/components/parameters/id"
          }
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    minLength: 1
                  }
                }
              }
            }
          }
        },
        responses: {
          "204": {},
          "400": {
            $ref: "#/components/responses/ValidationErrors"
          },
          "404": {
            $ref: "#/components/responses/NotFoundOrNotAdmin"
          }
        }
      },
      delete: {
        tags: ["tags"],
        security: [{ JWT: [] }],
        parameters: [
          {
            $ref: "#/components/parameters/id"
          }
        ],
        responses: {
          "204": {},
          "404": {
            $ref: "#/components/responses/NotFoundOrNotAdmin"
          }
        }
      }
    },
    "/categories": {
      post: {
        tags: ["categories"],
        security: [{ JWT: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    minLength: 1
                  },
                  parentCategoryId: {
                    type: "integer",
                    minimum: 1
                  }
                },
                required: ["name"]
              }
            }
          }
        },
        responses: {
          "201": {},
          "400": {
            $ref: "#/components/responses/ValidationErrors"
          },
          "404": {
            $ref: "#/components/responses/NotAdmin"
          }
        }
      },
      get: {
        tags: ["categories"],
        parameters: [
          {
            $ref: "#/components/parameters/pageNumber"
          },
          {
            $ref: "#/components/parameters/itemsNumber"
          }
        ],
        responses: {
          "200": {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    categories: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Category"
                      }
                    },
                    categoriesTotalNumber: {
                      type: "integer",
                      minimum: 0
                    },
                    pagesTotalNumber: {
                      type: "integer",
                      minimum: 1
                    }
                  },
                  required: [
                    "categories",
                    "categoriesTotalNumber",
                    "pagesTotalNumber"
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/categories/{id}": {
      patch: {
        tags: ["categories"],
        security: [{ JWT: [] }],
        parameters: [
          {
            $ref: "#/components/parameters/id"
          }
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    minLength: 1
                  },
                  parentCategoryId: {
                    type: "integer",
                    minimum: 1,
                    nullable: true
                  }
                }
              }
            }
          }
        },
        responses: {
          "204": {},
          "400": {
            $ref: "#/components/responses/ValidationErrors"
          },
          "404": {
            $ref: "#/components/responses/NotFoundOrNotAdmin"
          }
        }
      },
      delete: {
        tags: ["categories"],
        security: [{ JWT: [] }],
        parameters: [
          {
            $ref: "#/components/parameters/id"
          }
        ],
        responses: {
          "204": {},
          "404": {
            $ref: "#/components/responses/NotFoundOrNotAdmin"
          }
        }
      }
    },
    "/posts": {
      post: {
        tags: ["posts"],
        security: [{ JWT: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  image: {
                    type: "string",
                    format: "base64"
                  },
                  extraImages: {
                    type: "array",
                    items: {
                      type: "string",
                      format: "base64"
                    },
                    minItems: 1
                  },
                  title: {
                    type: "string",
                    minLength: 1
                  },
                  content: {
                    type: "string",
                    minLength: 1
                  },
                  categoryId: {
                    type: "integer",
                    minimum: 1
                  },
                  tagsIds: {
                    type: "array",
                    items: {
                      type: "integer",
                      minimum: 1
                    },
                    minItems: 1
                  }
                },
                required: [
                  "image",
                  "title",
                  "content",
                  "categoryId",
                  "tagsIds"
                ]
              }
            }
          }
        },
        responses: {
          "201": {},
          "400": {
            $ref: "#/components/responses/ValidationErrors"
          },
          "401": {},
          "403": {
            $ref: "#/components/responses/NotAuthor"
          }
        }
      },
      get: {
        tags: ["posts"],
        parameters: [
          {
            $ref: "#/components/parameters/pageNumber"
          },
          {
            $ref: "#/components/parameters/itemsNumber"
          },
          {
            in: "query",
            name: "titleContains",
            schema: {
              type: "string",
              minLength: 1
            }
          },
          {
            in: "query",
            name: "contentContains",
            schema: {
              type: "string",
              minLength: 1
            }
          },
          {
            in: "query",
            name: "authorFirstName",
            schema: {
              type: "string",
              minLength: 1
            }
          },
          {
            in: "query",
            name: "categoryId",
            schema: {
              type: "integer",
              minimum: 1
            }
          },
          {
            in: "query",
            name: "tagId",
            schema: {
              type: "integer",
              minimum: 1
            }
          },
          {
            in: "query",
            name: "tagIdIn",
            schema: {
              type: "array",
              items: {
                type: "integer",
                minimum: 1
              },
              minItems: 1
            }
          },
          {
            in: "query",
            name: "tagIdAll",
            schema: {
              type: "array",
              items: {
                type: "integer",
                minimum: 1
              },
              minItems: 1
            }
          },
          {
            in: "query",
            name: "createdAt",
            schema: {
              type: "string",
              format: "date",
              minLength: 1
            }
          },
          {
            in: "query",
            name: "createdAtLt",
            schema: {
              type: "string",
              format: "date",
              minLength: 1
            }
          },
          {
            in: "query",
            name: "createdAtGt",
            schema: {
              type: "string",
              format: "date",
              minLength: 1
            }
          },
          {
            in: "query",
            name: "orderBy",
            schema: {
              type: "string",
              enum: [
                "createdAt",
                "-createdAt",
                "authorFirstName",
                "-authorFirstName",
                "category",
                "-category",
                "imagesNumber",
                "-imagesNumber"
              ]
            }
          }
        ],
        responses: {
          "200": {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    posts: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Post"
                      }
                    },
                    postsTotalNumber: {
                      type: "integer",
                      minimum: 0
                    },
                    pagesTotalNumber: {
                      type: "integer",
                      minimum: 1
                    }
                  },
                  required: ["posts", "postsTotalNumber", "pagesTotalNumber"]
                }
              }
            }
          }
        }
      }
    },
    "/posts/{id}": {
      patch: {
        tags: ["posts"],
        security: [{ JWT: [] }],
        parameters: [
          {
            $ref: "#/components/parameters/id"
          }
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  image: {
                    type: "string",
                    format: "base64"
                  },
                  extraImages: {
                    type: "array",
                    items: {
                      type: "string",
                      format: "base64"
                    },
                    minItems: 1
                  },
                  title: {
                    type: "string",
                    minLength: 1
                  },
                  content: {
                    type: "string",
                    minLength: 1
                  },
                  categoryId: {
                    type: "integer",
                    minimum: 1
                  },
                  tagsIds: {
                    type: "array",
                    items: {
                      type: "integer",
                      minimum: 1
                    },
                    minItems: 1
                  }
                }
              }
            }
          }
        },
        responses: {
          "204": {},
          "400": {
            $ref: "#/components/responses/ValidationErrors"
          },
          "404": {
            $ref: "#/components/responses/NotFoundOrNotAdmin"
          }
        }
      },
      delete: {
        tags: ["posts"],
        security: [{ JWT: [] }],
        parameters: [
          {
            $ref: "#/components/parameters/id"
          }
        ],
        responses: {
          "204": {},
          "404": {
            $ref: "#/components/responses/NotFoundOrNotAdmin"
          }
        }
      }
    },
    "/posts/{id}/comments": {
      post: {
        tags: ["comments"],
        security: [{ JWT: [] }],
        parameters: [
          {
            $ref: "#/components/parameters/id"
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  content: {
                    type: "string",
                    minLength: 1
                  }
                },
                required: ["content"]
              }
            }
          }
        },
        responses: {
          "201": {},
          "400": {
            $ref: "#/components/responses/ValidationErrors"
          },
          "401": {},
          "404": {}
        }
      },
      get: {
        tags: ["comments"],
        parameters: [
          {
            $ref: "#/components/parameters/id"
          }
        ],
        responses: {
          "200": {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    comments: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Comment"
                      }
                    },
                    commentsTotalNumber: {
                      type: "integer",
                      minimum: 0
                    },
                    pagesTotalNumber: {
                      type: "integer",
                      minimum: 1
                    }
                  },
                  required: [
                    "comments",
                    "commentsTotalNumber",
                    "pagesTotalNumber"
                  ]
                }
              }
            }
          },
          "404": {}
        }
      },
      delete: {
        tags: ["comments"],
        security: [{ JWT: [] }],
        parameters: [
          {
            in: "path",
            required: true,
            name: "id",
            schema: {
              type: "integer",
              minimum: 1
            }
          }
        ],
        responses: {
          "204": {},
          "404": {
            $ref: "#/components/responses/NotFoundOrNotAdmin"
          }
        }
      }
    },
    "/drafts": {
      post: {
        tags: ["drafts"],
        security: [{ JWT: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  image: {
                    type: "string",
                    format: "base64"
                  },
                  extraImages: {
                    type: "array",
                    items: {
                      type: "string",
                      format: "base64"
                    },
                    minItems: 1
                  },
                  title: {
                    type: "string",
                    minLength: 1
                  },
                  content: {
                    type: "string",
                    minLength: 1
                  },
                  categoryId: {
                    type: "integer",
                    minimum: 1
                  },
                  tagsIds: {
                    type: "array",
                    items: {
                      type: "integer",
                      minimum: 1
                    },
                    minItems: 1
                  }
                },
                required: [
                  "image",
                  "title",
                  "content",
                  "categoryId",
                  "tagsIds"
                ]
              }
            }
          }
        },
        responses: {
          "201": {},
          "400": {
            $ref: "#/components/responses/ValidationErrors"
          },
          "401": {},
          "403": {
            $ref: "#/components/responses/NotAuthor"
          }
        }
      },
      get: {
        tags: ["drafts"],
        security: [{ JWT: [] }],
        description: "Get all author's drafts",
        parameters: [
          {
            $ref: "#/components/parameters/pageNumber"
          },
          {
            $ref: "#/components/parameters/itemsNumber"
          }
        ],
        responses: {
          "200": {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    drafts: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Post"
                      }
                    },
                    draftsTotalNumber: {
                      type: "integer",
                      minimum: 0
                    },
                    pagesTotalNumber: {
                      type: "integer",
                      minimum: 1
                    }
                  },
                  required: [
                    "drafts",
                    "draftsTotalNumber",
                    "pagesTotalNumber"
                  ]
                }
              }
            }
          },
          "401": {},
          "403": {
            $ref: "#/components/responses/NotAuthor"
          }
        }
      }
    },
    "/drafts/{id}": {
      patch: {
        tags: ["drafts"],
        security: [{ JWT: [] }],
        parameters: [
          {
            $ref: "#/components/parameters/id"
          }
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  image: {
                    type: "string",
                    format: "base64"
                  },
                  extraImages: {
                    type: "array",
                    items: {
                      type: "string",
                      format: "base64"
                    },
                    minItems: 1
                  },
                  title: {
                    type: "string",
                    minLength: 1
                  },
                  content: {
                    type: "string",
                    minLength: 1
                  },
                  categoryId: {
                    type: "integer",
                    minimum: 1
                  },
                  tagsIds: {
                    type: "array",
                    items: {
                      type: "integer",
                      minimum: 1
                    },
                    minItems: 1
                  }
                }
              }
            }
          }
        },
        responses: {
          "204": {},
          "401": {},
          "403": {
            $ref: "#/components/responses/NotAuthor"
          },
          "400": {
            $ref: "#/components/responses/ValidationErrors"
          },
          "404": {}
        }
      },
      delete: {
        tags: ["drafts"],
        security: [{ JWT: [] }],
        parameters: [
          {
            $ref: "#/components/parameters/id"
          }
        ],
        responses: {
          "204": {},
          "401": {},
          "403": {
            $ref: "#/components/responses/NotAuthor"
          },
          "404": {}
        }
      }
    },
    "/drafts/{id}/publish": {
      post: {
        tags: ["drafts"],
        security: [{ JWT: [] }],
        parameters: [
          {
            $ref: "#/components/parameters/id"
          }
        ],
        responses: {
          "204": {},
          "401": {},
          "403": {
            $ref: "#/components/responses/NotAuthor"
          },
          "404": {}
        }
      }
    }
  },
  components: {
    securitySchemes: {
      JWT: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      Author: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            minimum: 1
          },
          description: {
            type: "string",
            minLength: 1,
            nullable: true,
            example: null
          },
          userId: {
            type: "integer",
            minimum: 1
          }
        },
        required: ["id", "description", "userId"]
      },
      Tag: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            minimum: 1
          },
          name: {
            type: "string",
            minLength: 1,
            example: "popular"
          }
        },
        required: ["id", "name"]
      },
      Category: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            minimum: 1
          },
          name: {
            type: "string",
            minLength: 1,
            example: "Sports"
          },
          subcategories: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Category"
            },
            minItems: 1,
            uniqueItems: true
          }
        },
        required: ["id", "name"]
      },
      Post: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            minimum: 1
          },
          image: {
            type: "string",
            format: "uri",
            example: "https://localhost:3000/static/images/posts/1/main.jpg"
          },
          extraImages: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "integer",
                  minimum: 1
                },
                image: {
                  type: "string",
                  format: "uri",
                  example: "https://localhost:3000/static/images/posts/1/extra-1.jpg"
                }
              },
              required: ["id", "image"]
            }
          },
          title: {
            type: "string",
            minLength: 1,
            example: "MetaLamp won a very good reward"
          },
          content: {
            type: "string",
            minLength: 1,
            example: "once upon a time..."
          },
          author: {
            $ref: "#/components/schemas/Author"
          },
          category: {
            $ref: "#/components/schemas/Category"
          },
          tags: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Tag"
            },
            minItems: 1,
            uniqueItems: true
          },
          comments: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Comment"
            }
          },
          createdAt: {
            type: "string",
            format: "date-time"
          }
        },
        required: [
          "id",
          "image",
          "extraImages",
          "title",
          "content",
          "author",
          "category",
          "tags",
          "comments",
          "createdAt"
        ]
      },
      Comment: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            minimum: 1
          },
          content: {
            type: "string",
            minLength: 1,
            example: "Comment from oleg"
          }
        },
        required: ["id", "content"]
      }
    },
    parameters: {
      id: {
        in: "path",
        required: true,
        name: "id",
        schema: {
          type: "integer",
          minimum: 1
        }
      },
      pageNumber: {
        in: "query",
        name: "pageNumber",
        schema: {
          type: "integer",
          minimum: 1
        }
      },
      itemsNumber: {
        in: "query",
        name: "itemsNumber",
        schema: {
          type: "integer",
          minimum: 1
        }
      }
    },
    responses: {
      ValidationErrors: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              description: "validation errors",
              minProperties: 1,
              example: {
                field1: "required",
                field2: "must be positive integer"
              }
            }
          }
        }
      },
      JWT: {
        content: {
          "text/plain": {
            schema: {
              description: "JWT for authentication",
              type: "string",
              format: "jwt",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dmNsaXRl.p2ccOCLXgVZMiWp6ff1YJJ5emHNnlyq0uUxbm-hubCM"
            }
          }
        }
      },
      NotFoundOrNotAdmin: {
        description: "Resource not found or user assosiated with provided JWT isn't an admin"
      },
      NotAdmin: {
        description: "User assosiated with provided JWT isn't an admin"
      },
      NotAuthor: {
        description: "User assosiated with provided JWT isn't an author"
      }
    }
  }
};

// src/index.ts
var app = (0, import_express9.default)();
app.listen(3e3);
app.use(import_express9.default.json());
app.use("/api/static", import_express9.default.static("static"));
app.use("/api/auth", router_default);
app.use("/api/users", router_default2);
app.use("/api/authors", router_default3);
app.use("/api/tags", router_default4);
app.use("/api/categories", router_default5);
app.use("/api/posts", router_default7);
app.use("/api/drafts", router_default8);
app.use("/api/swagger", import_swagger_ui_express.default.serve, import_swagger_ui_express.default.setup(api_docs_default));
