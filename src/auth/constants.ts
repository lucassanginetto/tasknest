export const jwtConstants = {
  SECRET: process.env['JWT_SECRET_KEY'],
  EXPIRES_IN: `${Number(process.env['JWT_TOKEN_EXPIRE_MINUTES'])}m` as const
}
