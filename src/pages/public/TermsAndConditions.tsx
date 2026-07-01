import {
  FileText,
  ShoppingCart,
  AlertTriangle,
  Scale,
  Globe,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";
import { SEO } from "@/components/shared/SEO";

const sections = [
  {
    icon: ShoppingCart,
    title: "Use of the Platform",
    content: [
      "Caryanam provides an online marketplace for buying and selling used vehicles in India. You may use our platform solely for lawful purposes.",
      "You must be at least 18 years of age to create an account or submit enquiries on Caryanam.",
      "You agree not to misuse the platform for fraudulent listings, spam, harassment, or any activity that violates applicable laws.",
      "Caryanam reserves the right to suspend or terminate accounts that violate these terms without prior notice.",
      "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
    ],
  },
  {
    icon: FileText,
    title: "Dealer Listings & Responsibilities",
    content: [
      "Dealers are solely responsible for the accuracy, completeness, and legality of their vehicle listings.",
      "All vehicles listed must be legally owned and fit for sale. Listing stolen, encumbered, or misrepresented vehicles is strictly prohibited.",
      "Caryanam performs verification checks on dealers but does not independently verify every listing detail. Buyers are encouraged to inspect vehicles before purchase.",
      "Dealers must not post misleading prices, fake images, or fabricated specifications.",
      "Caryanam reserves the right to remove any listing that violates our content standards, without notice or liability.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Disclaimers & Limitation of Liability",
    content: [
      "Caryanam is a marketplace platform and is NOT a party to any transaction between buyers and dealers.",
      "We do not guarantee the accuracy of vehicle listings, dealer representations, or the outcome of any transaction.",
      "Caryanam is not responsible for any loss, damage, or dispute arising from a vehicle purchase or any interaction between users and dealers.",
      'Our platform is provided "as is" without warranties of any kind, express or implied, including fitness for a particular purpose.',
      "In no event shall Caryanam's total liability exceed the amount, if any, paid by you to Caryanam in the six months preceding the claim.",
    ],
  },
  {
    icon: Globe,
    title: "Intellectual Property",
    content: [
      "All content on Caryanam — including the logo, design, text, graphics, and software — is the property of Caryanam Technologies Pvt. Ltd. and protected by Indian copyright law.",
      "You may not copy, reproduce, distribute, or create derivative works from any part of the platform without written permission.",
      "Vehicle images uploaded by dealers remain the property of the respective dealers. By uploading, you grant Caryanam a non-exclusive licence to display them on the platform.",
      "Trademarks of third-party brands mentioned on the site belong to their respective owners.",
    ],
  },
  {
    icon: Scale,
    title: "Governing Law & Disputes",
    content: [
      "These Terms are governed by the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts of Mumbai, Maharashtra.",
      "We encourage you to contact us first to resolve disputes amicably before pursuing legal action.",
      "If any provision of these Terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.",
      "These Terms constitute the entire agreement between you and Caryanam regarding use of the platform.",
    ],
  },
];

function renderLine(line: string) {
  const parts = line.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-slate-900">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/30 via-white to-rose-50/30">
      <SEO
        title="Terms & Conditions — Caryanam"
        description="Read Caryanam's terms and conditions for using our used car marketplace platform in India."
      />

      {/* Header — same style as About page */}
      <section className="mx-auto max-w-6xl px-6 sm:px-8 pt-16 pb-12 lg:pt-24 lg:pb-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="text-center max-w-5xl mx-auto"
        >
          <span className="inline-block text-rose-900 text-4xl font-bold uppercase tracking-widest mb-4">
            Terms & Conditions
          </span>
          <p className="mt-6 text-lg sm:text-xl text-slate-500 leading-relaxed max-w-5xl mx-auto">
            Please read these terms carefully before using Caryanam. By accessing
            or using our platform, you agree to be bound by these conditions.
          </p>

        </motion.div>
      </section>



      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-20 space-y-6">


        {sections.map(({ icon: Icon, title, content }, idx) => (
          <motion.div
            key={title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-7 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl gradient-primary text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/15">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            </div>
            <ul className="space-y-3">
              {content.map((line, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-slate-600 text-[15px] leading-relaxed"
                >
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                  <span>{renderLine(line)}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}




      </div>
    </div>
  );
}
