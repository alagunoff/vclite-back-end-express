import { type Request, type Response } from "express";

import prisma from "prisma";
import {
  saveImageToStaticFiles,
  deleteImageFolderFromStaticFiles,
} from "shared/utils/images";
import {
  createPaginationParameters,
  calculatePagesTotalNumber,
} from "shared/utils/pagination";
import { transformStringToLowercasedKebabString } from "shared/utils/strings";
import { includeSubcategories } from "shared/utils/categories";

async function createPost(req: Request, res: Response): Promise<void> {
  try {
    await prisma.post.create({
      data: {
        image: saveImageToStaticFiles(
          req.body.image,
          `posts/${transformStringToLowercasedKebabString(req.body.title)}`,
          "main"
        ),
        title: req.body.title,
        content: req.body.content,
        authorId: req.body.authorId,
        categoryId: req.body.categoryId,
        tags: {
          connect: req.body.tagsIds.map((tagId: number) => ({
            id: tagId,
          })),
        },
        extraImages: {
          createMany: {
            data: req.body.extraImages.map(
              (extraImage: string, index: number) => ({
                image: saveImageToStaticFiles(
                  extraImage,
                  `posts/${transformStringToLowercasedKebabString(
                    req.body.title
                  )}`,
                  `extra-${index}`
                ),
              })
            ),
          },
        },
      },
    });

    res.status(201).end();
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
}

async function getPosts(req: Request, res: Response): Promise<void> {
  try {
    const { skip, take } = createPaginationParameters(
      req.query.pageNumber,
      req.query.itemsNumber
    );
    const posts = await prisma.post.findMany({
      where: {
        isDraft: false,
      },
      skip,
      take,
      select: {
        id: true,
        image: true,
        title: true,
        content: true,
        author: {
          select: {
            id: true,
            description: true,
          },
        },
        category: {
          select: {
            id: true,
            category: true,
          },
        },
        tags: {
          select: {
            id: true,
            tag: true,
          },
        },
        comments: {
          select: {
            id: true,
            comment: true,
          },
        },
        extraImages: {
          select: {
            id: true,
            image: true,
          },
        },
        createdAt: true,
      },
    });
    for (const post of posts) {
      await includeSubcategories(post.category);
    }

    const postsTotalNumber = await prisma.post.count({
      where: {
        isDraft: false,
      },
    });

    res.json({
      posts,
      postsTotalNumber,
      pagesTotalNumber: calculatePagesTotalNumber(
        postsTotalNumber,
        posts.length
      ),
    });
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
}

async function updatePost(req: Request, res: Response): Promise<void> {
  // try {
  //   const postToUpdate = await Post.findByPk(req.params.id);
  //   if (postToUpdate) {
  //     try {
  //       await postToUpdate.update({
  //         title: req.body.title,
  //         content: req.body.content,
  //         authorId: req.body.authorId,
  //         categoryId: req.body.categoryId,
  //         image: req.body.image,
  //       });
  //       if (req.body.tagsIds) {
  //         await postToUpdate.setTags(req.body.tagsIds);
  //       }
  //       res.status(204).end();
  //     } catch (error) {
  //       console.log(error);
  //       if (error instanceof sequelize.ValidationError) {
  //         res.status(400).json(createErrorsObject(error));
  //       } else {
  //         res.status(500).end();
  //       }
  //     }
  //   } else {
  //     res.status(404).end();
  //   }
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).end();
  // }
}

async function deletePost(req: Request, res: Response): Promise<void> {
  try {
    const deletedPost = await prisma.post.delete({
      where: {
        id_isDraft: {
          id: Number(req.params.id),
          isDraft: false,
        },
      },
    });

    res.status(204).end();
    deleteImageFolderFromStaticFiles(deletedPost.image);
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
}

export { createPost, getPosts, updatePost, deletePost };
