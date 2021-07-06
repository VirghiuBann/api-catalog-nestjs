import { IsString, IsNotEmpty, isNotEmpty } from 'class-validator';
export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'required title' })
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
