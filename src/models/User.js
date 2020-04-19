const mongoose=require('mongoose');
const {Schema}=mongoose;
const bcrypt=require('bcryptjs');

const userSchema=new Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String,required:true},
    date: {type:Date, default: Date.now}
})

// el scope en este tipo de funcione es diferente
userSchema.methods.encryptPassword=async(password)=>{
    const salt = await bcrypt.genSalt(10);
    const hash=bcrypt.hash(password,salt);
    return hash;
}
//Con este tipo de función accedo a los atributos del modelo
userSchema.methods.matchPassword=async function(password){
    return await bcrypt.compare(password,this.password);
};

module.exports=mongoose.model('User',userSchema);