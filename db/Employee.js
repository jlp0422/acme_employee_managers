/* eslint-disable */

const conn = require('./conn');
const { Sequelize } = conn;

const Employee = conn.define('employee', {
  email: {
    type: Sequelize.STRING
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

Employee.prototype.findManager = function(managerId) {
  return Employee.findOne({
    where: {id: managerId}
  })
}

Employee.belongsTo(Employee, { as: 'manager'})

module.exports = Employee
