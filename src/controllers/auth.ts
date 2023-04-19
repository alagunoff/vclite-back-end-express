import { type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import prisma from 'prisma'

async function login (req: Request, res: Response): Promise<void> {
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username
    }
  })

  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      res.send(jwt.sign(String(user.id), process.env.JWT_SECRET_KEY ?? ''))
    } else {
      res.status(400).send('invalid password')
    }
  } else {
    res.status(404).send('There is no user with this username')
  }
}

export { login }
