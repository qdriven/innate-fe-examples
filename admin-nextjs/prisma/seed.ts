import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"

const adapter = new PrismaBetterSqlite3({
  url: "file:./dev.db",
})
const db = new PrismaClient({ adapter })

async function main() {
  const existing = await db.user.findUnique({
    where: { email: "admin@innate.dev" },
  })
  if (existing) {
    console.log("User already exists:", existing)
    return
  }
  const user = await db.user.create({
    data: {
      id: "user-admin-001",
      name: "Admin",
      email: "admin@innate.dev",
      emailVerified: true,
    },
  })
  console.log("Seeded user:", user)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
