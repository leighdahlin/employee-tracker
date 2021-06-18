INSERT INTO department (name)
VALUES ("General Administration");

INSERT INTO department (name)
VALUES ("Sales");

INSERT INTO department (name)
VALUES ("Warehouse");

INSERT INTO department (name)
VALUES ("Human Resources");

INSERT INTO department (name)
VALUES ("Quality Control");

INSERT INTO department (name)
VALUES ("Accounting");

INSERT INTO department (name)
VALUES ("Management");


INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 40000, 7);

INSERT INTO role (title, salary, department_id)
VALUES ("Assistant to the Manager", 30000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Representative", 35000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Receptionist", 20000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 36000, 6);

INSERT INTO role (title, salary, department_id)
VALUES ("Quality Control", 25000, 5);

INSERT INTO role (title, salary, department_id)
VALUES ("Customer Service Representative", 32000, 4);

INSERT INTO role (title, salary, department_id)
VALUES ("Human Resources Representative", 28000, 4);

INSERT INTO role (title, salary, department_id)
VALUES ("Warehouse Manager", 38000, 7);

INSERT INTO role (title, salary, department_id)
VALUES ("Warehouse Staff", 18000, 3);


INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Michael","Scott",1,1);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Dwight","Schrute",2,1);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Jim","Halpert",3,1);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Phyllis","Vance",3,1);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Stanley","Hudson",3,1);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Darryl","Philbin",9,2);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Pam","Beasley",4,1);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Angela","Martin",5,1);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Creed","Bratton",6,1);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Oscar","Martinez",5,1);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Kevin","Malone",5,1);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Kelly","Kapoor",7,1);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Toby","Flenderson",8,1);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Roy","Anderson",10,2);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Val","Johnson",10,2);

