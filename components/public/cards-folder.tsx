"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Images, Calendar } from "lucide-react";

export interface GalleryFolderItem {
  id: string;
  number: string;
  title: string;
  category: "Cultural" | "Technical" | "Fests" | "Behind the Scenes" | "Fashion" | "Sports";
  event: string;
  date: string;
  photoCount: number;
  description: string;
  theme: {
    outerBorder: string;
    coverBg: string;
    textColor: string;
    accentColor: string;
    isDarkCover: boolean;
  };
  bgTexture: string;
  graphic3d: string;
  photos: {
    url: string;
    caption: string;
    photographer?: string;
  }[];
}

export const DEFAULT_GALLERY_FOLDERS: GalleryFolderItem[] = [
  {
    id: "battle-of-bands",
    number: "01",
    title: "Battle of the Bands Grand Finale",
    category: "Cultural",
    event: "Acoustica 2025",
    date: "Nov 2025",
    photoCount: 42,
    description: "Electric guitar solos, roaring amphitheatre crowd, and the legendary acoustic jam under the campus night lights.",
    theme: {
      outerBorder: "rgb(1, 0, 38)",
      coverBg: "rgb(4, 0, 74)",
      textColor: "#FFFFFF",
      accentColor: "#A78BFA",
      isDarkCover: true,
    },
    bgTexture: "/cards-folder/texture-indigo.jpg",
    graphic3d: "/cards-folder/graphic-cursor.png",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop",
        caption: "Lead vocalist and guitarist hitting the climactic crescendo on the main stage.",
        photographer: "VSC Media Wing",
      },
      {
        url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600&auto=format&fit=crop",
        caption: "DJ console & light beam spectacle over the 3,000 strong audience.",
        photographer: "Aditya S. (ECE '26)",
      },
      {
        url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop",
        caption: "Drummer in full flow with golden backlight smoke flare.",
        photographer: "Kiran R. (CSE '25)",
      },
      {
        url: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=1600&auto=format&fit=crop",
        caption: "Crowd hands in the air during the festival encore.",
        photographer: "VSC Media Wing",
      },
    ],
  },
  {
    id: "hackathon-24h",
    number: "02",
    title: "HackVistara 24H Grand Finale",
    category: "Technical",
    event: "HackVistara '25",
    date: "Oct 2025",
    photoCount: 58,
    description: "24 hours of non-stop code, hardware prototyping, Red Bull fueled sprints, and top venture jury pitches.",
    theme: {
      outerBorder: "rgb(193, 207, 222)",
      coverBg: "rgb(228, 231, 237)",
      textColor: "#0F172A",
      accentColor: "#EA580C",
      isDarkCover: false,
    },
    bgTexture: "/cards-folder/texture-orange.jpg",
    graphic3d: "/cards-folder/graphic-two.png",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1600&auto=format&fit=crop",
        caption: "Teams brainstorming final architectural flowcharts at 3:00 AM.",
        photographer: "Nikhil V. (IT '25)",
      },
      {
        url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1600&auto=format&fit=crop",
        caption: "IoT sensor live debugging table in the embedded systems lab.",
        photographer: "VSC Tech Wing",
      },
      {
        url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop",
        caption: "Winners demonstration before the angel investors panel.",
        photographer: "Sneha M. (AI&DS '26)",
      },
      {
        url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop",
        caption: "Keynote opening address by alumni tech founders.",
        photographer: "VSC Media Wing",
      },
    ],
  },
  {
    id: "dance-championship",
    number: "03",
    title: "Choreography Trophy Winning Routine",
    category: "Cultural",
    event: "National Fest Championship",
    date: "Dec 2025",
    photoCount: 36,
    description: "Synchronized hip-hop transitions, aerial flips, and the moment Vistara Dance Wing hoisted the national trophy.",
    theme: {
      outerBorder: "rgb(2, 4, 5)",
      coverBg: "rgb(16, 27, 33)",
      textColor: "#F8FAFC",
      accentColor: "#38BDF8",
      isDarkCover: true,
    },
    bgTexture: "/cards-folder/texture-steel.jpg",
    graphic3d: "/cards-folder/graphic-arcs.png",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1600&auto=format&fit=crop",
        caption: "The championship winning final formation with strobe backlights.",
        photographer: "Gaurav T. (Mech '26)",
      },
      {
        url: "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=1600&auto=format&fit=crop",
        caption: "Mid-air synchronized jump captured at 1/2000s shutter.",
        photographer: "VSC Media Wing",
      },
      {
        url: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?q=80&w=1600&auto=format&fit=crop",
        caption: "Green room mirrors: Last second face paint touchups.",
        photographer: "Pooja B. (Biotech '25)",
      },
      {
        url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop",
        caption: "Trophy celebration on stage with team captains.",
        photographer: "VSC Media Wing",
      },
    ],
  },
  {
    id: "runway-showcase",
    number: "04",
    title: "Annual Runway Showcase — Thematic Walk",
    category: "Cultural",
    event: "Vistara Fashion Week",
    date: "Jan 2026",
    photoCount: 45,
    description: "Haute couture meets cyber-punk aesthetics crafted by student designers and walked across the illuminated glass ramp.",
    theme: {
      outerBorder: "rgb(35, 12, 24)",
      coverBg: "rgb(55, 16, 36)",
      textColor: "#FFF1F2",
      accentColor: "#FB7185",
      isDarkCover: true,
    },
    bgTexture: "/cards-folder/texture-orange.jpg",
    graphic3d: "/cards-folder/graphic-cursor.png",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop",
        caption: "Futuristic metallic silver ensemble opening the main show.",
        photographer: "Rohit K. (CSE '26)",
      },
      {
        url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1600&auto=format&fit=crop",
        caption: "Designer lineup finale with applause from campus dignitaries.",
        photographer: "VSC Media Wing",
      },
      {
        url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop",
        caption: "Backstage styling zone: Rapid garment transformations.",
        photographer: "Meera D. (Design '25)",
      },
    ],
  },
  {
    id: "winter-gala",
    number: "05",
    title: "Amphitheatre Crowd During Star Night",
    category: "Fests",
    event: "Winter Gala 2025",
    date: "Dec 2025",
    photoCount: 70,
    description: "Over 4,500 students lighting up phone torches during the celebrity headline performance as gold confetti showered.",
    theme: {
      outerBorder: "rgb(28, 20, 8)",
      coverBg: "rgb(42, 30, 10)",
      textColor: "#FEF3C7",
      accentColor: "#F59E0B",
      isDarkCover: true,
    },
    bgTexture: "/cards-folder/texture-indigo.jpg",
    graphic3d: "/cards-folder/graphic-two.png",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600&auto=format&fit=crop",
        caption: "Skyline view of the open amphitheatre illuminated by laser arrays.",
        photographer: "Drone Team (Aero Wing)",
      },
      {
        url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop",
        caption: "The crowd chorus singing along to the final acoustic hit.",
        photographer: "VSC Media Wing",
      },
      {
        url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop",
        caption: "Midnight fireworks over the main university clocktower.",
        photographer: "Arjun N. (ECE '25)",
      },
    ],
  },
  {
    id: "aftermovie-crew",
    number: "06",
    title: "Cinematography Crew in Action",
    category: "Behind the Scenes",
    event: "Aftermovie Shoots",
    date: "Jan 2026",
    photoCount: 29,
    description: "Gimbals, cinema rigs, smoke machines, and director monitors behind the scenes of our viral annual club recap.",
    theme: {
      outerBorder: "rgb(4, 25, 30)",
      coverBg: "rgb(8, 38, 45)",
      textColor: "#E0F2FE",
      accentColor: "#38BDF8",
      isDarkCover: true,
    },
    bgTexture: "/cards-folder/texture-steel.jpg",
    graphic3d: "/cards-folder/graphic-arcs.png",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1600&auto=format&fit=crop",
        caption: "Camera operator tracking the dancers on the 3-axis gyro gimbal rig.",
        photographer: "VSC BTS Team",
      },
      {
        url: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?q=80&w=1600&auto=format&fit=crop",
        caption: "Color grading session in the campus studio suite.",
        photographer: "Kunal S. (CSE '26)",
      },
      {
        url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop",
        caption: "Lighting setup for the late-night backstage interviews.",
        photographer: "VSC BTS Team",
      },
    ],
  },
];

