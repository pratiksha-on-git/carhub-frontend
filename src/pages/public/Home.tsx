import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, Variants } from "framer-motion";
import {
  Search,
  BadgeCheck,
  ShieldCheck,
  Zap,
  MessageSquare,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Icon,
  Headphones,
  Phone,
  Lock,
  Coins,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  VehicleCard,
  VehicleCardSkeleton,
} from "@/components/cards/VehicleCard";
import {
  FeaturedVehicleCard,
  FeaturedVehicleCardSkeleton,
} from "@/components/cards/FeaturedVehicleCard";
import { SEO } from "@/components/shared/SEO";
import { CAR_BRANDS, getModels, getVariants } from "@/data/carDatabase";
import { SearchableSelect } from "@/components/shared/SearchableSelect";
import { BUDGET_BANDS, QUICK_BRANDS, CITIES } from "@/utils/constants";
import { useState, useEffect, useRef } from "react";
import {
  useLatestVehicles,
  useFeaturedVehicles,
} from "@/hooks/public/useHomeVehicles";
import { useCustomer } from "@/hooks/public/useCustomerAuth";
import { AuthModal } from "@/components/shared/AuthModal";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Import brand logos
import kia from '@/assets/BrandLogo/kia.jpg';
import honda from "@/assets/BrandLogo/honda.png";
import hyundai from "@/assets/BrandLogo/hyundai.png";
import mahindra from "@/assets/BrandLogo/mahindra.webp";
import marutisuzuki from "@/assets/BrandLogo/maruti-suzuki.png";
import tata from "@/assets/BrandLogo/Tata.png";
import Toyota from "@/assets/BrandLogo/Toyota.avif";
import mg from "@/assets/BrandLogo/mg.png";

gsap.registerPlugin(ScrollTrigger);

const BRAND_LOGOS: Record<string, string> = {
  Hyundai: hyundai,
  "Maruti Suzuki": marutisuzuki,
  Tata: tata,
  Mahindra: mahindra,
  Toyota: Toyota,
  Honda: honda,
  Kia: kia,
  MG: mg,
};

const stats = [
  { label: "Verified Dealers", value: "500+" },
  { label: "Vehicles Listed", value: "25,000+" },
  { label: "Happy Customers", value: "1000+" },
  { label: "Monthly Visitors", value: "50,000+" },
];

const why = [
  {
    icon: BadgeCheck,
    title: "Verified Dealers",
    text: "Every dealer is KYC-verified and inspected before going live.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Listings",
    text: "Inventory checked for authenticity, ownership and condition.",
  },
  {
    icon: MessageSquare,
    title: "Direct Dealer Contact",
    text: "No middlemen. Talk to dealers directly via call or WhatsApp.",
  },
  {
    icon: Zap,
    title: "Fast Lead Delivery",
    text: "Dealers receive your enquiry in real-time for faster response.",
  },
];

// Framer Motion stagger container variants
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

type LayoutContextType = {
  images: HTMLImageElement[];
  loading: boolean;
  progress: number;
};

const SLIDES = [
  {
    subtitle: "Caryanam Showcase • 2026",
    title: "Experience",
    description: "India's premiere used-car dealer marketplace. Connect directly with verified dealers across India.",
    buttonText: "Search Cars",
    secondaryText: "Search inventory",
  },
  {
    subtitle: "KYC Verified Sellers • Direct Chat",
    title: "Connection",
    description: "Talk directly to verified dealers on WhatsApp or call them instantly with zero hidden commissions.",
    buttonText: "Dealer Login",
    secondaryText: "Contact dealers",
  },
  {
    subtitle: "Inspected Quality • History Checked",
    title: "Verification",
    description: "Every vehicle listed undergoes a registration papers check, history verification, and detailed inspection.",
    buttonText: "Register Now",
    secondaryText: "Start searching",
  }
];

const HUD_SLIDES = [
  {
    label1: "Live Status",
    value1: "50,000+ Cars Online",
    label2: "100% Certified",
    value2: "Verified Dealers",
  },
  {
    label1: "Direct Chat",
    value1: "Connect on WhatsApp",
    label2: "Zero Commission",
    value2: "Direct-to-Dealer Deals",
  },
  {
    label1: "Inspection Check",
    value1: "150-Point Checked",
    label2: "Approved History",
    value2: "RTO Verification Passed",
  },
];

