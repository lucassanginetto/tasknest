import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  status() {
    return {
      currentTime: new Date(),
      applicationStatus: "Running"
    }
  }
}
