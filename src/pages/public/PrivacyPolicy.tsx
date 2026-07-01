import { Shield, Eye, Lock, Users, RefreshCw, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { SEO } from "@/components/shared/SEO";

const sections = [
  {
    icon: Shield,
    title: "Information We Collect",
    text: "We collect information that you provide during registration, vehicle enquiry, and account setup. This may include your name, phone number, email address, city, and vehicle preferences.",
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    points: [
      "To verify your identity and connect you with verified dealers.",
      "To share your enquiry details with the relevant dealership.",
      "To send important updates about your enquiries and account.",
      "To improve our platform and personalize your experience.",
    ],
  },
  {
    icon: Users,
    title: "Information Sharing",
    text: "We share information only with verified dealers required to respond to your enquiry. We do not sell your personal data to third parties. We may also disclose information to comply with legal requirements or protect our rights.",
  },
  {
    icon: Lock,
    title: "Security",
    text: "We use industry-standard security practices to protect your data, including encrypted storage and secure connections. However, no system is completely risk-free, so we recommend keeping your account credentials confidential and notifying us of suspicious activity.",
  },
  {
    icon: RefreshCw,
    title: "Policy Updates",
    text: "We may update this policy from time to time. When we do, we will post the updated version on this page. Continued use of our services after updates means you accept the new policy terms.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/30 via-white to-rose-50/30">
      <SEO
        title="Privacy Policy — Caryanam"
        description="At Caryanam, we respect your privacy and are committed to protecting your personal information."
      />

      {/* Header */}
      <section className="mx-auto max-w-6xl px-6 sm:px-8 pt-16 pb-12 lg:pt-24 lg:pb-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="text-center max-w-5xl mx-auto"
        >
          <span className="inline-block text-rose-900 text-4xl font-bold uppercase tracking-widest mb-4">
            Privacy Policy
          </span>

          <p className="mt-6 text-lg sm:text-xl text-slate-500 leading-relaxed  mx-auto">
            At Caryanam, we respect your privacy and are committed to protecting
            your personal information. This policy explains how we collect, use,
            and safeguard the data you share with us.
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-20 space-y-6">
        {sections.map(({ icon: Icon, title, text, points }, idx) => (
          <motion.div
            key={title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-7 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/15">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            </div>

            {text && (
              <p className="text-slate-600 text-[15px] leading-relaxed">
                {text}
              </p>
            )}

            {points && (
              <ul className="space-y-2.5">
                {points.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-slate-600 text-[15px] leading-relaxed"
                  >
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        ))}


      </div>
    </div>
  );
}
