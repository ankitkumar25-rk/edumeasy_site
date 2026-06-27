import '../config/env.js';
import prisma from '../config/db.js';
import { Resend } from 'resend';
import logger from '../utils/logger.js';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const createEnquiry = async (req, res, next) => {
  try {
    const { name, email, phone, schoolName = '', city = '', message } = req.body;

    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        email,
        phone,
        schoolName,
        city,
        message,
      },
    });

    const contactEmail = process.env.CONTACT_EMAIL || 'info@edumeasy.com';
    const senderEmail = process.env.RESEND_SENDER_EMAIL || 'onboarding@resend.dev';

    if (resend) {
      try {
        await resend.emails.send({
          from: senderEmail,
          to: contactEmail,
          subject: `New Contact Enquiry from ${name}`,
          html: `
            <h3>New Contact Enquiry Received</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>School Name:</strong> ${schoolName}</p>
            <p><strong>City:</strong> ${city}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `,
        });
        logger.info({ email: contactEmail }, 'Resend email notification sent successfully');
      } catch (err) {
        logger.warn({ err }, 'Failed to send email notification via Resend');
      }
    } else {
      logger.warn('Resend API key is missing. Skipping email notification.');
    }

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully',
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
};

export const getEnquiries = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Administrator permissions required',
      });
    }

    const { limit = 10, page = 1 } = req.query;

    const limitVal = parseInt(limit, 10);
    const pageVal = parseInt(page, 10);

    const count = await prisma.enquiry.count();
    const totalPages = Math.ceil(count / limitVal);

    const data = await prisma.enquiry.findMany({
      skip: (pageVal - 1) * limitVal,
      take: limitVal,
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      count,
      page: pageVal,
      totalPages,
      data,
    });
  } catch (error) {
    next(error);
  }
};
