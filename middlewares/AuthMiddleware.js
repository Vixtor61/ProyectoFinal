const mongoose = require('mongoose');
const User = require("../models/Usuario");
const bcrypt = require('bcrypt');

const AuthMiddleware = {};
AuthMiddleware.isAuthentication = function (req, res, next) {
    if(!req.session.user) // verificamos is existe la session
    {
        return res.redirect('/'); //redirigimos al index si esto no es posible
    }
    //si existe la sesion parsea el contenido
    data = JSON.parse(req.session.user);
    User.findOne({ correo: data.correo })
        .exec(function (err, user) {
            if (err) {
                return next(err);
            }
            else {
                if (!user) {
                    return res.redirect('/');
                }
                else {
                    bcrypt.compare(data.userId, user._id.toString(), function (err, result) {
                        console.log("llego aca", data.userId);
                        if (result == true) {
                            return next();
                        }
                        else {
                            return next(err);
                        }
                    });
                }
            }
        });
};

module.exports = AuthMiddleware;
