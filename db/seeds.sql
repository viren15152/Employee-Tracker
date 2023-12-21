INSERT INTO department (name) VALUES
  ('SALES'),
  ('ENGINEERING'),
  ('FINANCE'),
  ('HR');

INSERT INTO role (title, salary, department_id) VALUES
  ('Sales Associate', 55000.00, 1),
  ('Software Engineer', 90000.00, 2),
  ('Financial Analyst', 70000.00 3),
  ('HR Manager', 75000.00 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('Clark', 'Kent', 1, NULL),
  ('Barry', 'Allen', 2, 1),
  ('Bruce', 'Wayne', 3, 1),
  ('Arthur', 'Curry' 4, NULL);

  