import { users } from "./user";

interface Order {
  id: string;
  isPaid: boolean;
  totalPrice: number;
  userId: string;
}

const userIds = users.map((user) => user.id);

const getRandomUserId = () => {
  return userIds[Math.floor(Math.random() * userIds.length)];
};

export const orders: Order[] = [
  {
    id: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
    isPaid: false,
    totalPrice: 1000,
    userId: getRandomUserId(),
  },
  {
    id: "2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q",
    isPaid: true,
    totalPrice: 2000,
    userId: getRandomUserId(),
  },
  {
    id: "3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r",
    isPaid: false,
    totalPrice: 1500,
    userId: getRandomUserId(),
  },
  {
    id: "4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s",
    isPaid: true,
    totalPrice: 2500,
    userId: getRandomUserId(),
  },
  {
    id: "5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t",
    isPaid: false,
    totalPrice: 3000,
    userId: getRandomUserId(),
  },
  {
    id: "6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u",
    isPaid: true,
    totalPrice: 3500,
    userId: getRandomUserId(),
  },
  {
    id: "7g8h9i0j-1k2l-3m4n-5o6p-7q8r9s0t1u2v",
    isPaid: false,
    totalPrice: 4000,
    userId: getRandomUserId(),
  },
  {
    id: "8h9i0j1k-2l3m-4n5o-6p7q-8r9s0t1u2v3w",
    isPaid: true,
    totalPrice: 4500,
    userId: getRandomUserId(),
  },
  {
    id: "9i0j1k2l-3m4n-5o6p-7q8r-9s0t1u2v3w4x",
    isPaid: false,
    totalPrice: 5000,
    userId: getRandomUserId(),
  },
  {
    id: "0j1k2l3m-4n5o-6p7q-8r9s-0t1u2v3w4x5y",
    isPaid: true,
    totalPrice: 5500,
    userId: getRandomUserId(),
  },
];
