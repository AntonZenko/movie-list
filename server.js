const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const cors = require("cors");
const schema = require("./schema");
const { customAlphabet } = require("nanoid");
require("dotenv").config();

const newId = customAlphabet("1234567890", 4);

const users = [
	{
		id: newId(),
		userName: "John",
		age: 36,
	},
];

const createUser = (userData) => {
	const id = newId();
	return { id, ...userData };
};

const app = express();

const root = {
	getAllUsers: () => {
		return users;
	},
	getUser: ({ id }) => {
		return users.find(
			(user) => user.id === id || `User with id : ${id} is not defined`
		);
	},
	createUser: ({ input }) => {
		const newUser = createUser(input);
		users.push(newUser);
		return newUser;
	},
};

app.use(cors());

app.use(
	"/graphql",
	graphqlHTTP({
		schema: schema,
		rootValue: root,
		graphiql: true,
	})
);

const { PORT } = process.env;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
