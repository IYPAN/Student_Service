const supabase = require('../config/supabaseClient');

// ✅ Get Batches by Center
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

// ✅ Enroll Student in Batch
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

// ✅ Get All Batches the Student is Enrolled In
const getEnrolledBatches = async (req, res) => {
    const { student_id } = req.student;  // Decoded from JWT

    // Fetch student enrollments
    let { data: enrollments, error } = await supabase
        .from('enrollment')
        .select('*')
        .eq('student', student_id);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    // Get current date
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Check for expired enrollments
    for (let enrollment of enrollments) {
        if (enrollment.end_date && enrollment.end_date < currentDate) {
            // Update status to false
            await supabase
                .from('enrollment')
                .update({ status: false })
                .eq('enrollment_id', enrollment.enrollment_id);
            
            enrollment.status = false; // Update local object for response
        }
    }

    res.json({ enrollments });
};

module.exports = { getBatchesByCenter, enrollStudent, getEnrolledBatches };
