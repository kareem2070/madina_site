import { prisma } from './prisma';

export async function getData() {
  const hero = await prisma.hero.findFirst();
  const aboutUs = await prisma.aboutUs.findFirst({
    include: {
      tags: true,
    },
  });

  return { hero, aboutUs };
}