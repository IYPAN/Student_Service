const supabase = require('../config/supabaseClient');

// Get Batches by Center
const getBatchesByCenter = async (req, res) => {
    const { center } = req.student;  // Decoded from JWT

    const { data: batches, error } = await supabase
        .from('batches')
        .select('*')
        .eq('center', center);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json({ batches });
};

// Enroll Student in Batch
const enrollStudent = async (req, res) => {
    const { student_id } = req.student; // Decoded from JWT
    const { batch_id } = req.body;

    if (!batch_id) {
        return res.status(400).json({ error: 'Batch ID is required' });
    }

    const { data, error } = await supabase
        .from('enrollment')
        .insert([{ 
            student: student_id, 
            batch: batch_id, 
            status: false  // Default value
        }]);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Enrollment successful, pending approval' });
};

module.exports = { getBatchesByCenter, enrollStudent };
