const supabase = require('../config/supabaseClient');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const { get } = require('../routes/batchRoutes');

// Register Student
const registerStudent = async (req, res) => {
    const { registration_number, name, state, center, email, password, phone } = req.body;

    if (!name || !state || !center || !email || !password || !phone) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
        .from('students')
        .insert([{  
            name, 
            state, 
            center, 
            email, 
            password: hashedPassword, 
            phone, 
            status: false // Default status is false
        }])
        .select(); // Fetch the inserted row details

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: 'Registration successful', student: data[0] });
};

// Login Student
const loginStudent = async (req, res) => {
    const { registration_number, password } = req.body;

    if (!registration_number || !password) {
        return res.status(400).json({ error: 'Registration number and password are required' });
    }

    const { data: students, error } = await supabase
        .from('students')
        .select('*')
        .eq('registration_number', registration_number)
        .limit(1);

    if (error || students.length === 0) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    const student = students[0];

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    if (!student.status) {
        return res.status(403).json({ error: 'Your profile needs to be approved' });
    }

    const token = generateToken(student.student_id, student.center, student.state);
    res.json({ message: 'Login successful', token });
};

const getStudentDetails = async (req, res) => {
    const { student_id } = req.body;

    if (!student_id) {
        return res.status(400).json({ error: 'Student ID is required' });
    }

    // Fetch student details with full state and center information
    const { data, error } = await supabase
        .from('students')
        .select(`
            student_id, created_at, registration_number, name, email, password, phone, status,
            state:states (*),
            center:centers (*)
        `)
        .eq('student_id', student_id)
        .single();

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json({ student: data });
};



// Update Student Details
const updateStudent = async (req, res) => {
    const { name, state, center, email, phone } = req.body;
    const student_id = req.student.student_id;

    const { data, error } = await supabase
        .from('students')
        .update({ name, state, center, email, phone })
        .eq('student_id', student_id);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Profile updated successfully' });
};

// Delete Student
const deleteStudent = async (req, res) => {
    const student_id = req.student.student_id;

    const { error } = await supabase
        .from('students')
        .delete()
        .eq('student_id', student_id);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Student deleted successfully' });
};

// Get List of States
const getStates = async (req, res) => {
    const { data, error } = await supabase.from('states').select('*');

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json(data);
};

// Get Centers Based on Selected State
const getCentersByState = async (req, res) => {
    const { state_id } = req.query; // Get state ID from query params

    if (!state_id) {
        return res.status(400).json({ error: 'State ID is required' });
    }

    const { data, error } = await supabase
        .from('centers')
        .select('*')
        .eq('state', state_id); // Fetch centers based on state

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json(data);
};

module.exports = { 
    registerStudent, 
    loginStudent, 
    getStudentDetails,
    updateStudent, 
    deleteStudent, 
    getStates, 
    getCentersByState 
};
