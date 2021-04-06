const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Schema } = mongoose;
// const Schema = mongoose.Schema;

const app = express();

mongoose.Promise = global.Promise;

mongoose
.connect('mongodb+srv://Niskarsh:Nik.31@cluster0.8xaqp.mongodb.net/Person?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
.then(data => {
	console.log('MongoDB connected')

	const personSchema = new Schema({
		name: String,
		age: Number
	})

	const Person = mongoose.model('Person', personSchema);


	// parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: false }))
	 
	// parse application/json
	app.use(bodyParser.json())
	
	app.get('/', function (req, res) {
	  res.send('Hello World, This was a get request');
	})

	app.get('/fetchAll', function (req, res) {
		// const { age } = req.params;
		Person.find()
		.then(data => res.send(data))
		.catch(err => res.send(err));
	  	
	})

	app.get('/fetch/:age', function (req, res) {
		const { age } = req.params;
		Person.find({
			age
		})
		.then(data => res.send(data))
		.catch(err => res.send(err));
	  	
	})

// mongoose => Schema => Model => Document => Save in mongodb

	app.post('/user/:name/:age', function (req, res) {
		const { name, age } = req.params;
		var person1 = new Person({
			name,
			age
		}) // Creating a document

		person1
		.save()
		.then(data => res.send(data))
		.catch(err => res.send(err))	  	
	})
	
	app.post('/', function (req, res) {
		res.send('THis was a post request')
	})
	 
	let port = process.env.PORT || 3000;

	app.listen(port, function() {
		console.log(`Server up and running on port ${port}`);
	});

})
.catch(err => console.log('Connection Error', err));


// GET, POST, PATCH/PUT, DELETE