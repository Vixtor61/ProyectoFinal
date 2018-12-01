var express = require('express');
var router = express.Router();
const user = require('../models/Usuario');
const upload =  require('../helpers/upload-helper');
const fs = require('fs');

//Modificar todos los findbyid , estan quemados a 5bfee5f78763d84258a7c7d1

/** Rutas de archivos */
router.get('/profile/:id', (req, res, next) => {
    //res.render('mainUser')
    console.log(req.params.id);
    user.findById(req.params.id).then(usuario => {
        // res.send(usuario.archivos);
        console.log(usuario);
        res.render('mainUser',{user: usuario.nombre,
            usrid: usuario.id,
        archivos: usuario.archivos});
        // res.send('archivo cargado')
    })
});

//creacion de nuevos usuarios
router.post('/perf_crear', function(req, res, next) {
    const nuevoUsuario = new user({
        correo: req.body.correo,
        password: 'test',
        activo: true,
        nombre: req.body.nombre,
        tipo: 'user',
        capacidad: 1024
    });
    
    nuevoUsuario.save().then(usuarioGuardado => {
        res.send(usuarioGuardado);
    }).catch(err => {
        console.error(err);
        res.send('Ocurrió un error');
    });
})


router.post('/archivo/:id', (req, res, next) => {
    var dir = __dirname + '/upload';
    // if (!path.existsSync(dir)) {
    //     fs.mkdirSync(dir);
    // }
    if(!upload.isEmpty(req.files)){
        //input ===> nombre de inputfile jade
        let file = req.files.input;
        let alias= req.files.input.name;
        let filename = req.params.id+'_'+Date.now() + '_' +file.name;
        file.mv('./public/upload/'+filename, (err)=>{
            if(err) throw err;
        });
        console.log(req.params.id);
        user.findById(req.params.id).then(data => {
            let stadistica = fs.statSync('./public/upload/'+filename);
            switch (file.mimetype) {
                case 'application/x-msexcel':
                    data.archivos.push({
                        alias: alias,
                        nombre: filename,
                        tipo: file.mimetype,
                        peso: Math.round((stadistica['size']/1048576.0)*100)/100,
                        icono: 'fa fa-file-excel'
                        });
                        break;
                case 'application/msword':
                data.archivos.push({
                    alias: alias,
                    nombre: filename,
                    tipo: file.mimetype,
                    peso: Math.round((stadistica['size']/1048576.0)*100)/100,
                    icono: 'fa fa-file-word'
                    });
                        break;
                case 'audio/mpeg':
                data.archivos.push({
                    alias: alias,
                    nombre: filename,
                    tipo: file.mimetype,
                    peso: Math.round((stadistica['size']/1048576.0)*100)/100,
                    icono: 'fa fa-music'
                    });
                        break;
                case 'audio/mp3':
                    data.archivos.push({
                        alias: alias,
                        nombre: filename,
                        tipo: file.mimetype,
                        peso: Math.round((stadistica['size']/1048576.0)*100)/100,
                        icono: 'fa fa-music'
                    });
                        break;
                case 'application/x-rar-compressed':
                    data.archivos.push({
                        alias: alias,
                        nombre: filename,
                        tipo: file.mimetype,
                        peso: Math.round((stadistica['size']/1048576.0)*100)/100,
                        icono: 'fa fa-file-archive'
                    });
                        break;
                case 'application/zip':
                    data.archivos.push({
                        alias: alias,
                        nombre: filename,
                        tipo: file.mimetype,
                        peso: Math.round((stadistica['size']/1048576.0)*100)/100,
                        icono: 'fa fa-file-archive'
                    });
                        break;
                case 'application/vnd.ms-powerpoint':
                data.archivos.push({
                    alias: alias,
                    nombre: filename,
                    tipo: file.mimetype,
                    peso: Math.round((stadistica['size']/1048576.0)*100)/100,
                    icono: 'fa fa-file-powerpoint'
                    });
                        break;

                case 'image/png':
                console.log(alias);
                data.archivos.push({
                    alias: alias,
                    nombre: filename,
                    tipo: file.mimetype,
                    peso: Math.round((stadistica['size']/1048576.0)*100)/100,
                    icono: 'fa fa-file-image'
                    });
                        break;         
                case 'image/jpeg':
                data.archivos.push({
                    alias: alias,
                    nombre: filename,
                    tipo: file.mimetype,
                    peso: Math.round((stadistica['size']/1048576.0)*100)/100,
                    icono: 'fa fa-file-image'
                    });
                        break;      
                case 'video/mpeg':
                data.archivos.push({
                    alias: alias,
                    nombre: filename,
                    tipo: file.mimetype,
                    peso: Math.round((stadistica['size']/1048576.0)*100)/100,
                    icono: 'fa fa-file-video'
                    });
                        break;     
                default:
                data.archivos.push({
                    alias: alias,
                    nombre: filename,
                    tipo: file.mimetype,
                    peso: Math.round((stadistica['size']/1048576.0)*100)/100,
                    icono: 'fa fa-file'
                    });
                        break;
            }
            
            
            data.modify = true;
            data.save().then(() => {
                res.redirect('/users/profile/' + req.params.id)
            });
            
        })
    }
});



