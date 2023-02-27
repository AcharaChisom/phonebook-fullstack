const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

const requestLogger = (request, response, next) => {
    console.log(request.body)
    next()
}

app.use(requestLogger)

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(
        `<div>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${new Date()}</p>
        </div>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.number && !body.name) {
        return response.json({
            error: 'name and number missing'
        })
    } else if(!body.number) {
        return response.json({
            error: 'name seen but number missing'
        })
    } else if(!body.name) {
        return response.json({
            error: 'number seen but name missing'
        })
    }

    const isAlreadyInPersons = persons.map(p => p.name.toLowerCase()).includes(body.name.toLowerCase())
    if(isAlreadyInPersons) {
        return response.json({
            error: 'name must be unique!'
        })
    }

    const person = {
        id: Math.floor(Math.random() * 1000000) + 1,
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)

    response.json(person)
})


const PORT = 3003
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})