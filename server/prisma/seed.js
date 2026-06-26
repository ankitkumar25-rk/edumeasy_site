import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@edumeasy.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('Admin@EduMEasy123', 12);
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: adminEmail,
        passwordHash,
        role: 'ADMIN'
      }
    });
  }

  const teamMembers = [
    { name: 'Vivek Sahu', qualification: 'M Sc IIT Jodhpur', role: 'TEAM', image: 'https://res.cloudinary.com/dummy/image/upload/v1/team/vivek.jpg', sortOrder: 1 },
    { name: 'Sunil Kumar', qualification: 'B Tech NIT UK', role: 'TEAM', image: 'https://res.cloudinary.com/dummy/image/upload/v1/team/sunil.jpg', sortOrder: 2 },
    { name: 'Parth Vijay', qualification: 'B Tech IITK', role: 'TEAM', image: 'https://res.cloudinary.com/dummy/image/upload/v1/team/parth.jpg', sortOrder: 3 },
    { name: 'Chinmay Sharma', qualification: 'B Tech JIET', role: 'TEAM', image: 'https://res.cloudinary.com/dummy/image/upload/v1/team/chinmay.jpg', sortOrder: 4 },
    { name: 'Yash Asawa', qualification: 'MBA', role: 'TEAM', image: 'https://res.cloudinary.com/dummy/image/upload/v1/team/yash.jpg', sortOrder: 5 },
    { name: 'Sandeep Yadav', qualification: 'Electrical Engg, IIT Jodhpur', role: 'MENTOR', image: 'https://res.cloudinary.com/dummy/image/upload/v1/team/sandeep.jpg', sortOrder: 6 },
    { name: 'Vivek Vijay', qualification: 'Mathematics, IIT Jodhpur', role: 'MENTOR', image: 'https://res.cloudinary.com/dummy/image/upload/v1/team/vivekvijay.jpg', sortOrder: 7 },
    { name: 'Prof P K Kalra', qualification: 'Founder Director, IIT Jodhpur', role: 'ADVISOR', image: 'https://res.cloudinary.com/dummy/image/upload/v1/team/pkkalra.jpg', sortOrder: 8 },
    { name: 'Prof I K Rana', qualification: 'Ex-Professor, IIT Bombay', role: 'ADVISOR', image: 'https://res.cloudinary.com/dummy/image/upload/v1/team/ikrana.jpg', sortOrder: 9 },
    { name: 'Shri Sunil Bajaj', qualification: 'Jt. Director, SCERT Haryana', role: 'ADVISOR', image: 'https://res.cloudinary.com/dummy/image/upload/v1/team/sunilbajaj.jpg', sortOrder: 10 }
  ];

  for (const member of teamMembers) {
    const existing = await prisma.teamMember.findFirst({
      where: { name: member.name }
    });
    if (!existing) {
      await prisma.teamMember.create({ data: member });
    }
  }

  const existingLab = await prisma.mathLab.findFirst({
    where: { title: 'Primary Classes Math Lab' }
  });
  if (!existingLab) {
    await prisma.mathLab.create({
      data: {
        title: 'Primary Classes Math Lab',
        description: 'Complete Math Lab setup for primary classes from grade 1 to 5.',
        price: 150000.00,
        level: 'PRIMARY',
        videoUrl: 'https://www.youtube.com/embed/dummy_lab_video',
        images: {
          create: [
            { url: 'https://res.cloudinary.com/dummy/image/upload/v1/labs/primary_1.jpg', publicId: 'labs/primary_1' }
          ]
        },
        equipment: {
          create: [
            { name: 'Abacus' },
            { name: 'Geoboard' },
            { name: 'Fraction Discs' },
            { name: 'Base Ten Blocks' }
          ]
        }
      }
    });
  }

  const existingKit6 = await prisma.mathKit.findFirst({
    where: { title: 'Math Kit Class 6' }
  });
  if (!existingKit6) {
    await prisma.mathKit.create({
      data: {
        title: 'Math Kit Class 6',
        classNumber: 6,
        description: 'Curriculum-aligned hands-on math kit for class 6 students.',
        price: 1200.00,
        videoUrl: 'https://www.youtube.com/embed/dummy_kit_6',
        images: {
          create: [
            { url: 'https://res.cloudinary.com/dummy/image/upload/v1/kits/kit6.jpg', publicId: 'kits/kit6' }
          ]
        }
      }
    });
  }

  const existingKit7 = await prisma.mathKit.findFirst({
    where: { title: 'Math Kit Class 7' }
  });
  if (!existingKit7) {
    await prisma.mathKit.create({
      data: {
        title: 'Math Kit Class 7',
        classNumber: 7,
        description: 'Curriculum-aligned hands-on math kit for class 7 students.',
        price: 1300.00,
        videoUrl: 'https://www.youtube.com/embed/dummy_kit_7',
        images: {
          create: [
            { url: 'https://res.cloudinary.com/dummy/image/upload/v1/kits/kit7.jpg', publicId: 'kits/kit7' }
          ]
        }
      }
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
