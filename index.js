'use strict'

const express = require('express')
const mongoose = require('mongoose')
const config = require('./config')
const hbs = require('express-handlebars')
const router = require('./routers/routes')


const app = express()

const methodOverride =require('method-override')
app.use(methodOverride('_method'))

//body parser
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//Recursos estaticos/publicos
app.use('/static',express.static('public'))

//router our app
app.use('/',router)

//Motor de Vistas
app.engine('.hbs', hbs({
    defaultLayout : 'index',
    extname : '.hbs'
}))
app.set('view engine','.hbs')

//pagina home
app.get('/',(req,res) =>{
    res.status(200).send('Hola Mundo soy home')
})

//pagina login
app.get('/login',(req,res) =>{
    res.status(200).send('Hola Mundo soy login')
})

//pagina 404 not found
app.use((req,res)=>{
    res.status(404).send('Pagina no encontrada')
})

//conexion a base de datos
mongoose.connect(config.db, config.urlParser, (err,res)=>{
    if(err){
        return console.log(`Error al conectar en la BD ${err}`)
    }

    console.log('Conexion a la BD exitosa')

    app.listen(config.port,()=>{
        console.log(`Ejecutando en http://localhost:${config.port}`)
    })
})

