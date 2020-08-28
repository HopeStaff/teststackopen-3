const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.lvp5u.mongodb.net/phone-app?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    //important: Boolean,
  })
  
  const Person = mongoose.model('Person', personSchema)

//Reads all the persons from the database
if (process.argv.length === 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
} else { //Saves a person to the database
const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
  //important: true,
})

person.save().then(result => {
  console.log(`added ${person.name} ${person.number} to phonebook`)
  mongoose.connection.close()
})
}