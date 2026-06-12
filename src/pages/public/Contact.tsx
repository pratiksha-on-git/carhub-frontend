import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, Mail, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/shared/SEO";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  message: z.string().min(10).max(1000),
});

export default function Contact() {
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { name: "", email: "", message: "" } });
  return (
    <>
      <SEO title="Contact AutoHub India" description="Get in touch with the AutoHub India team for support, partnerships or dealer enquiries." />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-black">We'd love to hear from you</h1>
          <p className="text-muted-foreground mt-2">Questions about listings, dealer onboarding or partnerships? Drop us a note.</p>
        </div>
        <div className="grid md:grid-cols-[1fr_320px] gap-6 mt-10">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={form.handleSubmit(() => { toast.success("Message sent! We'll get back within 24 hours."); form.reset(); })} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Name</Label><Input {...form.register("name")} className="mt-1" /></div>
                  <div><Label>Email</Label><Input {...form.register("email")} className="mt-1" /></div>
                </div>
                <div><Label>Message</Label><Textarea rows={6} {...form.register("message")} className="mt-1" /></div>
                <Button type="submit" className="gradient-primary text-white border-0 hover:opacity-90">Send message</Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-4">
              <Info icon={<Phone className="h-4 w-4" />} title="Phone" value="+91 1800 123 4567" />
              <Info icon={<Mail className="h-4 w-4" />} title="Email" value="hello@autohub.in" />
              <Info icon={<MapPin className="h-4 w-4" />} title="Headquarters" value="Bandra Kurla Complex, Mumbai 400051" />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function Info({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-9 w-9 place-items-center rounded-lg gradient-primary text-white shrink-0">{icon}</div>
      <div><div className="text-xs text-muted-foreground">{title}</div><div className="font-semibold text-sm">{value}</div></div>
    </div>
  );
}
