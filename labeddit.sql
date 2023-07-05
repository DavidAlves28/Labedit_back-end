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

-- DELETE FROM users  WHERE id='ec33e4c0-6b60-4182-a156-3dee356b55da' ;

CREATE TABLE
    posts (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT(DATETIME('now', 'localtime')),
        updated_at TEXT NOT NULL DEFAULT(DATETIME('now', 'localtime')),
        likes INTEGER DEFAULT(0) NOT NULL,
        dislikes INTEGER DEFAULT(0) NOT NULL,
        creator_id TEXT NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
    );

SELECT * FROM posts;

CREATE TABLE
    likes_dislikes (
        user_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        like INTEGER DEFAULT(0) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE ON UPDATE CASCADE ON DELETE CASCADE
    );

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
        FOREIGN KEY (id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (id_post) REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE ON UPDATE CASCADE ON DELETE CASCADE
    );

SELECT * FROM comment_post;

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

SELECT * FROM likes_dislikes_comments 