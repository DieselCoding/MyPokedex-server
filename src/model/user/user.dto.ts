import {IsString} from "class-validator";

class UserDto {
    @IsString()
    public name: string;

    @IsString()
    public email: string;

    @IsString()
    public password: string;


    constructor(name: string, email: string, password: string) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
}

export default UserDto;
