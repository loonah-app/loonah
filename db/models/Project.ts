import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },             // Project name
    githubRepo: { type: String, required: true },       // GitHub repository URL
    tempDomain: { type: String },                       // Temporary subdomain for Project
    storageObjectId: { type: String },                  // Decentralized storage ID
    connectedDomain: { type: String },                  // Custom domain connected (optional)
    status: {                                           // Project status
        type: String,
        enum: ['DECLINED', 'QUEUED', 'BUILDING', 'DEPLOYING', 'DEPLOYED'],
        default: 'QUEUED',
    },
    user: {                                             
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {
    timestamps: true 
});

// Create a model based on the schema
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

export default Project;
