import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const saltRounds = 10;

    const user1Password = await bcrypt.hash('admin123', saltRounds);
    const user2Password = await bcrypt.hash('admin123', saltRounds);

    const user1 = await prisma.user.create({
        data: {
            name: 'David Yates',
            email: 'dyates@beta.com',
            password: user1Password,
        },
    });

    const user2 = await prisma.user.create({
        data: {
            name: 'Amine Tijani',
            email: 'atijani@beta.com',
            password: user2Password,
        },
    });

    console.log({ user1, user2 });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
