const allowedAdmins = [
    { email: 'samad123@gmail.com', password: '123' },
    { email: 'shakeel123@gmail.com', password: '123' }
];

function validateAdminCredentials(req, res, next) {
    const { email, password } = req.body;
    const admin = allowedAdmins.find(admin => admin.email === email && admin.password === password);
    if (admin) {
        req.session.isAdmin = true;
        res.redirect('/admin/panel');
    } else {
        req.session.message = {
            type: 'danger',
            content: 'Unauthorized: Invalid credentials'
        };
        res.redirect('/admin/login');
    }
}

function checkAdminAuth(req, res, next) {
    if (req.session.isAdmin) {
        next();
    } else {
        req.session.message = {
            type: 'danger',
            content: 'Unauthorized: Please log in first'
        };
        res.redirect('/admin/login');
    }
}

module.exports = { validateAdminCredentials, checkAdminAuth };
