import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // 1. Upsert Admin User
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
      role: 'ADMIN',
    },
  });
  console.log('Admin user verified/updated.');

  // 2. Parse WordPress XML file
  const xmlPath = '/home/ankit/Desktop/edumeasy_site/client/public/edumeasy.WordPress.2026-06-27.xml';
  let xmlContent = '';
  try {
    xmlContent = fs.readFileSync(xmlPath, 'utf8');
    console.log('Successfully read WordPress XML file.');
  } catch (error) {
    console.warn('Warning: WordPress XML file not found. Seeding default data.');
  }

  // Define lists to collect parsed data
  const parsedTeam = [];
  const parsedTestimonials = [];
  const parsedGalleryImages = [];

  if (xmlContent) {
    // A. Parse Team Members from About Page Content
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    let aboutHtml = '';
    let clientsHtml = '';

    while ((match = itemRegex.exec(xmlContent)) !== null) {
      const itemContent = match[1];
      const titleMatch = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/.exec(itemContent);
      const title = titleMatch ? (titleMatch[1] || titleMatch[2]) : '';
      
      const typeMatch = /<wp:post_type><!\[CDATA\[(.*?)\]\]><\/wp:post_type>|<wp:post_type>(.*?)<\/wp:post_type>/.exec(itemContent);
      const type = typeMatch ? (typeMatch[1] || typeMatch[2]) : '';

      if (type === 'page' && title === 'About') {
        const encodedMatch = /<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>|<content:encoded>([\s\S]*?)<\/content:encoded>/.exec(itemContent);
        aboutHtml = encodedMatch ? (encodedMatch[1] || encodedMatch[2] || '') : '';
      }

      if (type === 'page' && title === 'Clients') {
        const encodedMatch = /<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>|<content:encoded>([\s\S]*?)<\/content:encoded>/.exec(itemContent);
        clientsHtml = encodedMatch ? (encodedMatch[1] || encodedMatch[2] || '') : '';
      }
    }

    // Extract Team Members from About page HTML
    if (aboutHtml) {
      // Look for team member blocks containing image, name, role/title, and bio
      // Format in HTML: <figure><img ... src="IMAGE_URL" ... /></figure><h3>MEMBER_NAME</h3><p>QUALIFICATION / TITLE</p><p>BIO</p>
      const teamBlockRegex = /<figure><img[^>]*?src="([^"]+?)"[^>]*?><\/figure>\s*<h3>([^<]+?)<\/h3>\s*<p>([\s\S]*?)<\/p>\s*<p>([\s\S]*?)<\/p>/g;
      let teamMatch;
      let sortIdx = 1;
      while ((teamMatch = teamBlockRegex.exec(aboutHtml)) !== null) {
        const image = teamMatch[1];
        const name = teamMatch[2].trim();
        const rawRoleInfo = teamMatch[3];
        const bio = teamMatch[4].trim();

        // Parse qualifications and roles
        let role = 'TEAM';
        if (rawRoleInfo.includes('Mentor') || rawRoleInfo.includes('Director')) {
          role = 'MENTOR';
        } else if (rawRoleInfo.includes('Advisor')) {
          role = 'ADVISOR';
        }

        const qualClean = rawRoleInfo.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+?>/g, '').replace(/\s+/g, ' ').trim();

        parsedTeam.push({
          name,
          qualification: qualClean || 'IIT Alumni',
          role,
          image,
          sortOrder: sortIdx++,
        });
      }
    }

    // Extract Testimonials and Gallery Images from Clients page HTML
    if (clientsHtml) {
      // Find testimonial images and quotes
      // Format has images like: https://edumeasy.com/wp-content/uploads/2023/05/math-lab-india-by-edumeasy-pvt-ltd-*.png
      const imgRegex = /https:\/\/edumeasy\.com\/wp-content\/uploads\/2023\/05\/math-lab-india-by-edumeasy-pvt-ltd-\d+\.png/g;
      let imgMatch;
      const uniqueImgs = new Set();
      while ((imgMatch = imgRegex.exec(clientsHtml)) !== null) {
        uniqueImgs.add(imgMatch[0]);
      }

      let imgIdx = 1;
      uniqueImgs.forEach((imgUrl) => {
        parsedGalleryImages.push({
          title: `School Installation ${imgIdx++}`,
          type: 'IMAGE',
          url: imgUrl,
          publicId: `wordpress/installation-${imgIdx}`,
        });
      });
    }

    // Hardcode real WordPress clients testimonials
    parsedTestimonials.push(
      {
        title: 'Dr. Chinmay Pandya Ji (Pro VC of Devsanskriti Vishvavidyalaya)',
        type: 'TESTIMONIAL',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXNRve7kwrH-SeOeDjVerHx3WTYix_s7hwxaTJ4TnPJe8ie-2KPgko2wGD8hJh__5gRhlzS1_ZyVN5Bv6ZtSVoRS8buKXPyrmlJ3Isqsk_zpHzr5yyxfkVab8R9gUB9UGKKX9geCGv0fanQ_Gah4i6Gptbn0RIh9T3o3ekMyKAsf0gUC08XWlYIfCfBiPAnaynYDH8lsp7u8Ki0pWT9Pw6Xc23PHrjHyVjKmFa3qKxd7w6lg3bitea_Xwdbrrhe9oqqPOBWAU5V7A',
        textContent: 'As a struggling math student, I was hesitant to seek help, but the math lab is a game-changer for me. The lab offers a variety of resources, including lab equipment, Manuals (in Hindi & English), and support, which have helped me grasp difficult concepts and improve my problem-solving skills.',
        publicId: 'wordpress/testimonial-1',
      },
      {
        title: 'Manisha Lashkari (Principal, Career Point World School - Jodhpur)',
        type: 'TESTIMONIAL',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGWszzzbww9Z1869CiUez_drH_MyLURMb16fEt8nySbkuTUJaJzHYkbD5Vt2P-E1TTRJ50QPCQXNhifIFin-O_PX7qaK1utb8PL52Oc5O8AteiEGfNW0ht3189dVAbO3sQa-4CsxyDGeBV7U5WEIPiR6xba4i428Ee9jfb5SwptqvZ0cDHCh2OkgCwgB1-_vIy0jHnZwun7lsEK5RO3gdc-_sU1BclwTbELuPMSl5AGDZ3qSJEfdM8yQV1MrUHT2LpNAfH9H_okx8',
        textContent: "Teaching and learning Math is made practically easy, teachers are empowered and children are getting rid of their Math phobia. The real 'learning-by-doing' approach is helping students understand the complexities and abstractness of Mathematics. Moreover the concern and support of the team 'EduMeasy' is worth appreciating.",
        publicId: 'wordpress/testimonial-2',
      },
      {
        title: 'Nitin Bhargav (HOD, Tagore International School)',
        type: 'TESTIMONIAL',
        url: 'https://edumeasy.com/wp-content/uploads/2023/02/Nitin-Bhargavv-EduMEasy-math-lab-for-school.png',
        textContent: 'Here is what he feels about the Math Lab - I am thrilled to see this type of equipment which is expected from IITians only and will help students to learn math in a better and joyful manner.',
        publicId: 'wordpress/testimonial-3',
      },
      {
        title: 'Aurobindo (Centre of New Education)',
        type: 'TESTIMONIAL',
        url: 'https://edumeasy.com/wp-content/uploads/2023/03/Aurobindo-EduMEasy-math-lab-for-school.png',
        textContent: 'We strongly feel these equipment will bring revolution in the field of Mathematics from 6th -10 th class. It helps to visualise a concept of mathematics by understanding the concepts and also makes learning a very very fun field.',
        publicId: 'wordpress/testimonial-4',
      },
      {
        title: 'Jagriti Arora (Faculty of Mathematics, Kudos International School - Bundi)',
        type: 'TESTIMONIAL',
        url: 'https://edumeasy.com/wp-content/uploads/2023/03/Jagriti-Arora-EduMEasy-math-lab-for-school.png',
        textContent: 'Here is what she expressed about the Math Lab - These equipments are going to make my job easy and more result Oriented and students are going to love these equipment so they will be able to understand math easily. Last but not the least the equipment is very useful and colourful too. Concepts and colours both matter.',
        publicId: 'wordpress/testimonial-5',
      },
      {
        title: 'Tilkesh Bhatiya (Director, SSIS International School - Nathdwara)',
        type: 'TESTIMONIAL',
        url: 'https://edumeasy.com/wp-content/uploads/2023/02/Tilkesh-Bhatiya-EduMEasy-math-lab-for-school.png',
        textContent: 'Almost 50% of students are afraid of maths. Math is the most scoring subject in competitive exam like JEE. But better score can only be secured with the help of best faculty which is practically not possible in most of the cases. These 7 equipment will act as a faculty for math to help students score better and understand deep concepts in easy manner.',
        publicId: 'wordpress/testimonial-6',
      }
    );
  }

  // 3. Seed Team Members
  const finalTeam = parsedTeam.length > 0 ? parsedTeam : [
    { name: 'Dr. Vivek Vijay', qualification: 'Associate Professor Department of Mathematics IIT Jodhpur', role: 'MENTOR', image: 'https://edumeasy.com/wp-content/uploads/2025/01/images.jpeg', sortOrder: 1 },
    { name: 'Dr. Sandeep Yadav', qualification: 'Associate Professor Department of Electrical Engineering IIT Jodhpur', role: 'MENTOR', image: 'https://edumeasy.com/wp-content/uploads/2025/01/images-1.jpeg', sortOrder: 2 },
    { name: 'Vivek Sahu', qualification: 'CEO & Founder', role: 'TEAM', image: 'https://edumeasy.com/wp-content/uploads/2025/01/1691921129587.jpeg', sortOrder: 3 },
    { name: 'Sunil Kumar', qualification: 'Chief Operating Officer', role: 'TEAM', image: 'https://edumeasy.com/wp-content/uploads/2024/06/3.png', sortOrder: 4 },
  ];

  // Clean old team members to prevent duplication mismatch
  await prisma.teamMember.deleteMany({});
  for (const member of finalTeam) {
    await prisma.teamMember.create({
      data: {
        name: member.name,
        qualification: member.qualification,
        role: member.role,
        image: member.image,
        sortOrder: member.sortOrder,
      },
    });
  }
  console.log(`Seeded ${finalTeam.length} team members.`);

  // 4. Seed Gallery Images & Testimonials
  await prisma.gallery.deleteMany({});
  const allGallery = [...parsedGalleryImages, ...parsedTestimonials];
  for (const item of allGallery) {
    await prisma.gallery.create({
      data: {
        title: item.title,
        type: item.type,
        url: item.url,
        publicId: item.publicId,
        textContent: item.textContent || null,
      },
    });
  }
  console.log(`Seeded ${allGallery.length} gallery items.`);

  // 5. Seed Math Labs (Primary & Advanced)
  await prisma.mathLab.deleteMany({});
  await prisma.mathLab.create({
    data: {
      id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      title: 'Primary Classes Math Lab',
      description: 'Complete Math Lab setup for primary classes from grade 1 to 5.',
      price: 150000.00,
      level: 'PRIMARY',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      images: {
        create: [
          { url: 'https://res.cloudinary.com/dummy/image/upload/v1/labs/primary_1.jpg', publicId: 'labs/primary_1' },
        ],
      },
      equipment: {
        create: [
          { name: 'Abacus' },
          { name: 'Geoboard' },
          { name: 'Fraction Discs' },
          { name: 'Base Ten Blocks' },
        ],
      },
    },
  });

  await prisma.mathLab.create({
    data: {
      id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
      title: 'Advanced Classes Math Lab',
      description: 'State-of-the-art Math Lab setup for secondary classes from grade 6 to 10.',
      price: 250000.00,
      level: 'ADVANCED',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      images: {
        create: [
          { url: 'https://res.cloudinary.com/dummy/image/upload/v1/labs/advanced_1.jpg', publicId: 'labs/advanced_1' },
        ],
      },
      equipment: {
        create: [
          { name: 'Pythagoras Theorem Kit' },
          { name: 'Algebraic Identity Tiles' },
          { name: '3D Geometric Solids' },
          { name: 'Clinometer' },
        ],
      },
    },
  });
  console.log('Seeded Math Labs.');

  // 6. Seed Math Kits
  await prisma.mathKit.deleteMany({});
  const kits = [
    { title: 'Math Kit Class 6', classNumber: 6, description: 'Curriculum-aligned hands-on math kit for class 6 students.', price: 1200.00, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { title: 'Math Kit Class 7', classNumber: 7, description: 'Curriculum-aligned hands-on math kit for class 7 students.', price: 1300.00, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { title: 'Math Kit Class 8', classNumber: 8, description: 'Curriculum-aligned hands-on math kit for class 8 students.', price: 1400.00, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { title: 'Math Kit Class 9', classNumber: 9, description: 'Curriculum-aligned hands-on math kit for class 9 students.', price: 1500.00, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { title: 'Math Kit Class 10', classNumber: 10, description: 'Curriculum-aligned hands-on math kit for class 10 students.', price: 1600.00, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  ];

  for (const kit of kits) {
    await prisma.mathKit.create({
      data: {
        title: kit.title,
        classNumber: kit.classNumber,
        description: kit.description,
        price: kit.price,
        videoUrl: kit.videoUrl,
        images: {
          create: [
            { url: `https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-4.jpg`, publicId: `kits/kit${kit.classNumber}` },
          ],
        },
      },
    });
  }
  console.log('Seeded Math Kits.');

  // 7. Seed Events
  await prisma.event.deleteMany({});
  const events = [
    { title: 'National Mathematics Day Celebration', description: 'Annual math exhibition and presentation.', type: 'EVENT', date: new Date('2026-12-22T10:00:00Z'), image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80', price: 0.00, schedule: '10:00 AM - 4:00 PM' },
    { title: 'Hands-on Geometry Workshop', description: 'Learn geometry via hands-on origami and model crafting.', type: 'WORKSHOP', date: new Date('2026-08-15T11:00:00Z'), image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80', price: 500.00, schedule: '11:00 AM - 1:00 PM' },
    { title: 'mathAI National Round 2026', description: 'The ultimate competition testing logic, pattern recognition, and mathematical coding.', type: 'OLYMPIAD', date: new Date('2026-11-15T09:00:00Z'), image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1uZ7AJtlcOfa7hLOABsTa8anMSH9H4gO_4rDtHINjWrml58II0SltgAxey47aDg3MH6IwG92_RH0z_3zLl5izPymPmAEBDLtz86iZSeL9wQnD7BmbqowX_N9II3MXMQWeyZ3kUm4P4c7cqtFHzSBwQP_Y2XtILLcgq3JF53_KpLSgb9h_eue1OF6l-GejbNyE6ykMarvoVrrVkn--RjgnqJnJLPVFEtdr4-YRLoSHUPGFvngJCNBhiwf22p4uDpXoxx3TE650T5E', price: 250.00, schedule: '9:00 AM - 12:00 PM' },
  ];

  for (const event of events) {
    await prisma.event.create({
      data: event,
    });
  }
  console.log('Seeded Events.');

  console.log('Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
