export interface BasketItem {
  name: string;
  icon: string; // Font Awesome class name
}

export interface UpdatePost {
  id: number;
  image: string;
  title: string;
  description: string;
  date: string;
}

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  cta: string;
  backgroundImage: string;
  countdownTargetDate: string;
}

export interface MissionContent {
  title: string;
  subtitle: string;
  description: string;
  basketTitle: string;
  items: BasketItem[];
}

export interface TransparencyContent {
  title: string;
  subtitle: string;
  goal: number;
  raised: number;
}

export interface UpdatesContent {
    title: string;
    subtitle: string;
    posts: UpdatePost[];
}

export interface GalleryContent {
    title: string;
    subtitle: string;
    images: GalleryImage[];
}

export interface DonateContent {
    title: string;
    subtitle: string;
    heading: string;
}

export interface FooterContent {
    about: string;
    facebookUrl: string;
    instagramUrl: string;
    whatsappUrl: string;
    email: string;
}

export interface AppContent {
  donationUrl: string;
  campaignName: string;
  hero: HeroContent;
  mission: MissionContent;
  transparency: TransparencyContent;
  updates: UpdatesContent;
  gallery: GalleryContent;
  donate: DonateContent;
  footer: FooterContent;
}