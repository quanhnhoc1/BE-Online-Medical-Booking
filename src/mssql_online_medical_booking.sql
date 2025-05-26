
CREATE DATABASE MSSQL_ONLINE_MEDICAL_BOOKING;

USE MSSQL_ONLINE_MEDICAL_BOOKING;

GO


DROP TABLE USERS;-- Tạo bảng users trước vì bảng users_authorization phụ thuộc vào nó

CREATE TABLE users (
	id int unique ,
    user_name nvarchar(200) PRIMARY KEY,
    password nvarchar(200)
);

drop table users_authorization;
-- Tạo bảng users_authorization với khóa ngoại có CASCADE
CREATE TABLE users_authorization (
    id int IDENTITY PRIMARY KEY,
    user_name nvarchar(200),
    role int,
    FOREIGN KEY (user_name) REFERENCES users(user_name)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);




-- Thêm dữ liệu vào bảng users
INSERT INTO users (id, user_name, password) VALUES (1, 'alice', 'pass123');
INSERT INTO users (id, user_name, password) VALUES (2, 'bob', 'secret456');
INSERT INTO users (id, user_name, password) VALUES (3, 'charlie', 'hello789');
INSERT INTO users (id, user_name, password) VALUES (4, 'david', 'admin123');
INSERT INTO users (id, user_name, password) VALUES (5, 'eva', 'mypassword');

-- Thêm dữ liệu vào bảng users_authorization
INSERT INTO users_authorization (user_name, role) VALUES ('alice', 1);
INSERT INTO users_authorization (user_name, role) VALUES ('bob', 2);
INSERT INTO users_authorization (user_name, role) VALUES ('charlie', 2);
INSERT INTO users_authorization (user_name, role) VALUES ('david', 3);
INSERT INTO users_authorization (user_name, role) VALUES ('eva', 1);
