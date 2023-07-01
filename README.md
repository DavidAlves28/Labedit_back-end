

# Projeto Labeddit Back-end
O Labook é uma rede social com o objetivo de promover a conexão e interação entre pessoas. Quem se cadastrar no aplicativo poderá criar e curtir publicações.

Projeto criado utilizando Typescript e Programação orientada á objetos, dando mais segurança e padronização.A Arquitetura em camadas para facilitar  o desenvolvimento e visão do projeto.Gerenciador de senhas UUID e gerador de hashes (password) para tornar escalável e seguro . Todos os endpoints necessitam de autenticação  e assim autorizadas para utilizar cada endpoint.  Projeto consta com teste em jest com 83.27% de teste feitos.

# Tecnologias Utilizadas.
- NodeJS
- Typescript
- Express
- SQLite
- Knex
- POO
- Jest
- Mock para testes
- Arquitetura em camadas
- Geração de UUID
- Geração de hashes
- Autenticação e autorização
- Roteamento
- Postman

# Banco de dados
![labeddit-diagrama](https://github.com/DavidAlves28/Labedit_back-end/assets/107942209/6fb0363c-38ae-4d3d-8b94-7bf5fd040583)

https://dbdiagram.io/d/6492227702bd1c4a5eccfff1

# Testes 
![teste-coverage](https://github.com/DavidAlves28/Labedit_back-end/assets/107942209/7a1740e0-49ef-4552-8c8e-c83038e0c016)

# Deploy = https://labeddit-backend-pky9.onrender.com
## Documentação Postman 
### https://documenter.getpostman.com/view/24823167/2s93zCXzfM
# Lista de requisitos

- Endpoints
    - [x]  signup
    - [x]  login
    - [x]  getPostsWithCreatorName
    - [x]  creatPost
    - [x]  updatePost
    - [x]  deletePost
    - [x]  like / dislike post
   

- Autenticação e autorização
    - [x]  identificação UUID
    - [x]  senhas hasheadas com Bcrypt
    - [x]  tokens JWT
 
 - Código
    - [x]  POO
    - [x]  Arquitetura em camadas
    - [x]  Roteadores no Express
 - Testes 
    - [x] Mock para testes users
    - [x] Mock para teste posts
    - [x] Mock para services IdGenerate,Hashpassword,TokenManager


# Instalação 
## instalar dependências
```
npm i 
```



## configurar arquivo `.env`
 - criar arquivo .env na pasta raiz do projeto
```typescript

{ 
PORT=3003 // porta servidor padrão 3003
//  caminho para database
DB_FILE_PATH= caminho do arquivo banco de dados
//  senha para payload no  tokenManager
JWT_KEY= suachave
//   tempo de expiração de token 
JWT_EXPIRES_IN=30d

//  número de rodadas. 'cost' . padrão 12
BCRYPT_COST=12

}
```
## Iniciar servidor
```
npm run dev 
```

# Token payload e User roles
O enum de roles  por padrão a criação de usuário está como 'NORMAL'
```typescript

export enum USER_ROLES {
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
}


```

# Exemplos de requisição

## Signup
Endpoint público utilizado para cadastro. Devolve um token jwt.


## Login
Endpoint público utilizado para login. Devolve um token jwt.


## Get posts
Endpoint protegido, requer um token jwt para acessá-lo.


## Create post
Endpoint protegido, requer um token jwt para acessá-lo.


## Edit post
Endpoint protegido, requer um token jwt para acessá-lo.<br>
Só quem criou o post pode editá-lo e somente o conteúdo pode ser editado.


## Delete post
Endpoint protegido, requer um token jwt para acessá-lo.<br>
Só quem criou o post pode deletá-lo. Admins podem deletar o post de qualquer pessoa.

## Like or dislike post (mesmo endpoint faz as duas coisas)

Endpoint protegido, requer um token jwt para acessá-lo.<br>
Quem criou o post não pode dar like ou dislike no mesmo.<br><br>
Caso dê um like em um post que já tenha dado like, o like é desfeito.<br>
Caso dê um dislike em um post que já tenha dado dislike, o dislike é desfeito.<br><br>
Caso dê um like em um post que tenha dado dislike, o like sobrescreve o dislike.<br>
Caso dê um dislike em um post que tenha dado like, o dislike sobrescreve o like.


