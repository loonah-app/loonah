import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    githubId: { type: String, required: true, unique: true },
    projects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    }]
}, {
    timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;