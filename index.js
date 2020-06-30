const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app1 = async () => {
	mongoose.Promise = global.Promise;

	await mongoose
		.connect(process.env.MONGO_URL, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		})
		.then((data) => console.log(`MongoDB connected`))
		.catch((e) => console.log(`Didn't connect due to ${e}`));

	let app = express();
	app.use(bodyparser.json());
	app.use(
		bodyparser.urlencoded({
			extended: true,
		})
	);

	const port = process.env.PORT || 3000;

	const personSchema = new mongoose.Schema({
		name: {
			type: String,
		},
		age: {
			type: Number,
		},
	});

	const Person = mongoose.model("Person", personSchema);

	app.get("/", (req, res) => {
		res.send("Backend Started");
	})

	app.get("/:name/:age", async (req, res) => {
		const { name, age } = req.params;
		const person = new Person({
			name: name,
			age: age,
		});
		await person
			.save()
			.then((data) => {
				console.log(`Data is \n`, data);
				res.send(
					`HI this is / route, Name: ${name} and age: ${age}. Data is: ${data}`
				);
			})
			.catch((err) => {
				console.log(`Error in saving data: ${err}`);
				res.send(
					`HI this is / route, Name: ${name} and age: ${age}. Error is: ${err}`
				);
			});
	});

	app.get("/fetch", async (req, res) => {
		await Person.find({
			age: 23,
		})
			.then((data) => {
				if (data[0].name && data[0].name!== null) {
					console.log(`Fetched data: \n ${data}`);
					res.send(`Fetched data: \n ${data}`);
				}
			})
			.catch((err) => {
				console.log(`Err: \n ${err}`);
				res.status(400).send(`Err: \n ${err}`);
			});
	});

	app.listen(port, console.log(`Started listening on port ${port}`));
};

app1();
