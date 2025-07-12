'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { signIn } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import type { OnApproveData, OnApproveActions } from "@paypal/paypal-js";
import { useSession } from "next-auth/react"
import React from 'react';

// IMPORTANT: For security, move this to a .env.local file
// Example: NEXT_PUBLIC_PAYPAL_CLIENT_ID=AURGuM1...
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "ARze3QZCv1Oh-xpRK-A-1QoaSlGI-bA7S2Mw7Gp--AWXHJ-fYG0UWRgtcZT18gIU7OFQ7moexbZFMGYX";

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<'paying' | 'success'>('paying');
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const { data: authSession } = useSession();

  // Prefill name and email when the user is already logged in
  React.useEffect(() => {
    if (authSession?.user) {
      setBuyerName(authSession.user.name || "")
      setBuyerEmail(authSession.user.email || "")
    }
  }, [authSession])

  const handleApprove = (data: OnApproveData, actions: OnApproveActions) => {
    return actions.order!.capture().then(async (details) => {
      console.log('Capture result', details);
      setPaymentStatus('success');
      setPaymentError(null);
      setTransactionId(details.id || null);

      // Set purchase cookie so we can detect upgrade after registering
      document.cookie = "purchase_completed=true; path=/; max-age=31536000"; // 1 year expiry

      // If user not signed in yet, auto-register them using PayPal email
      if (!authSession?.user) {
        try {
          const email = buyerEmail || details.payer?.email_address;
          const name = buyerName || `${details.payer?.name?.given_name || ''} ${details.payer?.name?.surname || ''}`.trim() || 'New User';
          // Generate a 6-digit temporary code
          const password = Math.floor(100000 + Math.random() * 900000).toString();

          // 1) register hidden user
          await fetch('/api/auth/hidden-register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
          });

          // send credentials email
          await fetch('/api/auth/send-credentials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });

          // 2) small delay so Supabase REST reflects the update, then sign in
          await new Promise((r) => setTimeout(r, 300));
          await signIn('credentials', { redirect: false, email, password });
        } catch (err) {
          console.error('Auto-registration failed:', err);
        }
      }

      // At this point (either existing or just-created) try to upgrade to premium
      try {
        await fetch('/api/premium/upgrade', { method: 'POST' });
      } catch (e) {
        console.error('Failed to upgrade to premium:', e);
      }

      // Redirect to dashboard after a short delay to show the success message
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);

    }).catch((err) => {
      console.error('Error capturing the order:', err);
      setPaymentError('An error occurred while processing your payment. Please try again.');
      return Promise.reject(err);
    });
  };

  return (
    <main className="relative font-inter overflow-x-hidden">
      {/* Left Panel */}
      <section className="lg:fixed lg:top-0 lg:left-0 lg:w-1/2 lg:h-screen w-full bg-black text-white flex flex-col p-8 lg:p-12">
        <header className="flex-shrink-0">
          <h1 className="text-xl font-extrabold">Empusa AI</h1>
        </header>

        <div className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-sm">
            <p className="text-base font-semibold text-gray-300">Subscribe to Growth Plan</p>
            <div className="flex items-baseline mt-2 mb-8">
              <span className="text-4xl font-extrabold">$500.00</span>
              <span className="text-base font-medium text-gray-400 ml-1.5">/ month</span>
            </div>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Growth Plan</span>
                <span className="font-semibold">$500.00</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">$500.00</span>
              </div>
            </div>
            <hr className="border-gray-700 my-6" />
            <div className="flex justify-between items-baseline">
              <span className="text-base font-semibold">Total due today</span>
              <span className="text-2xl font-extrabold">$500.00</span>
            </div>
          </div>
        </div>

        <footer className="flex-shrink-0">
          <p className="text-xs text-gray-500">&copy; 2025 Empusa AI. All rights reserved.</p>
        </footer>
      </section>

      {/* Right Panel */}
      <section className="lg:ml-[50%] lg:w-1/2 min-h-screen w-full max-w-[100vw] bg-white box-border flex flex-col justify-center items-center py-12 px-4 overflow-y-auto overflow-x-hidden">
        {/* Increase max-width so card fields fit without horizontal scroll */}
        <div className="w-full max-w-md mx-auto text-center">
            {paymentStatus === 'paying' ? (
              <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "USD" }}>
                <h2 className="text-2xl font-extrabold text-gray-800 mb-4">Pay with PayPal</h2>

                {/* If user is not logged in, ask for name & email */}
                {!authSession?.user && (
                  <div className="space-y-3 mb-6">
                    <Input
                      placeholder="Your Name"
                      value={buyerName}
                      onChange={(e)=>setBuyerName(e.target.value)}
                    />
                    <Input
                      type="email"
                      placeholder="Email for account"
                      value={buyerEmail}
                      onChange={(e)=>setBuyerEmail(e.target.value)}
                    />
                  </div>
                )}

                {(authSession?.user || buyerEmail) ? (
                  <PayPalButtons
                    style={{ layout: "vertical", shape: "rect", height: 55 }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        intent: 'CAPTURE',
                        purchase_units: [{
                          description: 'Empusa AI - Growth Plan (One-Time Charge)',
                          amount: { currency_code: 'USD', value: '500.00' }
                        }]
                      });
                    }}
                    onApprove={handleApprove}
                    onError={(err) => {
                      console.error('PayPal Button Error:', err);
                      setPaymentError('An error occurred. Please try another payment method.');
                      return Promise.reject(err);
                    }}
                  />
                ) : (
                  <p className="text-sm text-gray-500">Please enter your name and email to enable payment.</p>
                )}
                {paymentError && <p className="text-red-500 text-sm my-4">{paymentError}</p>}
                <p className="text-xs text-gray-500 mt-4">
                  This is a one-time charge for the Growth Plan, not a recurring subscription. By confirming your payment, you agree to our Terms of Service.
                </p>
              </PayPalScriptProvider>
            ) : (
              <div id="success-message">
                <svg className="w-16 h-16 text-green-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-extrabold text-gray-800 mt-4">Payment Successful!</h2>
                <p className="text-gray-600 mt-2">Thank you! We've emailed your account credentials. Please check your inbox.</p>
                <p className="text-gray-500 text-sm">You'll be redirected to your dashboard shortly but keep that email handy for future logins.</p>
                <div className="mt-6 text-sm">
                  <p className="text-gray-500">Your transaction has been completed.</p>
                  <p className="text-gray-700 font-mono mt-2 bg-gray-100 p-2 rounded-md break-all">
                    Transaction ID: {transactionId}
                  </p>
                </div>
              </div>
            )}
        </div>
      </section>
    </main>
  );
}
