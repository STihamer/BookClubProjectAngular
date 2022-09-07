export class UserDTO {
  userId: number = 0;
  orderIdInFrontend: number = 0;
  firstName: string = '';
  lastName: string = '';
  userAge: number = 0;
  username: string = '';
  userEmail: string = '';
  password: string = '';
  roleId: number = new Roles().role_id;

  static fromHttp(user: UserDTO): UserDTO {
    const newUser = new UserDTO();
    newUser.userId = user.userId;
    newUser.firstName = user.firstName;
    newUser.lastName = user.lastName;
    newUser.userAge = user.userAge;
    newUser.username = user.username;
    newUser.userEmail = user.userEmail;
    newUser.password = user.password;
    newUser.roleId = user.roleId;
    return newUser;
  }
}

export class Roles {

  role_id: number = 0;
  role_name: string = ''
}

