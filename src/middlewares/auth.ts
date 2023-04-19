import { type Request, type Response, type NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import prisma from 'prisma'

function authenticateUser (responseStatus = 401) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization?.startsWith('JWT ')) {
      const token = req.headers.authorization.slice(4)

      try {
        req.authenticatedUserId = Number(jwt.verify(token, process.env.JWT_SECRET_KEY ?? '') as string)
        next()
      } catch (error) {
        console.log(error)

        res.status(responseStatus).end()
      }
    } else {
      res.status(responseStatus).end()
    }
  }
}

async function isAdmin (req: Request, res: Response, next: NextFunction): Promise<void> {
  const authenticatedUser = await prisma.user.findUnique({
    where: {
      id: req.authenticatedUserId
    }
  })

  if (authenticatedUser?.isAdmin) {
    next()
  } else {
    res.status(404).end()
  }
}

export {
  authenticateUser,
  isAdmin
}
