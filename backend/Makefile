NODE := node
NPM := npm
MONGO := mongod
TEST_CMD := npm test

install:
	$(NPM) install

start:
	$(NODE) src/infrastructure/server.js

mongodb-start:
	sudo systemctl start mongod

mongodb-stop:
	sudo systemctl stop mongod

seed-users:
	$(NODE) src/infrastructure/database/seeders/seedUser.js

seed-cards:
	$(NODE) src/infrastructure/database/seeders/seedCard.js

seed-quizzes:
	$(NODE) src/infrastructure/database/seeders/seedQuiz.js

seeds: seed-users seed-cards seed-quizzes

test:
	$(TEST_CMD)

lint:
	$(NPM) run lint

format:
	$(NPM) run format

clean:
	rm -rf node_modules package-lock.json
	$(NPM) install