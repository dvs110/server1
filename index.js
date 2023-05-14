require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt')
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser")
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cookieParser())
app.use(cors());

const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    host: 'mail.google.com',
    port: 465,
    secure: true,
    service: 'gmail',

    auth: {
        user: process.env.EMAIL,
        pass: process.env.app_password,
    },
    tls: {
        rejectUnauthorized: false
    }
});

//mongo code
const connect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log("connected to mondodb");
    } catch (error) {
        throw error;
    }
};
mongoose.connection.on('disconnected', () => { //if mongodb got disconnected
    console.log("mongodb disconnected");
});


/////----user schema
const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },

});
const User = mongoose.model('User', userSchema);




/////routes----User

app.post('/signup-user', async (req, res) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user == null) {
            const newperson = new User(
                { ...req.body, password: hash }
            );
            try {

                const saveduser = await newperson.save();
                res.status(200).json(saveduser)

            } catch (err) {
                console.log(err);
            }
        }
        else {

            res.status(200).json(0)
        }
    }
    catch (err) {
        console.log(err);
    }

});

app.post('/login-user', async (req, res) => {
    try {

        const user = await User.findOne({ email: req.body.email })
        if (user == null) {
            res.status(200).json(0)  //incorrect email
        } else {
            let isPasswordCorrect
            isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
            if (isPasswordCorrect) {
                res.status(200).json(1)  //correct
            }
            else
                res.status(200).json(-1)  //incorrect password
        }
    } catch (err) {
        console.log(err);
        res.status(200).json("error came")

    }
})
app.delete('/delete-user', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user == null) {
            res.status(200).json(0)  // incorrect mail
        } else {
            let isPasswordCorrect
            isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
            if (isPasswordCorrect) {
                await User.findByIdAndDelete(user._id);
                res.status(200).json(1)  //user deleted
            }
            else
                res.status(200).json(2)  //incorrect password
        }
    } catch (err) {
        console.log(err);
        res.status(200).json("error aa gaya")

    }
})

app.put("/update-user", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user == null) {
            res.status(200).json(0)  //user not found
        }
        else {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt);
            const userflight = await User.findByIdAndUpdate(user._id, { $set: { ...req.body, password: hash } }, { new: true });
            res.status(200).json(1)  //successfully updated
        }
    } catch (err) {
        console.log(err);
    }

})





///------worker schema

const workerSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    status: { type: Boolean, default: false },
    phonenumber: { type: String },
    service: { type: String },
    rating: { type: String },
    age: { type: String },
    state: { type: String },
    city: { type: String },
    amount: { type: String },
    photo: { type: String },

});
const Worker = mongoose.model('Worker', workerSchema);



//////routes---worker

app.post('/carrers/signup-worker', async (req, res) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    try {
        const worker = await Worker.findOne({ email: req.body.email })
        if (worker == null) {
            const newworker = new Worker(
                { ...req.body, password: hash }
            );
            try {

                const savedworker = await newworker.save();
                res.status(200).json(savedworker)

            } catch (err) {
                console.log(err);
            }
        }
        else {

            res.status(200).json(0)
        }
    }
    catch (err) {
        console.log(err);
    }

})


app.post('/carrers/login-worker', async (req, res) => {
    try {

        const worker = await Worker.findOne({ email: req.body.email })
        if (worker == null) {
            res.status(200).json(0)  //incorrect email
        } else {
            let isPasswordCorrect
            isPasswordCorrect = await bcrypt.compare(req.body.password, worker.password);
            if (isPasswordCorrect) {

                res.status(200).json(1)
            }
            else
                res.status(200).json(-1)  //incorrect password
        }
    } catch (err) {
        console.log(err);
        res.status(200).json("error came")

    }
})
app.delete('/carrers/delete-worker', async (req, res) => {
    try {
        const worker = await Worker.findOne({ email: req.body.email })
        if (worker == null) {
            res.status(200).json(0)  // incorrect email
        } else {
            let isPasswordCorrect
            isPasswordCorrect = await bcrypt.compare(req.body.password, worker.password);
            if (isPasswordCorrect) {
                await Worker.findByIdAndDelete(worker._id);
                res.status(200).json(1)  //worker deleted
            }
            else
                res.status(200).json(-1)  //incorrect password
        }
    } catch (err) {
        console.log(err);
        res.status(200).json("error came")

    }
})


app.put("/carrers/update-worker", async (req, res) => {
    try {
        const worker = await Worker.findOne({ email: req.body.email })
        if (worker == null) {
            res.status(200).json(0)  //worker not found
        }
        else {
            const workerflight = await Worker.findByIdAndUpdate(worker._id, { $set: { ...req.body } }, { new: true });
            res.status(200).json(workerflight)  //successfully updated
        }
    } catch (err) {
        console.log(err);
    }

})

app.put("/carrers/update-password", async (req, res) => {
    try {
        const worker = await Worker.findOne({ email: req.body.email })
        if (worker == null) {
            res.status(200).json(0)  //worker not found
        }
        else {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt);
            const workerflight = await Worker.findByIdAndUpdate(worker._id, { $set: { ...req.body, password: hash } }, { new: true });
            res.status(200).json(workerflight)  //successfully updated
        }
    } catch (err) {
        console.log(err);
    }

})

app.put("/book-worker/:id", async (req, res) => {

    const workerflight = await Worker.findByIdAndUpdate(req.params.id, { $set: { status: true } }, { new: true });
    var mailOptions = {
        from: process.env.EMAIL,
        to: "satidevang2001@gmail.com",//email to be sended
        subject: "INFOMATION ",
        html: `<div><h1 style='font-weight:bold'>${req.body.address}</h1></div>`  // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });




    res.status(200).json(workerflight)  //successfully updated

})
app.put("/cancelbooking-worker/:id", async (req, res) => {

    const workerflight = await Worker.findByIdAndUpdate(req.params.id, { $set: { status: false } }, { new: true });
    var mailOptions = {
        from: process.env.EMAIL,
        to: "satidevang2001@gmail.com",//email to be sended
        subject: "INFOMATION",
        html: `<div><h1 style='font-weight:bold'>Booking Cancelled</h1></div>`  // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });




    res.status(200).json(workerflight)  //successfully updated

})
app.get("/findbyservice", async (req, res) => {
    const { service } = req.body //sorting according to service

    try {
        const workers = await Worker.find({ service: service });
        res.status(200).json(workers)
    } catch (err) {
        return next(err);
    }

})

app.get("/findbylocation", async (req, res) => {
    const { city } = req.body //sorting according to service

    try {
        const workers = await Worker.find({ city: city });
        res.status(200).json(workers)
    } catch (err) {
        console.log(err);
    }

})













const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    connect();
    console.log(`Listening on port ${PORT}`)
})
