const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

// express middleware
morgan.token('request-body', (req) => {
    return JSON.stringify(req.body)
})

app.use(cors())

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


app.use(express.json())
//app.use(morgan('tiny'))
//app.use(morgan('request-body'))

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

  app.get('/info', (req, res) => {
    let numPeople = persons.length
    //console.log(`Phonebook has info for ${numPeople} people`)
    res.send(`<p>Phonebook has info for ${numPeople} people</p>
    <p>${new Date()}</p>`)
  })

  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    //Respond with 404 if the person doesn't exist
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
})

app.post('/api/persons', (request, response) => {
    const id = Math.floor(Math.random() * 5000) + 1;

    //const test = response.json(persons.map(p => p.toJSON()))
    //console.log('test ', test)
    
    const person = request.body
    //console.log('person is ', request)
    //Check if the name and/or number is missing
    if ((!person.name) || (!person.number)) {
        if ((!person.name) && (!person.number)) {
        return response.status(400).json({
            error: 'name and number is missing'
        })
        } else if (!person.name) {
            return response.status(400).json({
                error: 'name is missing'
            })
            } else {
                return response.status(400).json({
                    error: 'number is missing'
                })
            }
    }

    // Check if the name already exist in the phonebook
    if ((persons.find(p => p.name === person.name))) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    person.id = id

    persons = persons.concat(person)
  
    response.json(person)
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  const PORT = process.env.PORT || 3001
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
