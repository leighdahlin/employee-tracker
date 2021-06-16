-- Drops the company if it exists currently --
DROP DATABASE IF EXISTS company;
-- Creates the "company" database --
CREATE DATABASE company;

-- Makes it so all of the following code will affect company --
USE company;

-- Creates the table "department" within company --
CREATE TABLE department (
  id INTEGER NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)

);

CREATE TABLE role (
  id INTEGER NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INTEGER NOT NULL,
  FOREIGN KEY(department_id) REFERENCES department(id),
  PRIMARY KEY (id)

);

CREATE TABLE employee (
  id INTEGER NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER,
  FOREIGN KEY(role_id) REFERENCES role(id),
  FOREIGN KEY(manager_id) REFERENCES role(id),
  PRIMARY KEY (id)
);