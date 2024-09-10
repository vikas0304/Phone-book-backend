const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors')

app.use(cors())
app.use(express.json());


app.use(morgan('tiny'));

app.use(express.static('dist'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    { 
        "id": "5",
        "name": "Vikas Pal", 
        "number": "9594781303"
    }
]

app.get("/" , (req , res) => {
    res.send('<h1>VIKAS PAL</h1>')
})

app.get("/api/persons", (req, res) => {
    res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    const person = persons.find(p => p.id === id);
    person ? res.send(person) : res.status(404).send({ message: "Person not found" });    
});

app.get("/info", (req, res) => {
    const date = new Date();
    
    // Array of weekday abbreviations
    const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const weekday = weekdays[date.getDay()]; // Get the current day (0 = Sunday, 1 = Monday, etc.)

    // Manually format the date to DD-MM-YY format
    const day = String(date.getDate()).padStart(2, '0'); // Day with leading zero
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month with leading zero
    const year = String(date.getFullYear()).slice(-2); // Last 2 digits of the year
    const hours = String(date.getHours() % 12 || 12).padStart(2, '0'); // Convert 24-hour to 12-hour format
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Minutes with leading zero
    const am_pm = date.getHours() >= 12 ? 'PM' : 'AM'; // Determine AM/PM
    
    // Construct the full formatted string
    const formattedDate = `${weekday} ${day}-${month}-${year} ${hours}:${minutes} ${am_pm} IST`;

    res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <br />
        <p>${formattedDate}</p>
    `);
});

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const initialLength = persons.length;
    persons = persons.filter(person => person.id !== id);

    if (persons.length === initialLength) {
        return response.status(404).send({ message: "Person not found" });
    }

    response.status(204).send({ message: "Person deleted successfully" }).end();
});

app.post('/api/persons', (req, res) => {
    const body = req.body
    const generateId = () => {
        const maxId = persons.length > 0
          ? Math.max(...persons.map(n => Number(n.id)))
          : 0
        return String(maxId + 1)
    }



      if (!body.name || !body.number) {
        return res.status(400).json({ 
          error: !body.name ? 'name missing' : 'number missing'
        })
      }

      const nameExists = persons.some(person => person.name.toLowerCase() === body.name.toLowerCase());
      if (nameExists) {
          return res.status(400).json({
              error: 'name must be unique'
          });
      }

    const person = {
        id: generateId(),
        name: body.name,
        number : body.number,
      }
    
    persons = persons.concat(person)
    
    res.json(person)
    console.log(person);
    
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)


const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
})