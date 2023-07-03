import { type User } from "@prisma/client";

const user: User = {
  id: 1,
  image: "http://localhost:3000/api/static/images/users/oleg.webp",
  username: "oleg",
  password: "oleg",
  email: "oleg@ol.eg",
  firstName: null,
  lastName: null,
  createdAt: new Date(),
  verified: false,
  isAdmin: false,
};

export { user };
