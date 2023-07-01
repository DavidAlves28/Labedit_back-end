import { UserDataBase } from "../database/UserDataBase";
import { LoginInputDTO, LoginOutputDTO } from "../dtos/user/login.dto";
import { SignupInputDTO, SignupOutputDTO } from "../dtos/user/signup.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFounError";
import { USER_ROLES, User } from "../models/User";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager, TokenPayload } from "../services/TokenManager";

export class UserBusiness {
  constructor(
    private userDatabase: UserDataBase,
    private idgenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager: HashManager
  ) {}

  // criar User
  public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
    // dados recebidos do front-end para criação do user.
    const { name, email, password } = input;

    // id  gerado pelo UUID
    const id = this.idgenerator.generate();
    //gerar hash de password
    const hashPassword = await this.hashManager.hash(password);
   
    // verificar se o email já existe
    const emailExist = await this.userDatabase.findUserByEmail(email);
    if (emailExist) {
      throw new BadRequestError("'email' já está sendo usado");
    }
    // criar  na instância de user (novo user)
    const newUser = new User(
      id,
      name,
      email,
      hashPassword,
      USER_ROLES.NORMAL, // só é possível criar users com contas normais.
      new Date().toISOString() // createdAt.
    );

    // tipagem para criar novo user
    const newUserDB = newUser.toDBModel();

    // inserindo  no UserDataBase novo usuário
    await this.userDatabase.insertUser(newUserDB);

    // criar tokenPayload do user depois de insirido do banco de dados.
    const tokenPayload: TokenPayload = {
      id: newUser.getId(),
      name: newUser.getName(),
      role: newUser.getRole(),
    };
    // criar token do user
    const token = this.tokenManager.createToken(tokenPayload);
    // saida para o front-end com menssagem de sucesso e o seu token.
    // o toker deverá ser persistido em localStore ou cookies para seu uso no endpoint de posts.
    const output: SignupOutputDTO = {
      message: "Cadastro realizado com sucesso",
      token: token,
    };

    return output;
  };

  // criar login de conta existente
  public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
    // dados do front-end
    const { email, password } = input;
    // verificar se o email existe no banco de dados.
    const userDB = await this.userDatabase.findUserByEmail(email);
    // se não existe retornar erro e menssagem.
    if (!userDB) {
      throw new NotFoundError("'email' não encontrado");
    }
    // comparar password com banco de dados.
    const passwordCompare = await this.hashManager.compare(
      password,
      userDB.password
    );

    // se password informado for diferente do Hashpassword do DB, retornar erro.
    if (!passwordCompare) {
      throw new BadRequestError("email' ou 'password' incorretos");
    }
    const user = new User(
      userDB.id,
      userDB.name,
      userDB.email,
      userDB.password,
      userDB.role,
      userDB.created_at
    );

    // criar tokenPayload do user depois de insirido do banco de dados.
    // o toker deverá ser persistido em localStore ou cookies para seu uso no endpoint de posts.
    const tokenPayload: TokenPayload = {
      id: user.getId(),
      name: user.getName(),
      role: user.getRole(),
    };

    // criar token do user logado
    const token = this.tokenManager.createToken(tokenPayload);

    // saida para o front-end com menssagem de sucesso e o seu token.
    const output: LoginOutputDTO = {
      message: "Login realizado com sucesso",
      token: token,
    };

    return output;
  };
}
