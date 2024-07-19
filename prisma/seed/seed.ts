/**
 * ! Executing this script will delete all data in your database and seed new data.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient } from "@snaplet/seed";
import { copycat } from "@snaplet/copycat";

const main = async () => {
  const seed = await createSeedClient();

  // Truncate all tables in the database
  await seed.$resetDatabase();

  await seed.category((createMany) =>
    createMany(4, {
      name: (ctx) =>
        copycat.oneOf(ctx.seed, ["Keyboard", "Mouse", "TWS", "Headphones"]),
      slug: (ctx) => ctx.data.name?.toLowerCase() || "",
      products: (createMany) =>
        createMany(1, {
          price: ({ seed }) => copycat.int(seed, { min: 500000, max: 2000000 }),
          slug: (ctx) =>
            ctx.data.name
              ?.toLowerCase()
              .replace(/[^a-z0-9]/g, "-")
              .replace(/-+/g, "-") +
              "-" +
              copycat.uuid(ctx.seed).slice(0, 5) || "default-slug",
          sku: (ctx) =>
            ctx.data.name
              ?.toLowerCase()
              .replace(/[^a-z0-9]/g, "-")
              .replace(/-+/g, "-") || "default-slug",
          orderItems: (createMany) => createMany(3),
          reviews: (createMany) => createMany(1),
        }),
    })
  );

  // Type completion not working? You might want to reload your TypeScript Server to pick up the changes

  console.log("Database seeded successfully!");

  process.exit();
};

main();
