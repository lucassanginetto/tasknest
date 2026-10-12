import { IsEnum, IsNotEmpty } from "class-validator";
import { Status } from "../../prisma/generated/enums";

export class CreateTaskDto {
  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  description: string

  @IsEnum(Status)
  status: Status
}
