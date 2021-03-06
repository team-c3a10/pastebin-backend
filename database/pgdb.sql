DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS pastes;
CREATE TABLE users(
	id SERIAL PRIMARY KEY,
  	username VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE pastes(
  user_id INT NOT NULL,
  paste_id SERIAL PRIMARY KEY,
  title VARCHAR(50),
  paste_body TEXT NOT NULL,
  date TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
