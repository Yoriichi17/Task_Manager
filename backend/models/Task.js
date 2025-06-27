const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    taskDescription : {type:String , required:true},
    estimatedHours: { type:Number , required:true },
    taskDate: { type:Date , required:true },
    assignedTo : { type:mongoose.Schema.Types.ObjectId, ref: 'User' , required:true}
}, { timestamps: true })

module.exports = mongoose.models.Task || mongoose.model('Task' , taskSchema)