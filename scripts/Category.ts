const { PrismaClient } =  require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    const category = await prisma.category.createMany({
      data: [
        { name: "Filming" },
        { name: "Computer Science" },
        { name: "Web Development" },
        { name: "Mobile Development" },
        { name: "Data Science" },
        { name: "Cyber Security" },
      ],
    });
    console.log(category);
  } catch (error) {
    prisma.$disconnect();
  }
}
main().then(() => {
  prisma.$disconnect();
});
