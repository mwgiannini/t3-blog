import { faker } from "@faker-js/faker"
import { PrismaClient } from "@prisma/client"
import { User } from "@prisma/client"
const prisma = new PrismaClient()

const USERS = 100
const MIN_POSTS_PER_USER = 10
const MAX_POSTS_PER_USER = 20

function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

async function main() {
    prisma.$connect()
    await prisma.post.deleteMany({})
    await prisma.user.deleteMany({})
    await seedUsers()
    await seedPosts()
}

async function seedUsers() {
    for (var i = 0; i < USERS; i++) {
        var firstName: string = faker.name.firstName()
        var lastName: string = faker.name.lastName()
        await prisma.user.create({
            data: {
                name: `${firstName} ${lastName}`,
                email: faker.internet.email(firstName, lastName),
                emailVerified: faker.date.past(),
                image: faker.internet.avatar(),
            }
        })
    }
}

async function seedPosts() {
    var users: User[] = await prisma.user.findMany()
    users.forEach(async (user) => {
        for (var j = 0; j < randomIntFromInterval(MIN_POSTS_PER_USER, MAX_POSTS_PER_USER); j++) {
            var published: Date = faker.date.past()
            await prisma.post.create({
                data: {
                    title: faker.lorem.sentence(),
                    content: faker.lorem.paragraphs(),
                    createdAt: published,
                    updatedAt: published,
                    authorId: user.id,
                }
            })
        }
    })
}