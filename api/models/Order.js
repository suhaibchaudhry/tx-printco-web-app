/**
* Order.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema: true,
  attributes: {
    email: {
      type: 'string',
      email: true,
      required: true
    },
    username: {
      type: 'string'
    },
    firstName: {
      type: 'string',
      required: true
    },
    middleName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
      required: true
    },
    streetNameLine1: {
      type: 'string',
      required: true
    },
    streetNameLine2: {
      type: 'string'
    },
    city: {
      type: 'string',
      required: true
    },
    state: {
      type: 'string',
      required: true
    },
    zip: {
      type: 'string',
      required: true
    },
    ccNum: {
      type: 'string',
      required: true,
      creditcard: true
    },
    expMonth: {
      type: 'string',
      required: true
    },
    expYear: {
      type: 'string',
      required: true
    },
    ccCvv: {
      type: 'string',
      required: true
    },
    productOrdered: {
      type: 'json',
      required: true
    }
  }
};
