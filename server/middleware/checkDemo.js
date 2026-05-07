const checkDemo = (req, res, next) => {
  if (req.user && req.user.role === 'demo') {
    const restrictedMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
    
    // Allow login/logout even for demo (though they aren't mutating other data)
    // But check the specific path if needed.
    // Generally, any request to modify data should be blocked.
    
    if (restrictedMethods.includes(req.method)) {
      // Allow specific paths if necessary (none for now as per user request "cant make any changes")
      return res.status(403).json({ 
        message: 'Action restricted. Demo users cannot modify data. Please create a real account to test these features!' 
      });
    }
  }
  next();
};

module.exports = checkDemo;
