import {
  type User,
  type Author,
  type Tag,
  type Category,
  type Post,
  type Comment,
} from "@prisma/client";

const unverifiedUser: User = {
  id: 1,
  image: "http://localhost:3000/api/static/images/users/oleg.webp",
  username: "oleg",
  password: "bb2feed5f90a3d02a7c70df4835f9ff0130a861b7263e9bb2cd12df78e7ed9bc",
  email: "oleg@ol.eg",
  firstName: null,
  lastName: null,
  createdAt: new Date(),
  verified: false,
  isAdmin: false,
};
const verifiedUser: User = {
  id: 1,
  image: "http://localhost:3000/api/static/images/users/oleg.webp",
  username: "oleg",
  password: "bb2feed5f90a3d02a7c70df4835f9ff0130a861b7263e9bb2cd12df78e7ed9bc",
  email: "oleg@ol.eg",
  firstName: null,
  lastName: null,
  createdAt: new Date(),
  verified: true,
  isAdmin: false,
};
const jwt = "j.w.t";
const author: Author = {
  id: 1,
  description: "lala",
  userId: 1,
};
const tag: Tag = {
  id: 1,
  name: "tag",
};
const category: Category = {
  id: 1,
  name: "category",
  parentCategoryId: null,
};
const post: Post = {
  id: 1,
  image: "http://localhost:3000/api/static/images/posts/1paop2ps/main.webp",
  title: "title",
  content: "content",
  authorId: 1,
  categoryId: 1,
  createdAt: new Date(),
  isDraft: false,
};
const comment: Comment = {
  id: 1,
  content: "content",
  postId: 1,
};

export {
  unverifiedUser,
  verifiedUser,
  jwt,
  author,
  tag,
  category,
  post,
  comment,
};
