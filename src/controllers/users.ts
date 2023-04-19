import { type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import prisma from 'prisma'
import { saveImageToStaticFiles } from 'shared/utils/images'

async function createUser (req: Request, res: Response): Promise<void> {
  try {
    const createdUser = await prisma.user.create({
      data: {
        image: saveImageToStaticFiles(
          req.body.image,
          'users',
          req.body.username
        ),
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password),
        firstName: req.body.firstName,
        lastName: req.body.lastName
      }
    })

    res.status(201).send(jwt.sign(String(createdUser.id), process.env.JWT_SECRET_KEY ?? ''))
  } catch (error) {
    console.log(error)

    res.status(500).end()
  }
}

async function getUser (req: Request, res: Response): Promise<void> {
  // try {
  //   const authenticatedUser = await User.findByPk(req.authenticatedUserId, {
  //     attributes: {
  //       exclude: ['password']
  //     }
  //   })

  //   if (authenticatedUser) {
  //     res.json(authenticatedUser)
  //   } else {
  //     res.status(404).end()
  //   }
  // } catch (error) {
  //   console.log(error)

  //   res.status(500).end()
  // }
}

async function deleteUser (req: Request, res: Response): Promise<void> {
  // try {
  //   const userToDelete = await User.findByPk(req.params.id)

  //   if (userToDelete) {
  //     try {
  //       await userToDelete.destroy()

  //       res.status(204).end()
  //     } catch (error) {
  //       console.log(error)

  //       res.status(500).end()
  //     }
  //   } else {
  //     res.status(404).end()
  //   }
  // } catch (error) {
  //   console.log(error)

  //   res.status(500).end()
  // }
}

export {
  createUser,
  getUser,
  deleteUser
}
