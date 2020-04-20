const express=require('express');
const path=require('path');
const exhbs=require('express-handlebars');
const methodOverride=require('method-override');
const session=require('express-session');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const flash=require('connect-flash');
const passport=require('passport');


//Initializations
const app=express();
require('./database');
require('./config/passport');

//Settings
app.set('port',process.env.PORT||3000);
app.set('views',path.join(__dirname,'views'));//Esto es porque tenemos todo en la carpeta src

const routes = require('./routes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// When connecting Handlebars to the Express app...

app.engine('.hbs', exhbs({
defaultLayout:'main',
layoutsDir:path.join(app.get('views'),'layouts'),
partialsDir:path.join(app.get('views'),'partials'),//Reutilizar partes de formularios
// ...implement newly added insecure prototype access
handlebars: allowInsecurePrototypeAccess(Handlebars),
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
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//Globals Variables
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');


    next();
})
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