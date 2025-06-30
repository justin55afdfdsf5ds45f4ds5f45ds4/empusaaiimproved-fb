'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import type { OnApproveData, OnApproveActions } from "@paypal/paypal-js";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "AURGuM1m_po0hnXsbFXSpd1OCFKdnraFHB7hPiGDaBqNBhvfvFLgOJmAcaBfE1ppdnLuYUtvSPNsJl6T";

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<'paying' | 'success'>('paying');
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleApprove = (data: OnApproveData, actions: OnApproveActions) => {
    return actions.order!.capture().then((details) => {
      setPaymentStatus('success');
      setPaymentError(null);
      setTransactionId(details.id);
      document.cookie = "purchase_completed=true; path=/; max-age=31536000";
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    }).catch((err) => {
      setPaymentError('An error occurred while processing your payment. Please try again.');
      return Promise.reject(err);
    });
  };

  return (
    <main className="font-inter flex flex-col lg:flex-row h-screen w-screen overflow-hidden">
      {/* Left Panel */}
      <section className="w-full lg:w-1/2 h-[50vh] lg:h-full bg-black text-white flex flex-col p-8 lg:p-12">
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
      <section className="w-full lg:w-1/2 h-[50vh] lg:h-full bg-white flex flex-col p-0">
        {/* 
          This wrapper allows vertical scrolling if needed (for long forms),
          and naturally centers the payment method if short.
        */}
        <div className="flex-1 flex flex-col overflow-y-auto items-center p-8">
          <div className="w-full max-w-sm my-auto">
            {paymentStatus === 'paying' ? (
              <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID, currency: "USD" }}>
                <h2 className="text-2xl font-extrabold text-gray-800 mb-6">Pay with PayPal</h2>
                <PayPalButtons
                  style={{ layout: "vertical", shape: "rect", height: 55 }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [{
                        description: 'Empusa AI - Growth Plan (One-Time Charge)',
                        amount: { value: '500.00' }
                      }]
                    });
                  }}
                  onApprove={handleApprove}
                  onError={(err) => {
                    setPaymentError('An error occurred. Please try another payment method.');
                    return Promise.reject(err);
                  }}
                />
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
                <p className="text-gray-600 mt-2">Thank you! Redirecting you to the dashboard...</p>
                <div className="mt-6 text-sm">
                  <p className="text-gray-500">Your transaction has been completed.</p>
                  <p className="text-gray-700 font-mono mt-2 bg-gray-100 p-2 rounded-md break-all">
                    Transaction ID: {transactionId}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
