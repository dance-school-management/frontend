"use client";

import { siFacebook, siInstagram, siYoutube, siTiktok } from "simple-icons";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";

const socialLinks = [
  {
    name: "Facebook",
    url: "https://www.facebook.com",
    icon: siFacebook,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com",
    icon: siInstagram,
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com",
    icon: siYoutube,
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com",
    icon: siTiktok,
  },
];

export function SocialLinks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Follow Us</CardTitle>
        <CardDescription>
          Stay connected with us on social media.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {socialLinks.map((social) => {
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border p-3 transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label={`Visit our ${social.name} page`}
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>{social.icon.title}</title>
                  <path d={social.icon.path} />
                </svg>
              </a>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