function splitTextIntoLines(element: HTMLElement) {
  const text = element.innerText;
  const words = text.split(" ");
  element.innerHTML = words.map(w => `<span class="word" style="display: inline-block;">${w}</span>`).join(" ");

  const wordSpans = element.querySelectorAll(".word") as NodeListOf<HTMLElement>;
  const lines: HTMLElement[][] = [];
  let currentLine: HTMLElement[] = [];
  let lastOffsetTop = -1;

  wordSpans.forEach(span => {
    const offsetTop = span.offsetTop;
    if (lastOffsetTop !== -1 && offsetTop !== lastOffsetTop) {
      lines.push(currentLine);
      currentLine = [];
    }
    currentLine.push(span);
    lastOffsetTop = offsetTop;
  });
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  element.innerHTML = "";
  lines.forEach(lineSpans => {
    const lineParent = document.createElement("div");
    lineParent.className = "line-parent";
    lineParent.style.overflow = "hidden";
    lineParent.style.display = "block";

    const lineChild = document.createElement("div");
    lineChild.className = "line-child";
    lineChild.style.display = "block";

    lineSpans.forEach((span, idx) => {
      lineChild.appendChild(span);
      if (idx < lineSpans.length - 1) {
        lineChild.appendChild(document.createTextNode(" "));
      }
    });

    lineParent.appendChild(lineChild);
    element.appendChild(lineParent);
  });
}

