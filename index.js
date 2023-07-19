const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer'); //libary add
const randomstring = require('randomstring');
 require('dotenv').config(); //güvenlik için  

const app = express(); //server tanımlama
const port = 3000; //server portu

app.use(bodyParser.json());  

// OTP kodu oluşturma
function generateOTP() {
    return randomstring.generate({
        length: 6,
        charset: 'numeric'
    });
}

// E-posta gönderme fonksiyonu
function sendOTP(email, otp) {
    const transporter = nodemailer.createTransport({
        service: 'Hotmail', // E-posta sağlayıcınıza göre değiştirin
        auth: {
            user: process.env.EMAIL,  // E-posta adresinizi buraya girin
            pass: process.env.PASSWORD // E-posta şifrenizi buraya girin
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'OTP Kodu',
        text: `OTP Kodunuz: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('E-posta gönderildi: ' + info.response);
        }
    });
}

// Kullanıcıya OTP kodunu gönderme
app.post('/sendotp', (req, res) => { //postman'deki post metodu 
    const { email } = req.body;  

    const otp = generateOTP();
    sendOTP(email, otp);

    res.json({ message: otp });
});


app.listen(port, () => {  //serverı çalıştırma 
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});