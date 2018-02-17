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
      jeremy.setManager(mike),
      mike.setManager(carolyn),
      carolyn.setManager(jeremy)
    ])
  })
  // .then(() => {
  //   return Employee.findOne({ where: {
  //     email: 'carolyn@aol.com'
  //   }})
  // })
  // .then(emp => emp.findManager(emp.managerId))
  // .then(emp => console.log(emp.get()))
}

module.exports = {
  sync,
  seed,
  models: {
    Employee
  }
}
