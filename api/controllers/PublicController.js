/**
 * AppController
 *
 * @description :: Server-side logic for managing Public assets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  homepage: function (req, res) {
    res.view({
      errors: req.flash('error')
    });
  }
};

