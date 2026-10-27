CREATE DATABASE crud_funcionarios;
USE crud_funcionarios; 
 
CREATE TABLE funcionarios ( 
    id INT AUTO_INCREMENT PRIMARY KEY, 
    nome VARCHAR(100) NOT NULL, 
    funcao VARCHAR(100) NOT NULL, 
    salario DECIMAL(10,2) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
); 
select * from funcionarios;