export function FolderTabSVG({ fill }: { fill: string }) {
  return (
    <svg
      width="150"
      height="32"
      viewBox="0 0 150 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block shrink-0"
    >
      <path
        fill={fill}
        d="M20 0C8.954 0 0 8.954 0 20v12h150v-2h-25.95a20 20 0 0 1-13.324-5.085L88.528 5.085A20 20 0 0 0 75.203 0Z"
      />
    </svg>
  );
}

export function FolderCard({
  item,
  onClick,
}: {
  item: GalleryFolderItem;
  onClick: (item: GalleryFolderItem) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={() => onClick(item)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(item);
        }
      }}
      className="group relative w-[300px] h-[400px] select-none cursor-pointer rounded-[30px] overflow-hidden transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/40 shrink-0"
      style={{
        border: `10px solid ${item.theme.outerBorder}`,
        boxShadow: isHovered
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)"
          : "0 10px 25px -5px rgba(0, 0, 0, 0.25)",
      }}
    >
      {/* LAYER 1: Background Noise / Grain Texture (Zooms slightly on hover) */}
      <motion.div
        className="absolute -inset-4 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url('${item.bgTexture}')`,
          filter: "contrast(115%) brightness(95%)",
        }}
        animate={{
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 28,
        }}
      />

      {/* Subtle top inner vignette shadow */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/40 pointer-events-none z-[2]" />

      {/* LAYER 2: 3D Artwork Layer (Slides UP from top: 125px to top: 58px on hover) */}
      <motion.div
        className="absolute left-0 right-0 mx-auto w-[205px] h-[205px] flex items-center justify-center pointer-events-none z-[4]"
        style={{ top: 125 }}
        animate={{
          y: isHovered ? -67 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 28,
        }}
      >
        <img
          src={item.graphic3d}
          alt={item.title}
          className="max-w-full max-h-full object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.55)] transition-transform duration-300 group-hover:scale-105"
          draggable={false}
        />
      </motion.div>

      {/* LAYER 3: Physical Folder Cover Layer (FG) - Slides DOWN from top: 80px to top: 180px on hover */}
      <motion.div
        className="absolute left-[10px] right-[10px] bottom-[10px] z-[10] overflow-hidden rounded-b-[20px]"
        animate={{
          top: isHovered ? 180 : 80,
        }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 28,
        }}
      >
        {/* Tab Cutout Header at Top (150px x 32px) */}
        <div className="absolute top-0 left-0 w-[150px] h-[32px] overflow-visible">
          <FolderTabSVG fill={item.theme.coverBg} />
        </div>

        {/* Folder Main Body (extends below tab from y: 30px down to bottom) */}
        <div
          className="absolute top-[30px] left-0 right-0 bottom-0"
          style={{
            backgroundColor: item.theme.coverBg,
            borderTopRightRadius: "20px",
          }}
        />

        {/* Number on Tab (e.g. 01, 02, 03) */}
        <div
          className="absolute top-[8px] left-[18px] z-[12] select-none font-space-grotesk font-extrabold text-[32px] sm:text-[34px] leading-none tracking-tight"
          style={{ color: item.theme.textColor }}
        >
          {item.number}
        </div>

        {/* Arrow Action Icon (top right of folder) */}
        <motion.div
          className="absolute top-[40px] right-[18px] z-[12] flex items-center justify-center w-7 h-7 rounded-full transition-transform duration-200"
          style={{
            color: item.theme.textColor,
            backgroundColor: item.theme.isDarkCover ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
          }}
          animate={{
            rotate: isHovered ? 45 : 0,
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <ArrowUpRight className="w-4 h-4" />
        </motion.div>

        {/* Text Container at Bottom of the Folder Body */}
        <div
          className="absolute bottom-[20px] left-[18px] right-[18px] z-[12] pointer-events-none"
          style={{ color: item.theme.textColor }}
        >
          {/* Category & Date Pill */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-sm"
              style={{
                backgroundColor: item.theme.isDarkCover ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)",
                color: item.theme.textColor,
              }}
            >
              {item.category}
            </span>
            <span className="text-[11px] opacity-70 flex items-center gap-1">
              <Calendar className="w-3 h-3 inline" />
              {item.date}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-sans text-[15px] sm:text-[16px] font-bold leading-snug line-clamp-2">
            {item.title}
          </h3>

          {/* Description */}
          <p className="font-sans text-[11px] sm:text-[12px] leading-relaxed mt-1 opacity-70 line-clamp-2">
            {item.description}
          </p>

          {/* Stats footer hint */}
          <div
            className="mt-2.5 pt-2 border-t flex items-center justify-between text-[10px] font-semibold opacity-75"
            style={{
              borderColor: item.theme.isDarkCover ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
            }}
          >
            <span className="flex items-center gap-1.5">
              <Images className="w-3 h-3" />
              {item.photoCount} Photos
            </span>
            <span className="underline decoration-dotted font-medium">Click to view album</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function CardsFolderGrid({
  items,
  onCardClick,
}: {
  items: GalleryFolderItem[];
  onCardClick: (item: GalleryFolderItem) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 max-w-7xl mx-auto py-6">
      {items.map((item) => (
        <FolderCard key={item.id} item={item} onClick={onCardClick} />
      ))}
    </div>
  );
}
