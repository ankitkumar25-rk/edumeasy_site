import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@edumeasy.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@EduMEasy123';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      name: 'Admin',
      email: adminEmail,
      passwordHash,
      role: 'ADMIN'
    }
  });

  const teamMembers = [
    { id: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d', name: 'Vivek Sahu', qualification: 'M Sc IIT Jodhpur', role: 'TEAM', image: 'https://res.cloudinary.com/dummy/image/upload/v1/team/vivek.jpg', sortOrder: 1 },
    { id: '1b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e', name: 'Sunil Kumar', qualification: 'B Tech NIT UK', role: 'TEAM', image: 'https://res.cloudinary.com/dummy/image/upload/v1/team/sunil.jpg', sortOrder: 2 },
    { id: '2c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f', name: 'Parth Vijay', qualification: 'B Tech IITK', role: 'TEAM', image: 'https://res.cloudinary.com/dummy/image/upload/v1/team/parth.jpg', sortOrder: 3 },
    { id: '3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a', name: 'Chinmay Sharma', qualification: 'B Tech JIET', role: 'TEAM', image: 'https://res.cloudinary.com/dummy/image/upload/v1/team/chinmay.jpg', sortOrder: 4 },
    { id: '4e5f6a7b-8c9d-0e1f-2a3b-4c5d6e7f8a9b', name: 'Yash Asawa', qualification: 'MBA', role: 'TEAM', image: 'https://res.cloudinary.com/dummy/image/upload/v1/team/yash.jpg', sortOrder: 5 },
    { id: '5f6a7b8c-9d0e-1f2a-3b4c-5d6e7f8a9b0c', name: 'Sandeep Yadav', qualification: 'Electrical Engg, IIT Jodhpur', role: 'MENTOR', image: 'https://res.cloudinary.com/dummy/image/upload/v1/team/sandeep.jpg', sortOrder: 6 },
    { id: '6a7b8c9d-0e1f-2a3b-4c5d-6e7f8a9b0c1d', name: 'Vivek Vijay', qualification: 'Mathematics, IIT Jodhpur', role: 'MENTOR', image: 'https://res.cloudinary.com/dummy/image/upload/v1/team/vivekvijay.jpg', sortOrder: 7 },
    { id: '7b8c9d0e-1f2a-3b4c-5d6e-7f8a9b0c1d2e', name: 'Prof P K Kalra', qualification: 'Founder Director, IIT Jodhpur', role: 'ADVISOR', image: 'https://res.cloudinary.com/dummy/image/upload/v1/team/pkkalra.jpg', sortOrder: 8 },
    { id: '8c9d0e1f-2a3b-4c5d-6e7f-8a9b0c1d2e3f', name: 'Prof I K Rana', qualification: 'Ex-Professor, IIT Bombay', role: 'ADVISOR', image: 'https://res.cloudinary.com/dummy/image/upload/v1/team/ikrana.jpg', sortOrder: 9 },
    { id: '9d0e1f2a-3b4c-5d6e-7f8a-9b0c1d2e3f4a', name: 'Shri Sunil Bajaj', qualification: 'Jt. Director, SCERT Haryana', role: 'ADVISOR', image: 'https://res.cloudinary.com/dummy/image/upload/v1/team/sunilbajaj.jpg', sortOrder: 10 }
  ];

  for (const member of teamMembers) {
    await prisma.teamMember.upsert({
      where: { id: member.id },
      update: {
        name: member.name,
        qualification: member.qualification,
        role: member.role,
        image: member.image,
        sortOrder: member.sortOrder
      },
      create: member
    });
  }

  await prisma.mathLab.upsert({
    where: { id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' },
    update: {
      title: 'Primary Classes Math Lab',
      description: 'Complete Math Lab setup for primary classes from grade 1 to 5.',
      price: 150000.00,
      level: 'PRIMARY',
      videoUrl: 'https://www.youtube.com/embed/dummy_lab_video'
    },
    create: {
      id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
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

  await prisma.mathLab.upsert({
    where: { id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e' },
    update: {
      title: 'Advanced Classes Math Lab',
      description: 'State-of-the-art Math Lab setup for secondary classes from grade 6 to 10.',
      price: 250000.00,
      level: 'ADVANCED',
      videoUrl: 'https://www.youtube.com/embed/dummy_lab_advanced'
    },
    create: {
      id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
      title: 'Advanced Classes Math Lab',
      description: 'State-of-the-art Math Lab setup for secondary classes from grade 6 to 10.',
      price: 250000.00,
      level: 'ADVANCED',
      videoUrl: 'https://www.youtube.com/embed/dummy_lab_advanced',
      images: {
        create: [
          { url: 'https://res.cloudinary.com/dummy/image/upload/v1/labs/advanced_1.jpg', publicId: 'labs/advanced_1' }
        ]
      },
      equipment: {
        create: [
          { name: 'Pythagoras Theorem Kit' },
          { name: 'Algebraic Identity Tiles' },
          { name: '3D Geometric Solids' },
          { name: 'Clinometer' }
        ]
      }
    }
  });

  const kits = [
    { id: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', title: 'Math Kit Class 6', classNumber: 6, description: 'Curriculum-aligned hands-on math kit for class 6 students.', price: 1200.00, videoUrl: 'https://www.youtube.com/embed/dummy_kit_6' },
    { id: 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', title: 'Math Kit Class 7', classNumber: 7, description: 'Curriculum-aligned hands-on math kit for class 7 students.', price: 1300.00, videoUrl: 'https://www.youtube.com/embed/dummy_kit_7' },
    { id: 'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', title: 'Math Kit Class 8', classNumber: 8, description: 'Curriculum-aligned hands-on math kit for class 8 students.', price: 1400.00, videoUrl: 'https://www.youtube.com/embed/dummy_kit_8' },
    { id: 'f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c', title: 'Math Kit Class 9', classNumber: 9, description: 'Curriculum-aligned hands-on math kit for class 9 students.', price: 1500.00, videoUrl: 'https://www.youtube.com/embed/dummy_kit_9' },
    { id: 'a7b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d', title: 'Math Kit Class 10', classNumber: 10, description: 'Curriculum-aligned hands-on math kit for class 10 students.', price: 1600.00, videoUrl: 'https://www.youtube.com/embed/dummy_kit_10' }
  ];

  for (const kit of kits) {
    await prisma.mathKit.upsert({
      where: { id: kit.id },
      update: {
        title: kit.title,
        classNumber: kit.classNumber,
        description: kit.description,
        price: kit.price,
        videoUrl: kit.videoUrl
      },
      create: {
        ...kit,
        images: {
          create: [
            { url: `https://res.cloudinary.com/dummy/image/upload/v1/kits/kit${kit.classNumber}.jpg`, publicId: `kits/kit${kit.classNumber}` }
          ]
        }
      }
    });
  }

  const events = [
    { id: 'e1d1c1b1-a1a1-2222-3333-444455556666', title: 'National Mathematics Day Celebration', description: 'Annual math exhibition and presentation.', type: 'EVENT', date: new Date('2026-12-22T10:00:00Z'), image: 'https://res.cloudinary.com/dummy/image/upload/v1/events/math_day.jpg', price: 0.00, schedule: '10:00 AM - 4:00 PM' },
    { id: 'e2d2c2b2-a2a2-3333-4444-555566667777', title: 'Hands-on Geometry Workshop', description: 'Learn geometry via hands-on origami and model crafting.', type: 'WORKSHOP', date: new Date('2026-08-15T11:00:00Z'), image: 'https://res.cloudinary.com/dummy/image/upload/v1/events/geometry_workshop.jpg', price: 500.00, schedule: '11:00 AM - 1:00 PM' },
    { id: 'e3d3c3b3-a3a3-4444-5555-666677778888', title: 'All-India Mathematics Olympiad', description: 'National level contest testing math skills and aptitude.', type: 'OLYMPIAD', date: new Date('2026-10-10T09:00:00Z'), image: 'https://res.cloudinary.com/dummy/image/upload/v1/events/olympiad.jpg', price: 200.00, schedule: '9:00 AM - 12:00 PM' }
  ];

  for (const event of events) {
    await prisma.event.upsert({
      where: { id: event.id },
      update: {
        title: event.title,
        description: event.description,
        type: event.type,
        date: event.date,
        image: event.image,
        price: event.price,
        schedule: event.schedule
      },
      create: event
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
