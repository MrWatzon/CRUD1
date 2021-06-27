/*jshint esversion: 6 */

//import Modules
const express = require('express');
const Product = require('../models/product');
const path = require('path');
const { inflate } = require('zlib');

//create a router object
const router = express.Router();

//export our router
module.exports = router;

//pagina home
router.get('/',(req,res) =>{
    res.render('home');
});

//insertar datos
router.get('/insertProduct',(req,res) =>{
    res.render('product');
});

//Consulta de todos los datos
router.get('/api/product',(req,res)=>{
    Product.find({}, (err,products)=>{
        if(err) return res.status(500).send({
            message: `Error al realizar la peticion ${err}`
        });
        if(!products) return res.status(404).send({
            message: 'No existen productos'
        });
        //res.status(200).send({ products:[products]});
        res.render('showProducts',{products});
    }).lean();
});

//consulta por filtro
//Lopez Montero Brandon Carlos
router.get('/api/product/:datoBusqueda',(req,res)=>{
    let datoBusqueda=req.params.datoBusqueda;
    Product.findById(datoBusqueda,(err,todoOK)=>{
    //Product.find({name:datoBusqueda},(err,todoOK)=>{
        if(err) return res.status(500).send({
            message: `Error al realizar la peticion ${err}`
        });
        if(!todoOK) return res.status(404).send({
            message: 'El producto no existe'
        });
        //res.status(200).send({product:todoOK});
        res.render('editar',{products:todoOK});
    }).lean();
});

//Modificar producto PUT
const putProduct = require('../controllers/putProduct');
router.put('/api/product/:productId',putProduct);

// Insertar valores en la BD POST
router.post('/api/product',(req,res)=>{
    let product= new Product();
    product.name = req.body.name;
    product.picture = req.body.picture;
    product.price = req.body.price;
    product.category = (req.body.category).toLowerCase();
    product.description = req.body.description;

    console.log(req.body);
    
    product.save((err, productStored) =>{
        if (err) return res.status(500).send({
            message: `Error al realizar la peticion ${err}`
        });
        //res.status(200).send({product:productStored});
        res.redirect('/api/product');
    });
});

//Borrar un registro DELETE
const delProduct = require('../Controllers/delProduct');
router.delete('/api/product/:productId', delProduct);

//registro de nuevos usuarios
const newUser = require('../controllers/newUser')
router.get('/users/register',newUser);

//metodo POST para el registro
const newUserController=require('../controllers/storageUser');
router.post('/auth/register',newUserController);

//pagina login
const loginController = require('../controllers/login');
router.get('/auth/login',loginController);

const loginUserController = require('../Controllers/loginUser');
router.post('/users/login', loginUserController);

//pagina 404 not found
router.use((req,res)=>{
    res.status(404).send('Pagina no encontrada');
});