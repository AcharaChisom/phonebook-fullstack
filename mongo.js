const mongoose = require('mongoose')

if(process.argv.length === 3 || process.argv.length === 5) {
    const password = process.argv[2]
    const url = `mongodb+srv://achara-chisom:${password}@cluster0.ue8fl2o.mongodb.net/phoneApp?retryWrites=true&w=majority`

    mongoose.set('strictQuery', false)
    mongoose.connect(url)

    const personSchema = new mongoose.Schema({
        name: String,
        number: String,
    })

    const Person = mongoose.model('Person', personSchema)

    if(process.argv.length === 5) {
        const name = process.argv[3]
        const number = process.argv[4]

        const person = new Person({
            name: name,
            number: number,
        })

        person.save().then(result => {
            console.log(`added ${result.name} number ${result.number} to phonebook`);
            mongoose.connection.close()
        })
    } else {
        Person.find({}).then(result => {
            console.log('phonebook:');
            result.forEach(person => {
                console.log(`${person.name} ${person.number}`);
            })
            mongoose.connection.close()
        })
    }
} else {
    console.log('Enter password with or without name and number');
    process.exit(1)
}
