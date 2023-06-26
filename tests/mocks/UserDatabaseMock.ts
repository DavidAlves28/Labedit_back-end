import { USER_ROLES, UserDB } from "../../src/models/User"
import {BaseDataBase} from '../../src/database/BaseDataBase'
 
const usersMock: UserDB[] = [
  {
    id: "id-mock-normal",
    name: "Normal-User",
    email: "normal@email.com",
    password: "hash-mock-normal", // senha = "fulano123"
    created_at: new Date().toISOString(),
    role: USER_ROLES.NORMAL
  },
  {
    id: "id-mock-admin",
    name: "Admin-User",
    email: "admin@email.com",
    password: "hash-mock-admin", // senha = "astrodev99"
    created_at: new Date().toISOString(),
    role: USER_ROLES.ADMIN
  },
]

export class UserDatabaseMock extends BaseDataBase {
  public static TABLE_USERS = "users"

  public async findUser(
    q: string | undefined
  ): Promise<UserDB[]> {
    if (q) {
      return usersMock.filter(user =>
          user.name.toLocaleLowerCase()
            .includes(q.toLocaleLowerCase()))

    } else {
      return usersMock
    }
  }

  public async findUserById(
    id: string
  ): Promise<UserDB | undefined> {
    return usersMock.filter(user => user.id === id)[0]
  }

  public async findUserByEmail(
    email: string
  ): Promise<UserDB | undefined> {
    return usersMock.filter(user => user.email === email)[0]
  }

  public async insertUser(
    newUserDB: UserDB
  ): Promise<void> {

  }
}