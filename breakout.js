const mongoose = require('mongoose');
var bodyParser = require('body-parser')
const express = require('express')
const app = express()


// get, post, put/patch, delete


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))


const { Schema } = mongoose;
const port = 3000

mongoose.Promise = global.Promise;// Ensures that we can use promises with mongoose

mongoose
// Add connection string for db used in breakout
    .connect('', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(data => {

        console.log('MongoDB connected')

        const userSchema = new Schema({
            username: String,
            password: String
        })

        const UserEmail = mongoose.model('UserEmail', userSchema);

        app.get('/', async (req, res) => {
            let data = await UserEmail.find();
            res.json(data)
        });

        app.post('/', async (req, res) => {
            // req body, req params, req query
            let { username, password } = req.body;
            let newUser = new UserEmail({ username, password });
            let data = await newUser.save();
            res.json(data)
        });

        app.patch('/:username', async (req, res) => {
            try {
                let { password } = req.body;
                let { username } = req.params;
                if (!password) {
                    throw new Error('Password not provided')
                };

                if (password) {
                    // Update db entry
                    let data = await UserEmail.updateOne({
                        username
                    }, {
                        password
                    })
                    res.json(data)
                }
            } catch (error) {
                res.json(error)
            }
        });

        app.delete('/:username', async (req, res) => {

            let { username } = req.params;
            let data = await UserEmail.deleteOne({
                username
            })
            res.json(data)
        });

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })




        // Schema => Model => Document -> store in database
    })
    .catch(err => console.log(err))