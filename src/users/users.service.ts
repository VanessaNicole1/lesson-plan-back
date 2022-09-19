import { HttpException, Inject, Injectable } from '@nestjs/common';
import { StudentsService } from 'src/students/students.service';
import { UserDto } from './user.dto';
import { compare } from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @Inject(StudentsService)
    private studentService: StudentsService,
  ) {}

  async login(userLoginDto: UserDto) {
    const { email, password } = userLoginDto;
    const findUser = await this.studentService.getStudentByEmail(email);
    if (!findUser) throw new HttpException('USER_NOT_FOUND', 404);
    const checkPassword = await compare(password, findUser.password);
    if (!checkPassword) throw new HttpException('PASSWORD_INCORRECT', 403);
    return findUser;
  }
}
