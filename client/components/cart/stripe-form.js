import React, {Component} from 'react'
import axios from 'axios'
import {
  CardElement,
  injectStripe,
  PostalCodeElement,
  CardCVCElement,
  CardNumberElement,
  PaymentRequestButtonElement,
  StripeProvider
} from 'react-stripe-elements'
import StripeCheckout from 'react-stripe-checkout'
import {connect} from 'react-redux'
import placeOrder from '../../store'
import {emptyCart} from '../../store/cart'

import STRIPE_PUBLISHABLE from './constants/stripe'
import PAYMENT_SERVER_URL from './constants/server'

class CheckoutForm extends React.Component {
  constructor(props) {
    super(props)
  }

  fromUSDToCent = amount => amount * 100

  successPayment = async data => {
    alert('success')
  }

  errorPayment = data => {
    alert('Payment Error')
  }

  onToken = (amount, description) => token => {
    axios
      .post('/api/orders', {
        status: 'Completed',
        total: amount,
        cart: this.props.currentCart,
        description: description,
        id: token.id,
        userId: this.props.user.id
      })
      .then(this.successPayment)
      .catch(this.errorPayment)
    this.props.emptyCart()
  }

  render() {
    const cart = this.props.currentCart
    let total = cart
      .map(product => {
        return product.quantity * product.price
      })
      .reduce((a, b) => a + b, 0)
    return (
      <StripeCheckout
        name={name}
        description={'Purchase from Afore Giddy'}
        amount={total => this.fromUSDToCent(total)}
        token={this.onToken(total, 'Purchase from Afore Giddy')}
        currency={'USD'}
        stripeKey={STRIPE_PUBLISHABLE}
      />
    )
  }
}

// const inject = injectStripe(CheckoutForm)

const mapStateToProps = state => {
  return {
    currentCart: state.cart.currentCart,
    user: state.user
  }
}

const mapDispatchToProps = {emptyCart, placeOrder}

const connected = connect(mapStateToProps, mapDispatchToProps)(CheckoutForm)

export default connected