router.delete('/archivo/', (req, res, next) => {
    user.findById(req.params.id).then(usuario =>{
        let archivos = usuario.archivos
        let contarch = 0;
       archivos.forEach(element => {
           if (element.nombre == req.body.name){
               fs.unlink('./public/uploads/'+element.nombre, (err) => {
                    archivos.splice(contarch, 1);
                    usuario.archivos = archivos;
                    usuario.modify = true;
                    usuario.save().then(()=>{
                        res.redirect('/users/archivo/' + req.body.id)
                    });
                })
           } else {
               contarch ++;
           }
       }); 
       res.redirect('/users/archivo/' + req.body.id)
    })
});

router.get('/archivo/delete/:nombreusr/:nombrear/:id',(req,res,next)=>{
    var filepath= ''
    User.update( {nombre: req.params.nombreusr}, { $pull: {archivos: { nombre: [req.params.nombrear]} } },function(err,updated){
        if(err){
            res.json({
                status: 500,
                success: false,
                errs
            });
        } else{
            fs.unlinkSync('./public/upload/'+req.params.nombrear);
            return res.redirect("/users/profile/"+req.params.id);
        }
    }); 
})



/** Rutas de perfil */
router.get('/perfil/:id', (req, res, next) => {
    res.send('Get Perfil');
});

router.put('/perfil/:id', (req, res, next) => {
    res.send('Put Perfil');
});

router.get('/config/', (req,res)=>{
    res.render('configuser');
});

router.put('/config/:id', (req, res)=>{
    let update = {
        nombre: req.body.nombre,
        //password: req.body.password
    }
    user.findByIdAndUpdate(req.params.id, update, function(err, nu){
        if(err){
            res.status(500);
            res.json({code: 500, err});
        }
        else{
            res.json({ok: true, nu, update});     
        }     
    });
});

const AuthController = require("../controllers/UserController");
//Requerimos el Middelware que hemos creado
const AuthMiddleware = require("../middlewares/AuthMiddleware");
//Requerimos el modelo
const User = require("../models/Usuario");
//ruta que nos devolvera el formulario para crear usuarios
router.post('/signup',AuthController.store);

//ruta que enviara los datos del usuario para almacenarlos en la base de datos
router.get('/signup',AuthController.create);
//ruta que nos devolvera el formulario para ingresar
router.get('/signin',AuthController.login);
//ruta que enviara los datos del usuario para ingresar al sistema
router.post('/signin',AuthController.signin);
//ruta para salir del sistema
router.get('/logout',AuthController.logout);
/*Middlewar que verifica que solo los usuarios registrados podran ingresar a esta seccion */
router.use(AuthMiddleware.isAuthentication);
//ruta para acceder al perifl
router.get('/profile',AuthController.profile);

module.exports = router;