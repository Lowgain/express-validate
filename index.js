/*
 * Dmitry Petrov http://corpix.ru
 * http://dream-web.ru
 */
var check = require('validator').check
  , sanitize = require('validator').sanitize

module.exports = function(req, res, next) {
    req.getParam = function(param) {
        return this.params[param] || (this.query && this.query[param]) || (this.body ? this.body[param] : new Error(['express-validator: Param', param, 'not found'].join(' ')));
    }
          
    req.check = function(param, message, noSearch) {
      if(!noSearch) {
        param = this.getParam(param)
        if(param instanceof Error) throw param
      }
      var result = check(param, message)
      if(!result) {
        throw new Error(['express-validator:', (noSearch ? false : param) || message])
        return false
      }
      return result
    }
          
    req.filter = req.sanitize = function(param, noSearch) { // TODO: req.filter('var').xss() instead of req.params.var = req.filter('var').xss()
      if(!noSearch) {
        param = this.getParam(param)
        if(param instanceof Error) throw param
      }
      return sanitize(param)
    }
    return next()
}