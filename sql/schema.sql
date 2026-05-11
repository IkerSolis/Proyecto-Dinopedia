CREATE TABLE IF NOT EXISTS dinosaurios (
  id         SERIAL PRIMARY KEY,
  nombre     VARCHAR(100) NOT NULL,
  tamanio    VARCHAR(50),
  peso       VARCHAR(50),
  dieta      VARCHAR(50),
  ubicacion  VARCHAR(100),
  descripcion TEXT,
  imagen_url VARCHAR(255)
);
