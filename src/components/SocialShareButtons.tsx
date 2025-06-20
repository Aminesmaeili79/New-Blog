// src/components/SocialShareButtons.tsx
"use client";

import { useEffect, useState } from 'react';
import { Twitter, Facebook, Linkedin, LinkIcon, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface SocialShareButtonsProps {
  title: string;
  description?: string;
}

export default function SocialShareButtons({ title, description }: SocialShareButtonsProps) {
  const [currentUrl, setCurrentUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  if (!currentUrl) {
    return null; // Or a loading skeleton
  }

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = description ? encodeURIComponent(description) : encodedTitle;

  const shareOptions = [
    {
      name: 'Twitter',
      icon: <Twitter className="h-5 w-5" />,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      'aria-label': 'Share on Twitter',
    },
    {
      name: 'Facebook',
      icon: <Facebook className="h-5 w-5" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      'aria-label': 'Share on Facebook',
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="h-5 w-5" />,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
      'aria-label': 'Share on LinkedIn',
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast({
        title: "Link Copied!",
        description: "The post URL has been copied to your clipboard.",
      });
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast({
        title: "Copy Failed",
        description: "Could not copy the link. Please try again.",
        variant: "destructive",
      });
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 my-6">
      <p className="text-sm font-medium text-muted-foreground mr-2">Share this post:</p>
      {shareOptions.map((option) => (
        <Button
          key={option.name}
          variant="outline"
          size="icon"
          asChild
          aria-label={option['aria-label']}
        >
          <a href={option.url} target="_blank" rel="noopener noreferrer">
            {option.icon}
          </a>
        </Button>
      ))}
      <Button
        variant="outline"
        size="icon"
        onClick={copyToClipboard}
        aria-label="Copy link to clipboard"
      >
        <Copy className="h-5 w-5" />
      </Button>
    </div>
  );
}
