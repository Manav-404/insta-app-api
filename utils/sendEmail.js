const nodemailer = require('nodemailer')
let transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "4cb0363d82adbe",
      pass: "97b8e9ae122eb0"
    }
  });
const sendEmail = (subject, body, user)=>{
    transport.sendMail({
        from: 'manav.p.desai@gmail.com',
        to: user.email,
        subject : subject,
        text: `Hey ${user.username}, Welcome to Insta Clone! Thanks for checking out the project. Hope you enjoy it`,
        html: body

    } ,function(err, info){
        if(err){
            console.log('Email error', error)
            return;
        }

        return {success: true, info: info}
    })
}

module.exports = sendEmail;