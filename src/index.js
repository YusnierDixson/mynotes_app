const express=require('express');
const path=require('path');
const exhbs=require('express-handlebars');
const methodOverride=require('method-override');
const session=require('express-session');


//Initializations
const app=express();
require('./database');

//Settings
app.set('port',process.env.PORT||3000);
app.set('views',path.join(__dirname,'views'));//Esto es porque tenemos todo en la carpeta src
app.engine('.hbs', exhbs({
defaultLayout:'main',
layoutsDir:path.join(app.get('views'),'layouts'),
partialsDir:path.join(app.get('views'),'partials'),//Reutilizar partes de formularios
extname:'.hbs'
}));
app.set('view engine','.hbs');

//Middlewares
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));
app.use(session({
    secret:'mysecretapp1234',
    resave: true,
    saveUninitialized:true
}))
//Globals Variables

//Routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

//Static Files
app.use(express.static(path.join(__dirname,'public')));

//Server is listenning
app.listen(app.get('port'),()=>{
    console.log('Server on port',app.get('port'));
    
});