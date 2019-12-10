 
module.exports = {
  port: process.env.PORT || 3000,
  templateEngine: 'ejs',
  // Session Configuration
  sessionSecret: process.env.SESSION_SECRET || 'Y0uShuuuldChanGethisToSomethingSaf3',
  sessionCookie: {
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
  sessionName: 'connect.sid'
};