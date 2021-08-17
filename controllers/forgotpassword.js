const redisClient = require('./signin').redisClient

const handleForgot = (req, res, db, nodemailer) => { 
    const { email } = req.body
    db('users')
    .select('email')
    .where({email: email})
    .then(email => { 
        if (email){
            const ukey = randomString(20)
            console.log(email[0])

            // redisClient.set(ukey, email.rows[0], 'EX', 60 * 15)
        //     let transporter = nodemailer.createTransport({ 
        //         host: 'smtp.gmail.com',
        //         port: 465,
        //         secure:true,
        //         auth: {
        //             type: 'OAuth2',
        //             user: process.env.FORGOT_EMAIL,
        //             clientId: process.env.GOOGLE_CLIENT_ID,
        //             clientSecret: process.env.GOOGLE_SECRET,
        //             refreshToken: process.env.GOOGLE_REFRESH,
        //             accessToken: process.env.GOOGLE_ACCESS,
        //             expires: 1484314697598
        //         }
        //    })
        //    const mail = { 
        //        from: `EDH Builder`,
        //            to: email[0],
        //            subject: "EDH Builder Reset Password",
        //            text: `Click this link to register new password: https://edhbuilder.com.au/forgotpassword${ukey}`,
        //    }
        //    transporter.sendMail(mail, (err, info) => {
        //        if (err) { 
        //         res.status(err).json("Message failed")
        //        }
        //        else { 
        //            res.json("success")
        //        }
        //    }) 
        }
        res.json(email)
    })
    .catch(err => res.status(400).json(err))
    }

    function randomString(len) {
        charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var randomString = '';
        for (var i = 0; i < len; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz,randomPoz+1);
        }
        return randomString;
    }


module.exports = { 
   handleForgot: handleForgot
}