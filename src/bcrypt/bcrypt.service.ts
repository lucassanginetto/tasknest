import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt'

@Injectable()
export class BcryptService {
  hash(data: string | Buffer) {
    return bcrypt.hash(data, 10)
  }
  compare(data: string | Buffer, encrypted: string) {
    return bcrypt.compare(data, encrypted)
  }
}
