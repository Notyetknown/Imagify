import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'
import razorpay from 'razorpay';
import transactionModel from '../models/transactionModel.js'
import crypto from 'crypto'

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token, user: { name: user.name } })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: 'User does not exist' })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token, user: { name: user.name } })
        } else {
            return res.json({ success: false, message: 'Invalid credentials' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const userCredits = async (req, res)=>{
    try {
        const { userId } = req

        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({ success: false, message: 'User does not exist' })
        }
        res.json({success: true, credits: user.creditBalance, user: {name: user.name}})

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentRazorpay = async(req, res)=>{
    try {

        const { planId } = req.body
        const { userId } = req

        if (!userId || !planId) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.json({ success: false, message: 'User does not exist' })
        }

        let credits, plan, amount, date

        switch (planId) {
            case 'Basic':
            plan = 'Basic'
            credits = 100
            amount = 10
            break;

            case 'Advanced':
            plan = 'Advanced'
            credits = 500
            amount = 50
            break;

            case 'Business':
            plan = 'Business'
            credits = 5000
            amount = 250
            break;

            default:
                return res.json({ success: false, message: 'plan not found' });
        }

        date = Date.now();

        const options = {
            amount: amount * 100,
            currency: process.env.CURRENCY,
            receipt: `${userId}-${Date.now()}`,
        }

        const order = await razorpayInstance.orders.create(options)
        await transactionModel.create({
            userId,
            plan,
            amount,
            credits,
            date,
            razorpayOrderId: order.id,
        })
        res.json({success: true, order})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message })
    }
}

const verifyRazorpay = async (req, res) => {
    try {
        const { userId } = req
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

        if (!userId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.json({ success: false, message: 'Missing payment details' })
        }

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex')

        if (expectedSignature !== razorpay_signature) {
            return res.json({ success: false, message: 'Payment verification failed' })
        }

        const transaction = await transactionModel.findOne({
            razorpayOrderId: razorpay_order_id,
            userId,
        })

        if (!transaction) {
            return res.json({ success: false, message: 'Transaction not found' })
        }

        const paidTransaction = await transactionModel.findOneAndUpdate(
            { _id: transaction._id, payment: false },
            { payment: true, razorpayPaymentId: razorpay_payment_id },
            { new: true }
        )

        if (!paidTransaction) {
            return res.json({ success: true, message: 'Payment already verified' })
        }

        await userModel.findByIdAndUpdate(userId, { $inc: { creditBalance: transaction.credits } })

        res.json({ success: true, message: 'Payment verified and credits added' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay}