import { PrismaClient } from "database";
import 'server-only';

const prisma = new PrismaClient();

export { prisma };
