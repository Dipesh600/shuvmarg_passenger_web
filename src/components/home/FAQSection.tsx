"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type FAQ = {
  question: string;
  answer: string;
};

type FAQCategory = {
  id: string;
  label: string;
  faqs: FAQ[];
};

const faqData: FAQCategory[] = [
  {
    id: "general",
    label: "General",
    faqs: [
      {
        question: "How do I book bus tickets online on ShuvMarg?",
        answer: "Booking bus tickets online on ShuvMarg takes less than a minute. Just enter your \"From\" city, \"To\" city, and travel date in the search box on the ShuvMarg homepage. You'll instantly see a list of available buses with timings, fares, seat layouts, and bus partner ratings. Pick your preferred bus, choose your seat, select your boarding and dropping points, enter passenger details, and complete the payment. Once your online bus booking is confirmed, your e-ticket is delivered via SMS, WhatsApp, and email.",
      },
      {
        question: "Do I need to create a ShuvMarg account to book bus tickets?",
        answer: "No, you don't need to create an account to book tickets. You can checkout as a guest. However, creating an account helps you manage your bookings, save traveler details, and access exclusive offers and rewards.",
      },
      {
        question: "How do I sign up on ShuvMarg?",
        answer: "You can sign up by clicking on the \"Login/Sign Up\" button on the top right corner of our website. You can register using your mobile number or email address.",
      },
      {
        question: "What are the benefits of booking bus tickets online in advance?",
        answer: "Booking in advance ensures you get the seat of your choice, early bird discounts, and peace of mind. During festive seasons, booking early guarantees availability on high-demand routes.",
      },
      {
        question: "Can I track my bus in real time after booking?",
        answer: "Yes, many of our bus partners offer real-time GPS tracking. If available for your journey, you will receive a tracking link before departure via SMS or WhatsApp.",
      },
    ],
  },
  {
    id: "ticket",
    label: "Ticket-related",
    faqs: [
      {
        question: "Do I need to carry a printed copy of my ticket?",
        answer: "For most operators, an m-ticket (SMS/WhatsApp/Email) along with a valid ID proof is sufficient. A few operators might require a physical printout, which will be mentioned during booking.",
      },
      {
        question: "I lost my ticket. What should I do?",
        answer: "Don't worry! You can easily download or resend your ticket from the 'My Bookings' section on our website by entering your mobile number and PNR.",
      },
      {
        question: "Can I change my boarding or dropping point after booking?",
        answer: "Depending on the bus operator's policy, you might be able to change your boarding point by contacting their support team at least a few hours before departure.",
      },
    ],
  },
  {
    id: "payment",
    label: "Payment",
    faqs: [
      {
        question: "What payment methods are accepted?",
        answer: "We accept all major payment methods including eSewa, Khalti, major debit/credit cards, and mobile banking from various Nepali banks.",
      },
      {
        question: "Is it safe to pay online on ShuvMarg?",
        answer: "Absolutely. We use industry-standard encryption and secure payment gateways to ensure all your transactions are 100% safe and secure.",
      },
    ],
  },
  {
    id: "cancellation",
    label: "Cancellation & Refund",
    faqs: [
      {
        question: "How can I cancel my bus ticket?",
        answer: "You can cancel your ticket by visiting the 'Cancel Ticket' section on our website. Enter your ticket details to proceed with the cancellation. Cancellation charges may apply based on the operator's policy.",
      },
      {
        question: "When will I get my refund after cancellation?",
        answer: "Eligible refunds can be credited instantly to Shuvmarg Money or returned to the original payment source after provider settlement. The available options are shown for your cancellation.",
      },
    ],
  },
  {
    id: "insurance",
    label: "Insurance",
    faqs: [
      {
        question: "Does ShuvMarg provide travel insurance?",
        answer: "Yes, you can opt for travel insurance during the checkout process for a small additional fee. It covers medical emergencies, baggage loss, and trip delays.",
      },
    ],
  },
];

export default function FAQSection() {
  const [activeTab, setActiveTab] = useState(faqData[0].id);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const activeCategory = faqData.find((cat) => cat.id === activeTab) || faqData[0];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setOpenFaqIndex(0); // Open the first FAQ of the new tab by default
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-16 md:py-24">
      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-[#1f2937] mb-8">
        Online Bus Booking FAQ&apos;s
      </h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-8">
        {faqData.map((category) => {
          const isActive = activeTab === category.id;
          return (
            <button
              key={category.id}
              onClick={() => handleTabClick(category.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors border ${
                isActive
                  ? "border-[#7A1D1B] text-[#7A1D1B] bg-white"
                  : "border-gray-300 text-gray-500 hover:border-gray-400 bg-white"
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      {/* FAQ Container */}
      <div className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
        {activeCategory.faqs.map((faq, index) => {
          const isOpen = openFaqIndex === index;
          return (
            <div
              key={index}
              className={`border-b border-gray-100 last:border-b-0`}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors focus:outline-none"
              >
                <span className="font-semibold text-[#1f2937] text-base">
                  {faq.question}
                </span>
                <span className="flex-shrink-0">
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#7A1D1B]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </span>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6 text-gray-500 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
