import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (typeof window === "undefined") {
    if (process.env.NODE_ENV === "production") {
        prisma = new PrismaClient();
        // prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'], });
    } else {
        if (!global.prisma) {
            // global.prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'], });
            global.prisma = new PrismaClient({ log: [], });

        }

        prisma = global.prisma;
    }
}




export default prisma;