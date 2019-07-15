import { IsString } from 'class-validator';

class AuthDto {
    @IsString()
    public email: string;

    @IsString()
    public password: string;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
}

export default AuthDto;
