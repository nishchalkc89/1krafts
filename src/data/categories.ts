import type { Category } from "@/types";
import saree from "@/assets/cat-saree.jpg";
import kurti from "@/assets/cat-kurti.jpg";
import kurta from "@/assets/cat-traditional.jpg";
import shirts from "@/assets/cat-men-shirts.jpg";
import tshirts from "@/assets/cat-men-tshirts.jpg";
import bottoms from "@/assets/cat-men-bottoms.jpg";
import jewellery from "@/assets/cat-jewellery.jpg";

export const CATEGORIES: Category[] = [
  { slug: "sarees", name: "Sarees", tagline: "Draped in heritage", description: "Hand-loomed silks and cottons finished with gold zari borders.", image: saree, featured: true, order: 1 },
  { slug: "women-kurtis", name: "Women Kurtis", tagline: "Everyday elegance", description: "Featherlight kurtis embroidered by hand for modern living.", image: kurti, featured: true, order: 2 },
  { slug: "jewellery", name: "Jewellery", tagline: "For her, kept close", description: "Newari filigree, kundan and antique gold set by hand.", image: jewellery, featured: true, order: 3 },
  { slug: "men-kurtas", name: "Men Kurtas", tagline: "Ceremony, refined", description: "Hand-finished kurtas in mountain-loomed cotton and silk.", image: kurta, featured: true, order: 4 },
  { slug: "men-shirts", name: "Men Shirts", tagline: "Considered every day", description: "Tailored shirts in soft cottons and heritage weaves.", image: shirts, featured: true, order: 5 },
  { slug: "men-tshirts", name: "Men T-Shirts", tagline: "Quiet essentials", description: "Heavy-cotton tees finished with subtle heritage marks.", image: tshirts, featured: true, order: 6 },
  { slug: "men-bottoms", name: "Men Bottom Wear", tagline: "The base note", description: "Trousers, suruwals and drawstring bottoms cut to sit clean.", image: bottoms, order: 7 },
];