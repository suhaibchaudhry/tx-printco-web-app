/**
 * ProfileController
 *
 * @description :: Server-side logic for managing Profiles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  profile: function (req, res) {
    res.view({
      errors: req.flash('error')
    });
  },
  customerProfileData: function(req, res) {
    res.json({
      status: true
    });
  }
};
