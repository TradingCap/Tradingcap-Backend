exports.getHealthStatus = async (req, res) => {
    try {
        let data = {
            message: 'Server is doing well...',
            uptime: process.uptime(),
            date: new Date()
        }
        return res.status(200).send(data);
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