export default function Home() {
  const { images, loading } = useOutletContext<LayoutContextType>();

  const {
    vehicles: latestVehicles,
    loading: latestLoading,
    error: latestError,
    refetch: refetchLatest,
  } = useLatestVehicles();
  const {
    vehicles: featuredVehicles,
    loading: featuredLoading,
    error: featuredError,
    refetch: refetchFeatured,
  } = useFeaturedVehicles();

  const customer = useCustomer();
  const isLoggedIn = !!customer;
  const [authOpen, setAuthOpen] = useState(false);

  const featured = featuredVehicles.slice(0, 8);
  const latest = latestVehicles.slice(0, 12);

  const navigate = useNavigate();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [variant, setVariant] = useState("");
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [year, setYear] = useState("");

  const models = brand ? getModels(brand) : [];
  const variants = brand && model ? getVariants(brand, model) : [];

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const featuredMarqueeRef = useRef<HTMLDivElement>(null);

  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaBtnRef = useRef<HTMLButtonElement>(null);
  const secBtnRef = useRef<HTMLButtonElement>(null);

  const currentSlideRef = useRef<number>(0);
  const activeTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const entryTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const updateContentSync = (targetIndex: number) => {
    const slideData = SLIDES[targetIndex];
    if (!slideData) return;

    if (subtitleRef.current) {
      subtitleRef.current.innerText = slideData.subtitle;
    }

    if (titleRef.current) {
      titleRef.current.innerHTML = "";
      slideData.title.split("").forEach(char => {
        const span = document.createElement("span");
        span.innerText = char === " " ? "\u00A0" : char;
        span.style.display = "inline-block";
        titleRef.current!.appendChild(span);
      });
    }

    if (descRef.current) {
      descRef.current.innerText = slideData.description;
      splitTextIntoLines(descRef.current);
    }

    if (ctaBtnRef.current) {
      const hudData = HUD_SLIDES[targetIndex];
      if (hudData) {
        const lbl1 = ctaBtnRef.current.querySelector(".hud-label-1");
        const val1 = ctaBtnRef.current.querySelector(".hud-value-1");
        const lbl2 = ctaBtnRef.current.querySelector(".hud-label-2");
        const val2 = ctaBtnRef.current.querySelector(".hud-value-2");
        if (lbl1) (lbl1 as HTMLElement).innerText = hudData.label1;
        if (val1) (val1 as HTMLElement).innerText = hudData.value1;
        if (lbl2) (lbl2 as HTMLElement).innerText = hudData.label2;
        if (val2) (val2 as HTMLElement).innerText = hudData.value2;
      }
    }

    if (secBtnRef.current) {
      const btnSpan = secBtnRef.current.querySelector("span");
      if (btnSpan) btnSpan.innerText = slideData.secondaryText;
    }
  };

  const transitionToSlide = (targetIndex: number) => {
    const subtitle = subtitleRef.current;
    const title = titleRef.current;
    const desc = descRef.current;
    const ctaBtn = ctaBtnRef.current;
    const secBtn = secBtnRef.current;

    // If an animation is already running, immediately kill it, swap content, and enter it directly
    if (activeTimelineRef.current || entryTimelineRef.current) {
      if (activeTimelineRef.current) activeTimelineRef.current.kill();
      if (entryTimelineRef.current) entryTimelineRef.current.kill();

      updateContentSync(targetIndex);

      const enterDuration = 0.9;
      const enterEase = "power4.out";
      const newTitleChars = title ? title.querySelectorAll("span") : [];
      const newDescLines = desc ? desc.querySelectorAll(".line-child") : [];

      gsap.set([subtitle, ctaBtn, secBtn], { y: 70, opacity: 0, filter: "blur(10px)", scale: 0.95 });
      gsap.set(newTitleChars, { y: 70, opacity: 0, filter: "blur(10px)", scale: 0.95, rotation: 8 });
      gsap.set(newDescLines, { y: 70, opacity: 0, filter: "blur(10px)", scale: 0.95 });

      const entryTl = gsap.timeline({
        onComplete: () => {
          entryTimelineRef.current = null;
        }
      });
      entryTimelineRef.current = entryTl;
      entryTl.add("enterStart");

      if (subtitle) {
        entryTl.to(subtitle, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          duration: enterDuration,
          ease: enterEase,
        }, "enterStart");
      }

      if (title) {
        entryTl.to(newTitleChars, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          rotation: 0,
          duration: enterDuration,
          ease: enterEase,
          stagger: 0.02,
        }, "enterStart+=0.08");
      }

      if (desc) {
        entryTl.to(newDescLines, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          duration: enterDuration,
          ease: enterEase,
          stagger: 0.06,
        }, "enterStart+=0.15");
      }

      if (ctaBtn) {
        entryTl.to(ctaBtn, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          duration: enterDuration,
          ease: enterEase,
        }, "enterStart+=0.22");
      }

      if (secBtn) {
        entryTl.to(secBtn, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          duration: enterDuration,
          ease: enterEase,
        }, "enterStart+=0.22");
      }

      activeTimelineRef.current = null;
      return;
    }

    const titleChars = title ? title.querySelectorAll("span") : [];
    const descLines = desc ? desc.querySelectorAll(".line-child") : [];

    const tl = gsap.timeline({
      onComplete: () => {
        activeTimelineRef.current = null;
      }
    });

    activeTimelineRef.current = tl;

    // 1. EXIT CURRENT ELEMENTS
    const exitDuration = 0.38;
    const exitEase = "power2.in";

    tl.to([subtitle, titleChars, descLines, ctaBtn, secBtn], {
      y: -60,
      scale: 0.96,
      opacity: 0,
      filter: "blur(8px)",
      duration: exitDuration,
      ease: exitEase,
      stagger: 0.02,
    });

    // 2. UPDATE CONTENT & RUN ENTRY ANIMATION
    tl.call(() => {
      updateContentSync(targetIndex);

      const enterDuration = 0.9;
      const enterEase = "power4.out";

      const newTitleChars = title ? title.querySelectorAll("span") : [];
      const newDescLines = desc ? desc.querySelectorAll(".line-child") : [];

      gsap.set([subtitle, ctaBtn, secBtn], { y: 70, opacity: 0, filter: "blur(10px)", scale: 0.95 });
      gsap.set(newTitleChars, { y: 70, opacity: 0, filter: "blur(10px)", scale: 0.95, rotation: 8 });
      gsap.set(newDescLines, { y: 70, opacity: 0, filter: "blur(10px)", scale: 0.95 });

      const entryTl = gsap.timeline({
        onComplete: () => {
          entryTimelineRef.current = null;
        }
      });
      entryTimelineRef.current = entryTl;

      entryTl.add("enterStart");

      if (subtitle) {
        entryTl.to(subtitle, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          duration: enterDuration,
          ease: enterEase,
        }, "enterStart");
      }

      if (title) {
        entryTl.to(newTitleChars, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          rotation: 0,
          duration: enterDuration,
          ease: enterEase,
          stagger: 0.02,
        }, "enterStart+=0.08");
      }

      if (desc) {
        entryTl.to(newDescLines, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          duration: enterDuration,
          ease: enterEase,
          stagger: 0.06,
        }, "enterStart+=0.15");
      }

      if (ctaBtn) {
        entryTl.to(ctaBtn, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          duration: enterDuration,
          ease: enterEase,
        }, "enterStart+=0.22");
      }

      if (secBtn) {
        entryTl.to(secBtn, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          duration: enterDuration,
          ease: enterEase,
        }, "enterStart+=0.22");
      }
    });
  };

  const transitionToSlideRef = useRef(transitionToSlide);
  useEffect(() => {
    transitionToSlideRef.current = transitionToSlide;
  });

  const handleCtaClick = () => {
    const idx = currentSlideRef.current;
    if (idx === 0 || idx === 2) {
      document.getElementById("search-section")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/auth/login");
    }
  };

  const handleSecondaryClick = () => {
    document.getElementById("search-section")?.scrollIntoView({ behavior: "smooth" });
  };

  // Frame sequence draw loop (ScrollTrigger based)
  useEffect(() => {
    if (loading || images.length === 0 || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = 1920;
    canvas.height = 1080;

    const renderFrame = (frameIndex: number) => {
      const img = images[frameIndex];
      if (!img) return;

      context.clearRect(0, 0, canvas.width, canvas.height);

      const canvasAspect = canvas.width / canvas.height;
      const imgAspect = img.width / img.height;
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let drawX = 0;
      let drawY = 0;

      if (imgAspect > canvasAspect) {
        drawWidth = canvas.height * imgAspect;
        drawX = (canvas.width - drawWidth) / 2;
      } else {
        drawHeight = canvas.width / imgAspect;
        drawY = (canvas.height - drawHeight) / 2;
      }

      context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    };

    renderFrame(0);

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.15,
      onUpdate: (self) => {
        const frameIndex = Math.min(
          images.length - 1,
          Math.max(0, Math.floor(self.progress * images.length))
        );
        renderFrame(frameIndex);

        // Update active slide phases
        let targetSlide = 0;
        if (self.progress < 0.33) {
          targetSlide = 0;
        } else if (self.progress >= 0.33 && self.progress < 0.68) {
          targetSlide = 1;
        } else {
          targetSlide = 2;
        }

        if (targetSlide !== currentSlideRef.current) {
          transitionToSlideRef.current(targetSlide);
          currentSlideRef.current = targetSlide;
        }
      },
    });

    const handleResize = () => {
      renderFrame(Math.min(images.length - 1, Math.max(0, Math.floor(trigger.progress * images.length))));
    };
    window.addEventListener("resize", handleResize);

    return () => {
      trigger.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, [loading, images]);

  // Initial animation & Resize logic
  useEffect(() => {
    const slideData = SLIDES[0];
    if (subtitleRef.current) {
      subtitleRef.current.innerText = slideData.subtitle;
    }
    if (titleRef.current) {
      titleRef.current.innerHTML = "";
      slideData.title.split("").forEach(char => {
        const span = document.createElement("span");
        span.innerText = char === " " ? "\u00A0" : char;
        span.style.display = "inline-block";
        titleRef.current!.appendChild(span);
      });
    }
    if (descRef.current) {
      descRef.current.innerText = slideData.description;
      splitTextIntoLines(descRef.current);
    }
    if (ctaBtnRef.current) {
      const hudData = HUD_SLIDES[0];
      if (hudData) {
        const lbl1 = ctaBtnRef.current.querySelector(".hud-label-1");
        const val1 = ctaBtnRef.current.querySelector(".hud-value-1");
        const lbl2 = ctaBtnRef.current.querySelector(".hud-label-2");
        const val2 = ctaBtnRef.current.querySelector(".hud-value-2");
        if (lbl1) (lbl1 as HTMLElement).innerText = hudData.label1;
        if (val1) (val1 as HTMLElement).innerText = hudData.value1;
        if (lbl2) (lbl2 as HTMLElement).innerText = hudData.label2;
        if (val2) (val2 as HTMLElement).innerText = hudData.value2;
      }
    }
    if (secBtnRef.current) {
      const span = secBtnRef.current.querySelector("span");
      if (span) span.innerText = slideData.secondaryText;
    }

    const ctx = gsap.context(() => {
      const initTimeline = gsap.timeline();

      gsap.set([subtitleRef.current, ctaBtnRef.current, secBtnRef.current], {
        y: 70,
        opacity: 0,
        filter: "blur(10px)",
        scale: 0.95,
      });

      if (titleRef.current) {
        gsap.set(titleRef.current.querySelectorAll("span"), {
          y: 70,
          opacity: 0,
          filter: "blur(10px)",
          scale: 0.95,
          rotation: 8,
        });
      }

      if (descRef.current) {
        gsap.set(descRef.current.querySelectorAll(".line-child"), {
          y: 70,
          opacity: 0,
          filter: "blur(10px)",
          scale: 0.95,
        });
      }

      initTimeline.add("start");

      if (subtitleRef.current) {
        initTimeline.to(subtitleRef.current, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          duration: 0.9,
          ease: "power4.out",
        }, "start");
      }

      if (titleRef.current) {
        initTimeline.to(titleRef.current.querySelectorAll("span"), {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          rotation: 0,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.02,
        }, "start+=0.08");
      }

      if (descRef.current) {
        initTimeline.to(descRef.current.querySelectorAll(".line-child"), {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.06,
        }, "start+=0.15");
      }

      if (ctaBtnRef.current) {
        initTimeline.to(ctaBtnRef.current, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          duration: 0.9,
          ease: "power4.out",
        }, "start+=0.22");
      }

      if (secBtnRef.current) {
        initTimeline.to(secBtnRef.current, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          duration: 0.9,
          ease: "power4.out",
        }, "start+=0.22");
      }
    });

    const handleResize = () => {
      if (!descRef.current) return;
      const currentSlideData = SLIDES[currentSlideRef.current];
      if (!currentSlideData) return;
      descRef.current.innerText = currentSlideData.description;
      splitTextIntoLines(descRef.current);
      gsap.set(descRef.current.querySelectorAll(".line-child"), {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", handleResize);
      if (activeTimelineRef.current) {
        activeTimelineRef.current.kill();
      }
    };
  }, []);

  // Magnetic Button Hover Effects
  useEffect(() => {
    const ctaBtn = ctaBtnRef.current;
    const secBtn = secBtnRef.current;

    const onCtaMove = (e: MouseEvent) => {
      if (!ctaBtn) return;
      const rect = ctaBtn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(ctaBtn, {
        x: x * 0.35,
        y: y * 0.35,
        scale: 1.05,
        boxShadow: "0 10px 25px rgba(244, 63, 94, 0.45)",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const onCtaLeave = () => {
      if (!ctaBtn) return;
      gsap.to(ctaBtn, {
        x: 0,
        y: 0,
        scale: 1,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        duration: 0.5,
        ease: "elastic.out(1, 0.5)",
      });
    };

    const onSecMove = (e: MouseEvent) => {
      if (!secBtn) return;
      const rect = secBtn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(secBtn, {
        x: x * 0.25,
        y: y * 0.25,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const onSecLeave = () => {
      if (!secBtn) return;
      gsap.to(secBtn, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "elastic.out(1, 0.5)",
      });
    };

    if (ctaBtn) {
      ctaBtn.addEventListener("mousemove", onCtaMove);
      ctaBtn.addEventListener("mouseleave", onCtaLeave);
    }

    if (secBtn) {
      secBtn.addEventListener("mousemove", onSecMove);
      secBtn.addEventListener("mouseleave", onSecLeave);
    }

    return () => {
      if (ctaBtn) {
        ctaBtn.removeEventListener("mousemove", onCtaMove);
        ctaBtn.removeEventListener("mouseleave", onCtaLeave);
      }
      if (secBtn) {
        secBtn.removeEventListener("mousemove", onSecMove);
        secBtn.removeEventListener("mouseleave", onSecLeave);
      }
    };
  }, []);

  const scrollCarousel = (direction: "left" | "right") => {
    const container = featuredMarqueeRef.current;
    if (!container) return;

    const scrollAmount = container.offsetWidth;
    const targetScroll = container.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount);

    gsap.to(container, {
      scrollLeft: targetScroll,
      duration: 0.6,
      ease: "power2.out"
    });
  };

  // GSAP Auto paging scroll loop for Featured Cards (pauses on hover)
  useEffect(() => {
    const container = featuredMarqueeRef.current;
    if (!container || featured.length === 0) return;

    let intervalId: NodeJS.Timeout;
    let isHovered = false;

    const autoPlay = () => {
      if (isHovered) return;

      const maxScroll = container.scrollWidth - container.offsetWidth;
      let targetScroll = container.scrollLeft + container.offsetWidth;

      // Wrap back to beginning if we reached the end
      if (container.scrollLeft >= maxScroll - 10) {
        targetScroll = 0;
      }

      gsap.to(container, {
        scrollLeft: targetScroll,
        duration: 0.7,
        ease: "power2.out"
      });
    };

    intervalId = setInterval(autoPlay, 5000);

    const handleMouseEnter = () => { isHovered = true; };
    const handleMouseLeave = () => { isHovered = false; };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearInterval(intervalId);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [featured, featuredLoading]);

  const handleBrandChange = (v: string) => {
    setBrand(v);
    setModel("");
    setVariant("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (brand) params.set("brand", brand);
    if (year) params.set("minYear", year);
    navigate(`/cars?${params.toString()}`);
  };

  return (
    <>
      <SEO
        title="Caryanam — Verified Used Cars from Trusted Dealers"
        description="Browse thousands of verified used cars from 500+ trusted dealers across 150+ Indian cities. Direct dealer contact, no middlemen."
      />

      {/* GSAP Scroll Pinned Sequence */}
      <div ref={containerRef} className="relative h-[350vh] bg-slate-950">
        {/* Sticky viewport container (holds the canvas and fixed corner slides HUD) */}
        <div className="sticky top-0 h-screen w-full z-0 overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full object-cover" />

          {/* <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.4)_1.5px,transparent_1.5px)] [background-size:10px_10px] z-[2] pointer-events-none" /> */}

          {/* Narrative Slides (Fixed absolute overlays inside sticky viewport wrapper) */}
          <div className="absolute inset-0 z-10 flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none">

            {/* Top-Left: Title/Showcase text */}
            <div className="absolute top-28 left-8 sm:left-12 sm:top-32 z-10 pointer-events-auto text-white">
              <div className="overflow-hidden">
                <p
                  ref={subtitleRef}
                  className="text-xs uppercase tracking-[0.25em] font-black text-rose-500 font-sans"
                >
                  Caryanam  • 2026
                </p>
              </div>
              <div className="overflow-hidden mt-1">
                <h2
                  ref={titleRef}
                  className="font-display text-4xl sm:text-5xl md:text-4xl font-black tracking-tight"
                >
                  Experience
                </h2>
              </div>
            </div>

            {/* Top-Right: Premium Trust badge / HUD Widget */}
            <div
              ref={ctaBtnRef as any}
              className="absolute top-28 right-8 sm:right-12 sm:top-32 z-10 pointer-events-auto hidden lg:flex flex-col items-end gap-2.5"
            >
              <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-5 py-3 rounded-2xl shadow-2xl hover:scale-105 hover:bg-black/60 transition-all duration-300">
                <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                <div className="text-left select-none">
                  <div className="hud-label-1 text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Live Status</div>
                  <div className="hud-value-1 text-xs font-bold text-white mt-0.5">50,000+ Cars Online</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-5 py-3 rounded-2xl shadow-2xl hover:scale-105 hover:bg-black/60 transition-all duration-300">
                <div className="h-5 w-5 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                  <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <div className="text-left select-none">
                  <div className="hud-label-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">100% Certified</div>
                  <div className="hud-value-2 text-xs font-bold text-white mt-0.5">Verified Dealers</div>
                </div>
              </div>
            </div>

            {/* Bottom-Left: Quick Search inputs container */}
            <div className="absolute bottom-10 left-8 sm:left-12 z-10 pointer-events-auto w-full max-w-xs sm:max-w-xs md:max-w-sm bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 block mb-3">Quick Search</span>
              <form onSubmit={submit} className="flex flex-col gap-3">
                {/* Line 1: Search Input & Icon-Only Button */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search model, variant..."
                    className="flex-1 h-10 px-3 bg-white/5 border border-white/10 text-white rounded-xl placeholder-white/40 focus:outline-none focus:border-rose-500/50 focus:bg-white/10 transition-colors text-sm"
                  />
                  <button
                    type="submit"
                    className="h-10 w-10 flex items-center justify-center bg-rose-900 hover:bg-rose-800 text-white rounded-xl shadow-md shadow-rose-900/20 hover:shadow-rose-900/40 hover:-translate-y-0.5 active:translate-y-0 transition-all shrink-0 cursor-pointer"
                    aria-label="Search"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>

                {/* Line 2: Brand and Year Selects */}
                <div className="grid grid-cols-2 gap-3">
                  <Select value={brand} onValueChange={handleBrandChange}>
                    <SelectTrigger className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl h-10 transition-colors">
                      <SelectValue placeholder="Brand" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                      {CAR_BRANDS.map((b) => (
                        <SelectItem key={b} value={b} className="hover:bg-rose-900/40 focus:bg-rose-900/40">
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl h-10 transition-colors">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                      {Array.from({ length: 12 }, (_, i) => (2026 - i).toString()).map((y) => (
                        <SelectItem key={y} value={y} className="hover:bg-rose-900/40 focus:bg-rose-900/40">
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </form>
            </div>

            <div className="absolute bottom-8 right-8 lg:right-12 z-10 pointer-events-auto text-white max-w-[280px] sm:max-w-xs md:max-w-sm lg:max-w-md hidden lg:block">
              <p
                ref={descRef}
                className="text-xs sm:text-sm md:text-base text-white leading-relaxed font-light"
              >
                India's premiere used-car dealer marketplace. We connect buyers directly with verified dealers across 150+ Indian cities. Browse our curated selection of 25,000+ hand-picked premium vehicles certified for quality and ownership.
              </p>
            </div>

          </div>

        </div>
      </div>






      <Section
        title="Featured Vehicles"
        subtitle="Hand-picked premium listings from our top dealers"
        link="/cars"
        className="bg-white dark:bg-slate-950"
      >
        {featuredLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <FeaturedVehicleCardSkeleton key={i} />
            ))}
          </div>
        ) : featuredError ? (
          <div className="text-center py-8 rounded-2xl bg-slate-50 border border-slate-100 p-6">
            <p className="text-red-500 font-medium">{featuredError}</p>
            <Button
              size="sm"
              onClick={() => refetchFeatured()}
              className="mt-3 bg-rose-900 hover:bg-rose-800 text-white border-0 rounded-xl"
            >
              Try Again
            </Button>
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500">No featured vehicles available.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featured.slice(0, 6).map((v) => (
              <motion.div key={v.id} variants={cardVariants}>
                <FeaturedVehicleCard
                  vehicle={v}
                  isLoggedIn={isLoggedIn}
                  onWishlistRequireLogin={() => setAuthOpen(true)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </Section>

      {/* Browse by Brand */}
      <section className="bg-background py-16 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Browse by Brand"
            subtitle="Find your favourite make from India's leading manufacturers"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mt-8">
            {QUICK_BRANDS.map((b, idx) => (
              <motion.div
                key={b}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Link to={`/cars?brand=${encodeURIComponent(b)}`}>
                  <Card className="hover:shadow-premium hover:border-rose-900/40 transition-all duration-300 hover:-translate-y-1 rounded-2xl border border-border/70 group bg-card">
                    <CardContent className="p-5 text-center flex flex-col items-center justify-center">
                      <div className="w-14 h-14 rounded-full overflow-hidden border border-border/50 flex items-center justify-center bg-white p-1 group-hover:border-rose-900/20 group-hover:scale-105 transition-all">
                        <img
                          src={BRAND_LOGOS[b]}
                          alt={`${b} logo`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="mt-3 text-sm font-bold text-foreground group-hover:text-rose-900 transition-colors">{b}</div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Listings */}
      <Section
        title="Latest Listings"
        subtitle="Fresh inventory updated daily"
        link="/cars"
        className="bg-white"
      >
        {latestLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <VehicleCardSkeleton key={i} />
            ))}
          </div>
        ) : latestError ? (
          <div className="text-center py-8 rounded-2xl bg-slate-50 border border-slate-100 p-6">
            <p className="text-red-500 font-medium">{latestError}</p>
            <Button
              size="sm"
              onClick={() => refetchLatest()}
              className="mt-3 gradient-primary text-white border-0 hover:opacity-90 rounded-xl"
            >
              Try Again
            </Button>
          </div>
        ) : latest.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500">
              No vehicles available at the moment.
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {latest.map((v) => (
              <motion.div key={v.id} variants={cardVariants}>
                <VehicleCard
                  vehicle={v}
                  isLoggedIn={isLoggedIn}
                  onWishlistRequireLogin={() => setAuthOpen(true)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </Section>

      {/* Browse by Budget */}
      <section className="bg-background py-16 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Browse by Budget"
            subtitle="Pick a price range that fits you"
          />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
            {BUDGET_BANDS.map((b, idx) => (
              <motion.div
                key={b.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Link
                  to={`/cars?budget=${encodeURIComponent(b.label)}`}
                >
                  <Card className="hover:shadow-premium hover:border-rose-900/40 transition-all duration-300 hover:-translate-y-1 rounded-2xl border border-border/70 group bg-card">
                    <CardContent className="p-6">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        Budget Range
                      </div>
                      <div className="font-display font-black text-xl mt-1.5 text-slate-800 dark:text-white group-hover:text-rose-900 transition-colors">
                        {b.label}
                      </div>
                      <div className="text-xs text-rose-900 mt-4 flex items-center gap-1 font-bold group-hover:translate-x-1 transition-all">
                        Explore <ArrowRight className="h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dual Actions Section: Buy vs Sell */}
      <section className="py-20 bg-white border-t border-slate-100 dark:border-slate-800/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Get Started with Caryanam"
            subtitle="Choose the car that's true to you & luxury at every mile"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Left Card: Looking for a Car */}
            <div className="relative group rounded-[32px] overflow-hidden shadow-lg h-64 sm:h-72 flex flex-col justify-end p-8 text-white select-none border border-slate-150 dark:border-slate-800/30">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800')" }} />
              <div className="absolute inset-0 bg-black/45 group-hover:bg-black/50 transition-colors duration-300" />
              <div className="relative z-10 space-y-3 text-left">
                <span className="inline-block bg-rose-900 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg select-none">
                  For Buyers
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Are You Looking for a Car?</h3>
                <p className="text-white/90 text-sm font-light leading-relaxed max-w-xs">Find the perfect car that matches your style and budget.</p>
                <button
                  onClick={() => setAuthOpen(true)}
                  className="mt-4 inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-rose-900 font-black px-6 py-3 rounded-2xl text-sm transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-md select-none"
                >
                  Get Started <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right Card: Want to Sell a Car */}
            <div className="relative group rounded-[32px] overflow-hidden shadow-lg h-64 sm:h-72 flex flex-col justify-end p-8 text-white select-none border border-slate-150 dark:border-slate-800/30">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800')" }} />
              <div className="absolute inset-0 bg-black/45 group-hover:bg-black/50 transition-colors duration-300" />
              <div className="relative z-10 space-y-3 text-left">
                <span className="inline-block bg-rose-900 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg select-none">
                  For Sellers
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Do You Want to Sell a Car?</h3>
                <p className="text-white/90 text-sm font-light leading-relaxed max-w-xs">List your car for free and connect with genuine buyers.</p>
                <Link
                  to="/auth/login"
                  className="mt-4 inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-rose-900 font-black px-6 py-3 rounded-2xl text-sm transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer w-fit shadow-md select-none"
                >
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Trust/Benefit row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 pt-8 border-t border-slate-200 dark:border-slate-800/50">
            {[
              {
                title: "100% Verified Listings",
                description: "Trusted & verified sellers",
                icon: ShieldCheck,
              },
              {
                title: "Best Price Guarantee",
                description: "Get the best deal always",
                icon: Coins,
              },
              {
                title: "Easy Dealer Contact",
                description: "Connect with verified dealers",
                icon: Phone,
              },
              {
                title: "24/7 Customer Support",
                description: "We're here to help",
                icon: Headphones,
              },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3.5 text-left">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-rose-900/10 shadow-sm shadow-rose-900/5 flex items-center justify-center text-rose-900 dark:text-rose-450 shrink-0">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 dark:text-white leading-tight">{item.title}</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Section — dark panel design */}
      <section className="relative bg-black text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(239,68,68,0.06),transparent_60%)] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">Our Promise</span>
            <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight mt-2">Why Choose Caryanam</h2>
            <p className="text-white/45 mt-3 text-sm font-light max-w-lg">Built for buyers. Loved by dealers. Trusted across India.</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {why.map((w) => (
              <motion.div
                key={w.title}
                variants={cardVariants}
                className="group relative bg-white/4 border border-white/7 rounded-2xl p-7 hover:bg-white/7 hover:border-rose-500/20 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 to-rose-500/0 group-hover:from-rose-500/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
                <div className="w-12 h-12 rounded-2xl gradient-primary grid place-items-center text-white mb-5 shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform duration-300">
                  <w.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-base mb-2 text-white">{w.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed font-light">{w.text}</p>
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-rose-500/0 to-transparent group-hover:via-rose-500/30 transition-all duration-500" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mobile App Promo Section */}
      <section className="relative bg-[#fbf7f4] py-24 overflow-hidden border-t border-slate-100/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left Content Column */}
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-100 rounded-full px-3 py-1 text-md font-bold text-rose-600 w-fit select-none">
                <span>📱</span> Download Our App
              </div>
              <h2 className="font-display text-4xl md:text-4xl font-black tracking-tight text-slate-900 leading-[1.15]">
                Find Your Dream Car <br className="hidden sm:inline" />
                Faster With Our Mobile App
              </h2>
              <p className="text-black text-md max-w-xl">
                Browse verified listings, connect directly with trusted dealers, and manage your car buying journey anytime, anywhere. Experience faster search, instant updates, and zero brokerage.
              </p>

              {/* Benefits List */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 text-xs font-black shrink-0">
                    ✓
                  </div>
                  <span className="text-sm font-bold text-slate-800">Instant Car Alerts</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 text-xs font-black shrink-0">
                    ✓
                  </div>
                  <span className="text-sm font-bold text-slate-800">Direct Dealer Chat</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 text-xs font-black shrink-0">
                    ✓
                  </div>
                  <span className="text-sm font-bold text-slate-800">Save & Compare Vehicles</span>
                </div>
              </div>

              {/* Download Buttons Row */}
              <div className="flex flex-wrap gap-4 pt-4">
                <button className="bg-black text-white hover:bg-slate-900 rounded-2xl px-6 py-4 h-12 font-black text-xs uppercase tracking-wider shadow-lg shadow-black/10 flex items-center justify-center transition-all cursor-pointer hover:-translate-y-0.5 select-none">
                  Download for Android
                </button>
                <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-850 rounded-2xl px-6 py-4 h-12 font-black text-xs uppercase tracking-wider shadow-sm flex items-center justify-center transition-all cursor-pointer hover:-translate-y-0.5 select-none">
                  Download for iPhone
                </button>
              </div>
            </div>

            {/* Right Smartphone Mockup Column */}
            <div className="relative flex items-center justify-center lg:justify-end">



              {/* Device Container */}
              <div className="w-[300px] h-[600px] bg-slate-950 rounded-[44px] p-3.5 border-4 border-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] relative overflow-hidden select-none">

                {/* Punch hole camera / notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-950 rounded-full z-30" />

                {/* Inner Device Screen */}
                <div className="w-full h-full bg-[#fbf7f4] rounded-[32px] overflow-hidden relative p-4 flex flex-col justify-between border border-slate-900/10">

                  {/* Mockup Header Card */}
                  <div
                    className="text-white p-4 rounded-2xl text-left space-y-1 mt-6 shadow-md"
                    style={{ background: "linear-gradient(135deg, #e11d48 0%, #0f172a 100%)" }}
                  >
                    <div className="text-[8px] uppercase font-black tracking-widest text-rose-300">Welcome to</div>
                    <div className="text-lg font-black tracking-tight leading-none font-display">Caryanam</div>
                    <div className="text-[8px] text-slate-300 font-semibold">No Brokerage Car App</div>
                  </div>

                  {/* Mockup Car Preview Card */}
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2.5 mt-2">
                    <img
                      src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400"
                      alt="mockup car"
                      className="w-full aspect-video rounded-xl bg-rose-50 object-cover"
                    />
                    <div className="text-left">
                      <h4 className="font-bold text-xs text-slate-800 leading-none">Luxury SUV</h4>
                      <p className="text-[9px] text-slate-400 mt-1">New Delhi, Delhi</p>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                      <span className="text-[10px] font-black text-slate-800 leading-none">₹85,00,000</span>
                      <button className="bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-black px-2.5 py-1 rounded-lg transition-colors leading-none cursor-pointer">
                        View
                      </button>
                    </div>
                  </div>

                  {/* Mockup Bottom Stats Bar */}
                  <div className="grid grid-cols-2 gap-2 mt-2 mb-2">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100/50 flex flex-col text-center">
                      <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Listings</span>
                      <span className="text-xs font-black text-slate-800 mt-0.5">5K+</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100/50 flex flex-col text-center">
                      <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Users</span>
                      <span className="text-xs font-black text-slate-800 mt-0.5">10K+</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={(user) => {
          // Updates automatically via useCustomer hook
        }}
      />
    </>
  );
}

function SectionHeader({
  title,
  subtitle,
  link,
}: {
  title: string;
  subtitle?: string;
  link?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex items-end justify-between gap-4 flex-wrap"
    >
      <div>
        <h2 className="font-display text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1 ">{subtitle}</p>
        )}
        {/* Animated rose accent underline */}
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="mt-3 h-[3px] w-12 bg-gradient-to-r from-rose-500 to-rose-300 rounded-full"
        />
      </div>
      {link && (
        <Link
          to={link}
          className="text-sm font-bold text-rose-900 hover:text-rose-600 hover:underline inline-flex items-center gap-1"
        >
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </motion.div>
  );
}

function Section({
  title,
  subtitle,
  link,
  className,
  children,
}: {
  title: string;
  subtitle?: string;
  link?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`py-16 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={title} subtitle={subtitle} link={link} />
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
