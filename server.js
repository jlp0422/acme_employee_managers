/* eslint-disable */

const express = require('express');
const app = express();
const path = require('path');
const db = require('./db')
const { Employee } = db.models;
const nunjucks = require('nunjucks');
nunjucks.configure({ noCache: true });

app.set('view engine', 'html');
app.engine('html', nunjucks.render);

app.use(require('body-parser').urlencoded());
app.use(require('method-override')('_method'));
app.use('/vendor', express.static(path.join(__dirname, 'node_modules')))

app.use((req, res, next) => {
  res.locals.path = req.url;
  // add total managers and employees
  next()
})

app.get('/', (req, res, next) => {
  res.render('index', { title: 'Home'})
})

// works, just need to be able to pass manager email
app.get('/employees', (req, res, next) => {
  Employee.findAll()
    // .then(employees => res.send(employees))
    .then(employees => res.render('employees', { employees, title: 'Employees'}))
    .catch(next)
})

// works 100%
app.post('/employees', (req, res, next) => {
  Employee.create(req.body)
    .then(() => res.redirect('/employees'))
    .catch(next)
})

// works 100%
app.delete('/employees/:id', (req, res, next) => {
  Employee.findById(req.params.id)
    .then(employee => employee.destroy())
    .then(() => res.redirect('/employees'))
    .catch(next)
})

// does not work 100%
app.post('/employees/:id', (req, res, next) => {
  const params = req.params.id
  const body = req.body
  // console.log('params', params)
  // console.log('body', req.body)
  Employee.findById(body.managerId)
  // console.log(req.body)
    .then(employee => {
      console.log(employee.get())
      employee.managerId = params
      console.log(employee.get())
      return employee.save()
    })
    .then(() => res.redirect('/employees'))
    .catch(next)
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on da port ${port}`))

db.sync()
  .then(() => db.seed())

