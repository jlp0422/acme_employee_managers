/* eslint-disable */

const conn = require('./conn');
const { Sequelize } = conn;

const Employee = conn.define('employee', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
}, {
  getterMethods: {
    name: function() {
      return this.email.split('@')[0]
    },
    emailProvider: function() {
      return this.email.split('@')[1]
    },
  }
})

// DO NOT NEED
// Employee.prototype.findManager = function(managerId) {
//   return Employee.findOne({
//     where: {id: managerId}
//   })
// }

Employee.prototype.findWorkers = function() {
  return Employee.findAll({
    where: {managerId: this.id}
  })
}

Employee.createFromForm = function(body) {
  if (body.managerId === '-1') delete body.managerId;
  return this.create(body)
}

Employee.belongsTo(Employee, { as: 'manager'})

module.exports = Employee
