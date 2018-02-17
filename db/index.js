/* eslint-disable */

const conn = require('./conn');
const Employee = require('./Employee');

const sync = () => {
  return conn.sync({force: true})
}

const seed = () => {
  return Promise.all([
    Employee.create({ email: 'jeremy@gmail.com'}),
    Employee.create({ email: 'mike@hotmail.com' }),
    Employee.create({ email: 'carolyn@aol.com'})
  ])
  .then(([jeremy, mike, carolyn]) => {
    return Promise.all([
      jeremy.setManager(carolyn),
      mike.setManager(carolyn),
      carolyn.setManager(mike)
    ])
  })
  // .then(() => {
  //   Employee.findById(2)
  //     .then(emp => emp.findWorkers())
  //     .then(emps => console.log(emps[0].get()))
  // })
}

module.exports = {
  sync,
  seed,
  models: {
    Employee
  }
}
