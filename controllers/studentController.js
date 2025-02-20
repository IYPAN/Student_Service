const supabase = require('../config/supabaseClient');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// Register Student
const registerStudent = async (req, res) => {
    const { registration_number, name, state, center, email, password, phone } = req.body;

    if (!registration_number || !name || !state || !center || !email || !password || !phone) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const { data, error } = await supabase
        .from('students')
        .insert([{ 
            registration_number, 
            name, 
            state, 
            center, 
            email, 
            password: hashedPassword, 
            phone, 
            status: false // Default status is false
        }]);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: 'Registration successful' });
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

module.exports = { registerStudent, loginStudent, updateStudent, deleteStudent };
