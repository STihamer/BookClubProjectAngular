export class User {
  user_id: number = 0;
  first_name: string = '';
  last_name: string = '';
  user_age: number  = 0;
  username: string = '';
  user_email: string = '';
  user_password: string = '';
  role_id: number = new Roles().role_id;

  static fromHttp(user: User): User {
    const newUser = new User();
    newUser.user_id = user.user_id;
    newUser.first_name = user.first_name;
    newUser.last_name = user.last_name;
    newUser.user_age = user.user_age;
    newUser.username = user.username;
    newUser.user_email = user.user_email;
    newUser.user_password = user.user_password;
    newUser.role_id= user.role_id;
    return newUser;
  }
}

export class Roles {

  role_id: number = 0;
  role_name: string = ''
}

