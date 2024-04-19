const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
]
app.get('/', (req, res) => {
    res.send('Hello World!!!');
})
/* Remember these are the http methods
app.get()
app.post()
app.put()
app.delete() */

app.get('/api/courses', (req, res) => {
    res.send(courses)
});


// /api/courses/1
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found')
    res.send(course);

});

//Error Handling with Joi
app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    /*  Use object destructuring instead
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    const result = schema.validate(req.body);
    console.log(result);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    */

/*    Direct Error Handling 
      if (!req.body.name || req.body.name.length <= 3) {
        //400 Bad Request
        res.status(400).send('Name is required and should have a minimum of 4 characters.');
        return;
    } */
        const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res)=> {
    //Look up the course
    //If not existing, return 404

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found')
    //Adding return to the above statement encloses the if loop to immediately exit out  
    
    //Validate
    //If invalid, return 400 - Bad request
/*     const schema = Joi.object({
        name: Joi.string().min(3).required()

    });

    const result = schema.validate(req.body); */
    // const result = validateCourse(req.body);
    const { error } = validateCourse(req.body); //result.error
    if (error) return res.status(400).send(error.details[0].message);
/*     if (error) {
        res.status(400).send(error.details[0].message);
        return;
    } */
    //Update course
    course.name = req.body.name;
    //Return the updated course
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    //Look up the course
    //Not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found')
    //Delete
    const index = courses.indexOf(course);
    courses.splice(index,1);
    //Return the same course
    res.send(course)
})

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(course);
}
/*
app.get('/api/posts/:year/:month', (req, res) => {
    res.send(req.query);
    //res.send(req.params); this was used to get month and year from address
})
*/
// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on Port ${port}...`));


/*
set PORT=5000
See result -->
echo %PORT%
nodemon index.js
 */