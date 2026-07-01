import { Shield, Users, MapPin, Star, TrendingUp, Award, ArrowRight, CheckCircle2, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SEO } from "@/components/shared/SEO";

const stats = [
  { label: "Cars Listed", value: "50,000+", icon: TrendingUp, color: "bg-rose-50 text-rose-900 border-rose-100" },
  { label: "Verified Dealers", value: "1,200+", icon: Shield, color: "bg-amber-50 text-amber-800 border-amber-100" },
  { label: "Cities Covered", value: "150+", icon: MapPin, color: "bg-emerald-50 text-emerald-800 border-emerald-100" },
  { label: "Happy Customers", value: "2 Lakh+", icon: Users, color: "bg-violet-50 text-violet-800 border-violet-100" },
];

const values = [
  {
    icon: Shield,
    title: "Trust & Transparency",
    desc: "Every vehicle listing goes through a rigorous verification process. No hidden costs, no surprises — just honest deals.",
    accent: "from-rose-500 to-rose-600",
  },
  {
    icon: Star,
    title: "Customer First",
    desc: "We put buyers and sellers at the center of everything we do. Our platform is built to make your journey smooth and stress-free.",
    accent: "from-amber-500 to-amber-600",
  },
  {
    icon: Award,
    title: "Quality Dealers",
    desc: "We partner only with certified dealerships who maintain high standards of service, ensuring you get the best experience every time.",
    accent: "from-emerald-500 to-emerald-600",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    desc: "We constantly improve our platform with cutting-edge technology to give you the fastest, smartest car-buying experience in India.",
    accent: "from-violet-500 to-violet-600",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/30 via-white to-rose-50/30 ">
      <SEO
        title="About Us — India's Trusted Marketplace | Caryanam"
        description="Learn about Caryanam's mission to make buying and selling used cars in India simple, safe, and transparent. Connecting buyers with verified dealers."
      />

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 1 — Full-Width Intro (White)        */}
      {/* ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl  px-6 sm:px-8 pt-16 pb-12 lg:pt-24 lg:pb-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="text-center max-w-5xl mx-auto"
        >
          <span className="inline-block text-rose-900 text-4xl font-semibold uppercase tracking-widest mb-4">
            About Caryanam
          </span>

          <p className="mt-6 text-lg sm:text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-25xl mx-auto">
            Caryanam was founded with a single mission — to make buying and
            selling used cars in India simple, safe, and transparent. We connect
            lakhs of buyers with verified dealers across 150+ cities.
          </p>
        </motion.div>
      </section>



      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 3 — Mission (Two Columns)           */}
      {/* ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-6 sm:px-8 pb-20 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="text-rose-600 dark:text-rose-400 text-sm font-semibold uppercase tracking-widest">
              Our Mission
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Making Every Car Purchase a Confident Decision
            </h2>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
              The used car market in India has historically been plagued by
              uncertainty — unknown vehicle history, inflated prices, and
              untrustworthy sellers. Caryanam was built to fix this.
            </p>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
              We built a platform where every listing is dealer-verified,
              pricing is transparent, and buyers can connect directly with
              sellers. Whether you're looking for your first car or upgrading
              your ride, Caryanam puts the power back in your hands.
            </p>
          </motion.div>

          {/* Right — 2x2 stat cards grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map(({ label, value, icon: Icon, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 select-none"
              >
                <div className={`w-11 h-11 rounded-2xl ${color} border flex items-center justify-center shrink-0 dark:bg-slate-800 dark:border-slate-700 dark:text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-none">
                    {value}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                    {label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 4 — Core Values                     */}
      {/* ═══════════════════════════════════════════ */}
      <section className="relative bg-black text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(239,68,68,0.06),transparent_60%)] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">
              Core Values
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight mt-2">
              What Drives Caryanam
            </h2>
            <p className="text-white/45 mt-3 text-sm font-light max-w-lg">
              The principles that guide every decision we make at Caryanam.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ icon: Icon, title, desc, accent }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group relative bg-white/[0.04] border border-white/[0.07] rounded-2xl p-7 hover:bg-white/[0.07] hover:border-rose-500/20 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 to-rose-500/0 group-hover:from-rose-500/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${accent} text-white grid place-items-center mb-5 shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-base mb-2 text-white">{title}</h3>
                <p className="text-sm text-white/45 leading-relaxed font-light">{desc}</p>
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-rose-500/0 to-transparent group-hover:via-rose-500/30 transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 6 — Call to Action                  */}
      {/* ═══════════════════════════════════════════ */}
      <section className="border-t border-slate-100 dark:border-slate-800/50 bg-gradient-to-t from-rose-50/40 via-white to-white dark:from-slate-900/30 dark:via-slate-950 dark:to-slate-950">
        <div className="mx-auto max-w-4xl px-6 sm:px-8 py-20 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Ready to Find Your Next Car?
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              Browse thousands of verified listings from trusted dealerships
              across India. Direct connections, honest transactions.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/cars"
                className="inline-flex items-center justify-center gap-2 h-13 px-8 rounded-2xl bg-rose-900 hover:bg-rose-800 text-white text-base font-bold shadow-lg shadow-rose-900/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                Browse Cars <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/premium-cars"
                className="inline-flex items-center justify-center gap-2 h-13 px-8 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base font-bold border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                Premium Collection <Star className="h-4 w-4 text-amber-500" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
