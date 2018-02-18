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
  res.locals.path = req.url
  // add total managers and employees
  let managerCount;
  Employee.findAll()
    .then(employees => {
      res.locals.employeeCount = employees.length;
      // next()
    })
    .then(() => {
      Employee.count({
        include: ['manager'],
        distinct: true,
        col: 'managerId'
      })
      .then(result => {
        res.locals.managerCount = result
        next()
      })
    })
    .catch(next)
})

// works 100%
app.get('/', (req, res, next) => {
  res.render('index', { title: 'Home'})
})

// works 100%
app.get('/employees', (req, res, next) => {
  Employee.findAll({
    include: [ 'manager' ]
  })
  // .then(employees => res.send(employees))
  .then((employees) => res.render('employees', { employees, title: 'Employees'}))
  .catch(next)
})

// app.get('/employees', (req, res, next) => {
//   Promise.all([
//     Employee.findAll({
//       include: [ 'manager' ]
//     }),
//     Employee.findAndCountAll({
//       include: [ 'manager' ],
//       distinct: true,
//       col: 'managerId',
//     })
//   ])
//     // .then(([employees, managers]) => res.send({employees, managers}))
//   .then(([employees, managers]) => res.render('employees', {employees, managers, title: 'Employees'}))
//   .catch(next)
// })

// works 100%
app.post('/employees', (req, res, next) => {
  Employee.createFromForm(req.body)
    .then(() => res.redirect('/employees'))
    .catch(next)
})

// works 100%
app.put('/employees/:id', (req, res, next) => {
  Employee.findById(req.params.id)
  .then(employee => {
    Object.assign(employee, req.body)
    if (req.body.managerId === '-1') {
      employee.managerId = null
    }
    return employee.save()
  })
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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on da port ${port}`))

db.sync()
  .then(() => db.seed())

