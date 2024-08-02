interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export const categories = [
  {
    id: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
    name: "Keyboard",
    slug: "keyboard",
    description: "Various types of keyboards",
  },
  {
    id: "2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q",
    name: "Mouse",
    slug: "mouse",
    description: "Different kinds of mice",
  },
  {
    id: "3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r",
    name: "TWS",
    slug: "tws",
    description: "True Wireless Stereo earphones",
  },
  {
    id: "4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s",
    name: "Accessories",
    slug: "accessories",
    description: "Various computer accessories",
  },
];
