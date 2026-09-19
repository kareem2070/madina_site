import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { headers } from 'next/headers';
import { prisma } from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

const sendMailWithRetry = async (transporter: any, mailOptions: any, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('تم إرسال البريد بنجاح:', info);
      return true;
    } catch (error) {
      console.error(`محاولة ${attempt} فشلت:`, error);
      if (attempt === maxRetries) throw error;
      // انتظر قبل المحاولة التالية
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
    }
  }
};

export async function POST(req: Request) {
  const headersList = headers();
  
  try {
    const { name, address, email, service, message } = await req.json();

    // استرجاع عنوان الخدمة من قاعدة البيانات
    const serviceData = await prisma.service.findUnique({
      where: {
        id: parseInt(service)
      },
      select: {
        title: true
      }
    });

    // استرجاع معلومات الاتصال من قاعدة البيانات
    const contactInfo = await prisma.contactInfo.findFirst({
      select: {
        email: true
      }
    });

    if (!contactInfo) {
      throw new Error('لم يتم العثور على معلومات الاتصال');
    }

    const serviceName = serviceData?.title || 'غير محدد';

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER || 'ashrafmoner7@gmail.com',
        pass: process.env.EMAIL_PASS || 'wldw hult llyg spgh',
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      debug: true,
      tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1'
      }
    });

    // التحقق من صحة اتصال البريد
    await transporter.verify().catch((err) => {
      console.error('خطأ في التحقق من البريد:', err);
      throw new Error(`فشل التحقق من اتصال البريد: ${err.message}`);
    });

    const mailOptions = {
      from: {
        name: name,
        address: process.env.EMAIL_USER || 'ashrafmoner7@gmail.com'
      },
      to: contactInfo.email,
      replyTo: email,
      subject: 'رسالة جديدة من نموذج الاتصال',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="background-color: #4CAF50; color: white; padding: 10px; text-align: center; border-radius: 8px 8px 0 0;">رسالة جديدة من نموذج الاتصال</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px; font-weight: bold; width: 150px;">الاسم:</td>
              <td style="padding: 10px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">العنوان:</td>
              <td style="padding: 10px;">${address}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px; font-weight: bold;">البريد الإلكتروني:</td>
              <td style="padding: 10px;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">نوع الخدمة:</td>
              <td style="padding: 10px;">${serviceName}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px; font-weight: bold;">الرسالة:</td>
              <td style="padding: 10px;">${message}</td>
            </tr>
          </table>
          <p style="text-align: center; color: #777; font-size: 14px; margin-top: 20px;">شكراً لاستخدامك نموذج الاتصال الخاص بنا.</p>
        </div>
      `
    };

    await sendMailWithRetry(transporter, mailOptions);

    return NextResponse.json({ 
      success: true, 
      message: 'تم إرسال البريد الإلكتروني بنجاح' 
    });

  } catch (error: any) {
    console.error('تفاصيل الخطأ:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      command: error.command
    });

    return NextResponse.json({
      success: false,
      message: 'حدث خطأ أثناء إرسال البريد',
      error: error.message,
      errorCode: error.code
    }, { 
      status: 500 
    });
  }
}