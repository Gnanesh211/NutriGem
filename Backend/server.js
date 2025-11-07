const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


// Schemas
const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
});

const ProfileSchema = new mongoose.Schema({
    username: { type: String, required: true },
    age: Number,
    gender: String,
    height: Number,
    weight: Number,
    goalWeight: Number,
    activityLevel: String,
    goal: String,
    goalType: String,
});

const DailyLogSchema = new mongoose.Schema({
    username: { type: String, required: true },
    meals: {
        Breakfast: { type: Array, default: [] },
        Lunch: { type: Array, default: [] },
        Dinner: { type: Array, default: [] },
        Snacks: { type: Array, default: [] },
    },
});

const WaterSchema = new mongoose.Schema({
    username: { type: String, required: true },
    waterIntake: { type: Number, default: 0 },
});

const WeightSchema = new mongoose.Schema({
    username: { type: String, required: true },
    weightLog: { type: Array, default: [] },
});

// Models
const User = mongoose.model('User', UserSchema);
const Profile = mongoose.model('Profile', ProfileSchema);
const DailyLog = mongoose.model('DailyLog', DailyLogSchema);
const Water = mongoose.model('Water', WaterSchema);
const Weight = mongoose.model('Weight', WeightSchema);

// --- Routes ---

// Auth Routes
app.post('/api/signup', async (req, res) => {
    const { username } = req.body;
    try {
        const existing = await User.findOne({ username });
        if (existing) return res.json({ success: false, error: 'USERNAME_TAKEN' });

        const user = new User({ username });
        await user.save();

        // Initialize default data
        const defaultProfile = new Profile({
            username,
            age: 30,
            gender: 'male',
            height: 180,
            weight: 75,
            goalWeight: 72,
            activityLevel: 'ModeratelyActive',
            goal: 'Maintain',
            goalType: 'auto',
        });
        await defaultProfile.save();

        const defaultDailyLog = new DailyLog({ username });
        await defaultDailyLog.save();

        const defaultWater = new Water({ username });
        await defaultWater.save();

        const defaultWeight = new Weight({ username });
        await defaultWeight.save();

        res.json({ success: true, user: { username } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'SERVER_ERROR' });
    }
});

app.post('/api/login', async (req, res) => {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.json({ success: false, error: 'USER_NOT_FOUND' });
    res.json({ success: true, user: { username } });
});

// Fetch User Data
app.get('/api/user/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const profile = await Profile.findOne({ username });
        const dailyLog = await DailyLog.findOne({ username });
        const water = await Water.findOne({ username });
        const weight = await Weight.findOne({ username });

        res.json({
            profile,
            dailyLog: dailyLog ? dailyLog.meals : {},
            waterIntake: water ? water.waterIntake : 0,
            weightLog: weight ? weight.weightLog : [],
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'SERVER_ERROR' });
    }
});

// Update Profile
app.put('/api/user/:username/profile', async (req, res) => {
    const { username } = req.params;
    const profileData = req.body;
    try {
        const updated = await Profile.findOneAndUpdate(
            { username },
            profileData,
            { new: true, upsert: true }
        );
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'SERVER_ERROR' });
    }
});

// Update DailyLog
app.put('/api/user/:username/dailylog', async (req, res) => {
    const { username } = req.params;
    const meals = req.body;
    try {
        const updated = await DailyLog.findOneAndUpdate(
            { username },
            { meals },
            { new: true, upsert: true }
        );
        res.json(updated.meals);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'SERVER_ERROR' });
    }
});

// Update Water Intake
app.put('/api/user/:username/water', async (req, res) => {
    const { username } = req.params;
    const { waterIntake } = req.body;
    try {
        const updated = await Water.findOneAndUpdate(
            { username },
            { waterIntake },
            { new: true, upsert: true }
        );
        res.json(updated.waterIntake);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'SERVER_ERROR' });
    }
});

// Update Weight Log
app.put('/api/user/:username/weightlog', async (req, res) => {
    const { username } = req.params;
    const { weightLog } = req.body;
    try {
        const updated = await Weight.findOneAndUpdate(
            { username },
            { weightLog },
            { new: true, upsert: true }
        );
        res.json(updated.weightLog);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'SERVER_ERROR' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
