import { IsEmail, IsNotEmpty, IsNumber, IsString, Matches, MinLength } from "class-validator";

export class RegisterDto {
    @IsString()
    
    name: string;
    @IsNotEmpty()
    @Matches(/^[0-9]+$/, { message: 'Phone number must contain only digits' })
  phone: string;
  @IsEmail()
  email: string;
  @MinLength(6)
  password: string;
  @IsNumber()
  status: number;
}

export class LoginDto{
    @IsEmail()
    email: string;
    @MinLength(6)
    password: string;
     
}