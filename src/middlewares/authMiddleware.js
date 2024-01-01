const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyToken = (req, res, next) => {
  let authHeader = req.headers.authorization || req.headers.Authorization
  let token = authHeader && authHeader.split(' ')[1]
  if (!token) {
    return res.status(403).json({
      message: 'No token provided!'
    })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: 'Unauthorized!',
        error: err
      })
    }
    req.userId = decoded.id
    // req.userType = decoded.userType
    next()
  })
}

const verifyAdmin = (req, res, next) => {
  let authHeader = req.headers.authorization || req.headers.Authorization
  let token = authHeader && authHeader.split(' ')[1]
  if (!token) {
    return res.status(403).json({
      message: 'No token provided!'
    })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: 'Unauthorized!',
        error: err
      })
    }
    req.adminId = decoded.id
    req.userType = decoded.userType

    if (req.userType !== 'ADMIN')
      return res.status(403).json({ message: 'Unauthorized, not an admin' })
    next()
  })
}

// };

// middle ware to verify user roles
// const verifyRoles = (...allowedRoles) => {
//   return (req, res, next) => {
//     if (!req?.roles)
//       return res.status(401).json({
//         message: 'Unauthorized'
//       })
//     const rolesArray = [...allowedRoles]

//     const result = req.roles
//       .map(role => rolesArray.includes(role))
//       .find(val => val === true)
//     if (!result) return res.status(401).json({ message: 'Unauthorized' })
//     next()
//   }
// }

// const jwtVerify = token => {
//   const decoded = jwt.verify(token, config.secret, (err, decoded) => {
//     if (err) {
//       return err
//     }
//     return decoded
//   })

//   if (decoded instanceof Error) {
//     return decoded
//   }
//   return decoded
// }

// const verifyAdmin = (...allowedRoles) => {
//   return async (req, res, next) => {
//     let authHeader = req.headers.authorization || req.headers.Authorization
//     let token = authHeader && authHeader.split(' ')[1]

//     if (!token) {
//       return res.status(401).json({
//         message: 'No token provided!'
//       })
//     }

//     const decoded = jwtVerify(token)
//     req.adminId = decoded.id
//     req.userType = decoded.userType
//     // req.permissions = decoded.permissions

//     // if (!req?.permissions)
//     //   return res.status(401).json({
//     //     message: 'Unauthorized'
//     //   })

//     // const rolesArray = [...allowedRoles]

//     // const result = rolesArray.every(role => {
//     //   return req.permissions.includes(role)
//     // })

//         if (req.userType !== 'ADMIN') return res.status(403).json({ message: 'Unauthorized' })
//     // if (!result) return res.status(403).json({ message: 'Unauthorized' })
//     next()
//   }
// }

const authMiddleware = {
  verifyToken,
  verifyAdmin
}

module.exports = authMiddleware
