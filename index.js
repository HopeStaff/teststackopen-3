require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

// express middleware

morgan.token('request-body', (req) => {
    return JSON.stringify(req.body)
})

app.use(cors())



app.use(express.static('build'))
app.use(express.json())
app.use(morgan(function (tokens, req, res) {
  return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      tokens['request-body'](req, res),
  ].join(' ')
}))

/*
let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      }
  ]
  */

  app.get('/info', (req, res) => {
    Person
    .find({})
    .then(persons => {
        res.send(`
            <div>
                Phonebook has info for ${ persons.length } people
            </div>
            <br/>
            <div>
                ${ new Date() }
            </div>`)
    })
    .catch(error => next(error))
  })

  app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
      res.json(persons.map(person => person.toJSON()))
    })
    .catch(error => next(error))
  })

  app.get('/api/persons/:id', (request, response, next) => {
    //Respond with 404 if the person doesn't exist
    Person.findById(request.params.id).then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    //const id = Math.floor(Math.random() * 5000) + 1;

    const body = request.body
    
    //Check if the name and/or number is missing
    if ((!body.name) || (!body.number)) {
        if ((!body.name) && (!body.number)) {
        return response.status(400).json({
            error: 'name and number is missing'
        })
        } else if (!body.name) {
            return response.status(400).json({
                error: 'name is missing'
            })
            } else {
                return response.status(400).json({
                    error: 'number is missing'
                })
            }
    }

    // Check if the name already exist in the phonebook - NEEDS TO BE MODIFIED!
    /*
    if ((persons.find(p => p.name === body.name))) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    */

    const person = new Person({
      name: body.name,
      number: body.number,
    })

    person
      .save()
      .then(savedPerson => savedPerson.toJSON())
      .then(savedAndFormattedPerson => {
        response.json(savedAndFormattedPerson)
      })
      .catch(error => next(error))
  })

  app.put('/api/persons/:id', (req, res, next) => {
    if (!req.body.name || !req.body.number) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const person = {
        name: req.body.name,
        number: req.body.number,
    }

    Person
        .findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true})
        .then(updatedPerson => {
            res.json(updatedPerson.toJSON())
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })


  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)
  
  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    } else if (error.name === 'TypeError'){
      return response.status(400).json({ error: error.message })
    }
  
    next(error)
  }
  
  app.use(errorHandler)

  
  const PORT = process.env.PORT
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})