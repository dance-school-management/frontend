import { ContactInfo } from "@/components/contact/contact-info";
import { ContactMap } from "@/components/contact/contact-map";
import { FAQSection } from "@/components/contact/faq-section";
import { ResponseTime } from "@/components/contact/response-time";
import { SocialLinks } from "@/components/contact/social-links";

const contactInfo = {
    address: "ul. Floriańska 15, 31-019 Kraków, Polska",
    phone: "+48 12 123 45 67",
    email: "kontakt@szkolatanca.pl",
    hours: {
        weekdays: "Monday-Friday: 9:00-20:00",
        saturday: "Saturday: 9:00-17:00",
        sunday: "Sunday: 10:00-16:00",
    },
};

export default function Page() {
    return (
        <div className="flex flex-col gap-4 p-4 md:p-6 lg:p-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold md:text-4xl">Contact Us</h1>
                <p className="text-muted-foreground">
                    Have questions? We&apos;d love to hear from you. Send us a message or visit
                    us in person.
                </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="flex flex-col gap-4">
                    {/* TODO: Think how to handle on backend  */}
                    {/* <ContactForm /> */}
                    <FAQSection />
                    <SocialLinks />
                </div>
                <div className="flex flex-col gap-4">
                    <ResponseTime />
                    <ContactInfo {...contactInfo} />
                </div>
            </div>

            <ContactMap address={contactInfo.address} />
        </div>
    );
}