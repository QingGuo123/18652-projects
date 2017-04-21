var util = require('util')

var AbstractError = function (msg, constr) {
    Error.captureStackTrace(this, constr || this)
    this.message = msg || 'Error'
}
util.inherits(AbstractError, Error)
AbstractError.prototype.name = 'Abstract Error'

var UserNotExistedError = function (msg) {
    UserNotExistedError.super_.call(this, msg, this.constructor)
}
util.inherits(UserNotExistedError, AbstractError)
UserNotExistedError.prototype.name = 'UserNotExisted Error'

var RepeatedUsernameError = function (msg) {
    RepeatedUsernameError.super_.call(this, msg, this.constructor)
}
util.inherits(RepeatedUsernameError, AbstractError)
RepeatedUsernameError.prototype.name = 'RepeatedUsername Error'

var RepeatedStatusError = function (msg) {
    RepeatedStatusError.super_.call(this, msg, this.constructor)
}
util.inherits(RepeatedStatusError, AbstractError)
RepeatedStatusError.prototype.name = 'RepeatedStatus Error'

module.exports = {
    UserNotExisted: UserNotExistedError,
    RepeatedUsername: RepeatedUsernameError,
    RepeatedStatus: RepeatedStatusError
}
