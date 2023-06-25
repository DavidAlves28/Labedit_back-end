import { UserDB } from "../models/User";
import { BaseDataBase } from "./BaseDataBase";

export class UserDataBase extends BaseDataBase {
  public static TABLE_USERS = "users";
  public async findUser(q: string | undefined): Promise<UserDB[]> {
    let userDB;
    // retorna user especifico.
    if (q) {
      const result: UserDB[] = await BaseDataBase.connection(
        UserDataBase.TABLE_USERS
      )
        .select("name")
        .where("name", "LIKE", `%${q}%`);
      userDB = result;
    } else {
      // retornar todos os users na DB
      const result: UserDB[] = await BaseDataBase.connection(
        UserDataBase.TABLE_USERS
      );

      userDB = result;
    }
    return userDB;
  }

  // retornar o user por id.
  // pode ser usado para verificação.
  public async findUserById(id: string): Promise<UserDB | undefined> {
    const [userDB]: UserDB[] | undefined[] = await BaseDataBase.connection(
      UserDataBase.TABLE_USERS
    ).where({ id });

    return userDB;
  }

  // retorna email
  // pode ser usado para verificação.
  public async findUserByEmail(email: string): Promise<UserDB | undefined> {
    const [userDB]: UserDB[] | undefined[] = await BaseDataBase.connection(
      UserDataBase.TABLE_USERS
    ).where({ email });

    return userDB;
  }

  // criar user
  public async insertUser(newUserDB: UserDB): Promise<void> {
    await BaseDataBase.connection(UserDataBase.TABLE_USERS).insert(newUserDB);
  }
}
