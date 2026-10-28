import { useContext, useRef, useState } from 'react'
import { motion } from 'motion/react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { plans } from '../assets/assets'
import AnimatedCreditPurchaseButton from '../components/AnimatedCreditPurchaseButton'
import WordRevealText from '../components/WordRevealText'
import { AppContext } from '../context/context'

const BuyCredit = () => {
  const { user, credit, backendUrl, loadCreditsData, token, setShowLogin } = useContext(AppContext)
  const [activePlanId, setActivePlanId] = useState(null)
  const purchaseLockRef = useRef(null)

  const startPurchase = (planId) => {
    if (purchaseLockRef.current) return false
    purchaseLockRef.current = planId
    setActivePlanId(planId)
    return true
  }

  const initPay = (order, plan) => new Promise((resolve) => {
    if (!window.Razorpay) {
      toast.error('Razorpay checkout is unavailable. Please refresh and try again.')
      resolve({ success: false })
      return
    }

    let settled = false
    let verificationStarted = false
    const finish = (result) => {
      if (settled) return
      settled = true
      resolve(result)
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Imagify',
      description: `${plan.credits} image credits`,
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        verificationStarted = true
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/verify-razor`,
            response,
            { headers: { token } },
          )

          if (!data.success) {
            toast.error(data.message || 'Payment verification failed. Credits were not added.')
            finish({ success: false })
            return
          }

          await loadCreditsData()
          toast.success(`${plan.credits} credits added to your account.`)
          finish({ success: true })
        } catch (error) {
          toast.error(error.response?.data?.message || error.message)
          finish({ success: false })
        }
      },
      modal: {
        ondismiss: () => {
          if (verificationStarted) return
          toast.info('Checkout was closed. No credits were added.')
          finish({ success: false, cancelled: true })
        },
      },
    }

    try {
      const razorpay = new window.Razorpay(options)
      razorpay.on('payment.failed', (response) => {
        const message = response?.error?.description
        toast.error(message || 'Payment failed. No credits were added.')
        finish({ success: false })
      })
      razorpay.open()
    } catch (error) {
      toast.error(error.message || 'Unable to open Razorpay checkout.')
      finish({ success: false })
    }
  })

  const paymentRazorpay = async (planId) => {
    const selectedPlan = plans.find((plan) => plan.id === planId)
    if (!selectedPlan) {
      toast.error('That credit package is no longer available. Please refresh and try again.')
      return { success: false }
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/pay-razor`,
        { planId: selectedPlan.id },
        { headers: { token } },
      )

      if (!data.success || !data.order) {
        toast.error(data.message || 'Unable to initialize the payment. Please try again.')
        return { success: false }
      }

      return await initPay(data.order, selectedPlan)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
      return { success: false }
    } finally {
      purchaseLockRef.current = null
      setActivePlanId(null)
    }
  }

  return (
    <motion.main
      className="pricing-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="section-heading">
        <span className="eyebrow">CREDITS FOR YOUR NEXT IDEA</span>
        <WordRevealText
          as="h1"
          text="Keep the ideas coming."
          accentWords={['coming.']}
        />
        <WordRevealText
          text="Choose a credit pack when you're ready. Your existing account balance stays right where it is."
          stagger={0.025}
        />
      </div>
      {user && (
        <p className="balance-banner glass-panel">
          <span className="credit-chip__icon" aria-hidden="true">✦</span>
          You currently have <strong>{credit}</strong> credits available.
        </p>
      )}
      {!user && (
        <p className="pricing-signin-note">
          Sign in before checkout. Your selected credit package will stay available.
        </p>
      )}
      <div className="plans-grid">
        {plans.map((plan, index) => (
          <motion.article
            className={`plan-card glass-panel${index === 1 ? ' plan-card--featured' : ''}`}
            key={plan.id}
            whileHover={activePlanId ? undefined : { y: -4 }}
            transition={{ duration: 0.18 }}
            aria-label={`${plan.id}, ₹${plan.price}, ${plan.credits} credits`}
          >
            <span className="plan-icon" aria-hidden="true">✦</span>
            <p className="plan-name">{plan.id}</p>
            <WordRevealText
              as="p"
              className="plan-description"
              text={plan.desc}
              stagger={0.02}
              duration={0.34}
            />
            <p className="plan-price">
              <span className="plan-currency">₹</span>{plan.price}
              <span className="plan-unit">one-time</span>
            </p>
            <div className="plan-credits">
              <span className="credit-chip__icon" aria-hidden="true">✦</span>
              <strong>{plan.credits}</strong> image credits
            </div>
            <AnimatedCreditPurchaseButton
              planId={plan.id}
              authenticated={Boolean(user)}
              disabled={Boolean(activePlanId) && activePlanId !== plan.id}
              onStart={startPurchase}
              onConfirm={paymentRazorpay}
              onSignIn={() => setShowLogin(true)}
            />
            <p className="plan-footnote">Secure checkout with Razorpay</p>
          </motion.article>
        ))}
      </div>
      {activePlanId && (
        <p className="payment-status-note" role="status" aria-live="polite">
          Complete payment in the secure Razorpay checkout. Credits are added after verification.
        </p>
      )}
      <p className="pricing-note">All credit packs and prices are the current Imagify plans.</p>
    </motion.main>
  )
}

export default BuyCredit
