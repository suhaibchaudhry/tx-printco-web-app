/**
* Order.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    email: {
      type: 'string',
      email: 'true'
    },
    username: {
      type: 'string'
    },
    firstName: {
      type: 'string'
    },
    middleName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    streetNameLine1: {
      type: 'string',
    },
    streetNameLine2: {
      type: 'string',
    },
    city: {
      type: 'string',
    },
    state: {
      type: 'string',
    },
    zip: {
      type: 'string',
    },
    ccNum: {
      type: 'string',
    },
    expMonth: {
      type: 'string',
    },
    expYear: {
      type: 'string',
    },
    ccCvv: {
      type: 'string',
    }
  }
};
