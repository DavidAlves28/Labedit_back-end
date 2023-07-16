-- Active: 1685398220002@@127.0.0.1@3306

-- // TABLE de usuarios

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT CHECK(role IN ('NORMAL', 'ADMIN')) NOT NULL DEFAULT 'NORMAL',
        created_at TEXT DEFAULT(DATETIME('now', 'localtime'))
    );

SELECT * FROM users;

CREATE TABLE
    posts (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT(DATETIME('now', 'localtime')),
        updated_at TEXT NOT NULL DEFAULT(DATETIME('now', 'localtime')),
        likes INTEGER DEFAULT(0) NOT NULL,
        dislikes INTEGER DEFAULT(0) NOT NULL,
        creator_id TEXT NOT NULL,
        counter INTEGER DEFAULT(0) NOT NULL,
        creator_name TEXT NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
    );

SELECT * FROM posts;

INSERT INTO
    posts (
        id,
        content,
        creator_id,
        creator_name,
        counter
    )
VALUES (
        '01',
        'Porque a maioria dos desenvolvedores usam Linux? ou as empresas de tecnologia usam Linux ?',
        '01',
        'Estudante01',
        1200
    ), (
        '02',
        'Qual super poder você gostaria de ter?',
        '02',
        'Estudante02',
        211
    ), (
        '03',
        'Se você pudesser ter qualquer tipo de pet, qual você escolheria?',
        '03',
        'Estudante03',
        412
    ), (
        '04',
        'Se você tivesse que comer apenas uma coisa para o resto de sua vida, o que você escolheria?',
        '04',
        'Estudante04',
        322
    );

SELECT *
FROM users
    INNER JOIN posts ON posts.creator_id = users.id;

CREATE TABLE
    likes_dislikes (
        user_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        like INTEGER DEFAULT(0) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE
    );

INSERT INTO
    likes_dislikes (user_id, post_id)
VALUES ('01', '01'), ('02', '02'), ('03', '03'), ('04', '04');

SELECT * FROM likes_dislikes;

CREATE TABLE
    comment_post(
        id TEXT UNIQUE PRIMARY KEY NOT NULL,
        id_user TEXT NOT NULL,
        id_post TEXT NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER DEFAULT(0) NOT NULL,
        dislikes INTEGER DEFAULT(0) NOT NULL,
        created_at TEXT NOT NULL DEFAULT(DATETIME('now', 'localtime')),
        creator_name TEXT NOT NULL,
        counter INTEGER DEFAULT(0) NOT NULL,
        FOREIGN KEY (id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (id_post) REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE
    );

SELECT * FROM comment_post;

INSERT INTO
    comment_post(
        id,
        id_user,
        id_post,
        content,
        creator_name
    )
VALUES (
        '01',
        '01',
        '01',
        'Não posso falar por todos, mas usar Linux ajudou meu pc a ter uma performance melhor (e evitou que eu precisasse comprar um novo)',
        'Estudante01'
    ), (
        '02',
        '02',
        '01',
        'Não é a maioria, já vi umas enquetes, inclusive nesse sub se não me engano, onde Windows ganhava na qntd de usuários.Linux é rápido, tem várias opções pra diferentes gostos.)',
        'Estudante02'
    ), (
        '03',
        '02',
        '02',
        'Não posso falar por todos, mas usar Linux ajudou meu pc a ter uma performance melhor (e evitou que eu precisasse comprar um novo)',
        'Estudante03'
    ), (
        '04',
        '03',
        '03',
        'Não posso falar por todos, mas usar Linux ajudou meu pc a ter uma performance melhor (e evitou que eu precisasse comprar um novo)',
        'Estudante04'
    );

SELECT *
FROM comment_post
    INNER JOIN posts ON posts.id = comment_post.id_post;

CREATE TABLE
    likes_dislikes_comments (
        id_user TEXT NOT NULL,
        id_comment TEXT NOT NULL,
        like INTEGER DEFAULT(0) NOT NULL,
        FOREIGN KEY (id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (id_comment) REFERENCES comment_post(id) ON UPDATE CASCADE ON DELETE CASCADE ON UPDATE CASCADE ON DELETE CASCADE
    );

SELECT * FROM likes_dislikes_comments ;

INSERT INTO
    likes_dislikes_comments
VALUES ('01', '01', 351), ('02', '01', 132);