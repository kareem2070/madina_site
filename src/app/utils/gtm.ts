/**
 * Google Tag Manager & Conversion Tracking Utilities
 * نظام احترافي لإدارة التتبع والإحالات الناجحة
 */

// تعريف أنواع الأحداث
export type ConversionEvent = 
  | 'phone_call' 
  | 'whatsapp_click' 
  | 'contact_form_submit';

export type TrackingEvent = ConversionEvent
  | 'email_click'
  | 'service_view'
  | 'product_view'
  | 'blog_view';

// تعريف بيانات الحدث
export interface GTMEventData {
  event: string;
  eventCategory?: string;
  eventAction?: string;
  eventLabel?: string;
  eventValue?: number;
  conversionLabel?: string;
  phoneNumber?: string;
  serviceName?: string;
  productName?: string;
  pageUrl?: string;
  [key: string]: any;
}

/**
 * إرسال حدث إلى Google Tag Manager
 */
export const sendGTMEvent = (eventData: GTMEventData): void => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(eventData);
    console.log('📊 GTM Event Sent:', eventData);
  }
};

/**
 * تتبع الإحالة الناجحة لإعلانات Google
 */
export const trackConversion = (
  conversionType: ConversionEvent,
  additionalData?: Partial<GTMEventData>
): void => {
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const conversionLabels: Record<ConversionEvent, string | undefined> = {
    phone_call: process.env.NEXT_PUBLIC_CONVERSION_LABEL_PHONE,
    whatsapp_click: process.env.NEXT_PUBLIC_CONVERSION_LABEL_WHATSAPP,
    contact_form_submit: process.env.NEXT_PUBLIC_CONVERSION_LABEL_CONTACT_FORM,
  };

  const conversionLabel = conversionLabels[conversionType];

  // إرسال الحدث إلى Google Tag Manager
  const eventData: GTMEventData = {
    event: 'conversion',
    eventCategory: 'Conversion',
    eventAction: conversionType,
    eventLabel: additionalData?.eventLabel || conversionType,
    send_to: conversionLabel && adsId
      ? `${adsId}/${conversionLabel}`
      : undefined,
    ...additionalData,
  };

  sendGTMEvent(eventData);

  // إرسال الحدث مباشرة إلى Google Ads (gtag)
  if (typeof window !== 'undefined' && window.gtag && adsId && conversionLabel) {
    window.gtag('event', 'conversion', {
      send_to: `${adsId}/${conversionLabel}`,
      event_category: 'Conversion',
      event_label: conversionType,
      ...additionalData,
    });
  }
};

/**
 * تتبع النقر على زر الاتصال
 */
export const trackPhoneClick = (phoneNumber: string, source: 'floating' | 'contact_section' = 'floating'): void => {
  trackConversion('phone_call', {
    eventLabel: `Phone Click - ${source}`,
    phoneNumber,
    buttonLocation: source,
    pageUrl: window.location.href,
  });

  // إرسال حدث إضافي للتحليلات
  sendGTMEvent({
    event: 'phone_click',
    eventCategory: 'Engagement',
    eventAction: 'Click',
    eventLabel: `Phone - ${source}`,
    phoneNumber,
    buttonLocation: source,
  });
};

/**
 * تتبع النقر على زر الواتساب
 */
export const trackWhatsAppClick = (phoneNumber: string, source: 'floating' | 'contact_section' = 'floating'): void => {
  trackConversion('whatsapp_click', {
    eventLabel: `WhatsApp Click - ${source}`,
    phoneNumber,
    buttonLocation: source,
    pageUrl: window.location.href,
  });

  // إرسال حدث إضافي للتحليلات
  sendGTMEvent({
    event: 'whatsapp_click',
    eventCategory: 'Engagement',
    eventAction: 'Click',
    eventLabel: `WhatsApp - ${source}`,
    phoneNumber,
    buttonLocation: source,
  });
};

/**
 * تتبع إرسال نموذج التواصل
 */
export const trackContactFormSubmit = (formData: {
  name?: string;
  email?: string;
  service?: string;
  message?: string;
}): void => {
  trackConversion('contact_form_submit', {
    eventLabel: 'Contact Form Submitted',
    formName: formData.name,
    formEmail: formData.email,
    formService: formData.service,
    pageUrl: window.location.href,
  });

  // إرسال حدث إضافي للتحليلات
  sendGTMEvent({
    event: 'form_submit',
    eventCategory: 'Form',
    eventAction: 'Submit',
    eventLabel: 'Contact Form',
    ...formData,
  });
};

/**
 * تتبع النقر على البريد الإلكتروني
 */
export const trackEmailClick = (email: string, source: string = 'contact_section'): void => {
  sendGTMEvent({
    event: 'email_click',
    eventCategory: 'Engagement',
    eventAction: 'Click',
    eventLabel: `Email - ${source}`,
    email,
    buttonLocation: source,
    pageUrl: window.location.href,
  });
};

/**
 * تتبع عرض صفحة الخدمة
 */
export const trackServiceView = (serviceName: string, serviceId?: number): void => {
  sendGTMEvent({
    event: 'service_view',
    eventCategory: 'Service',
    eventAction: 'View',
    eventLabel: serviceName,
    serviceName,
    serviceId,
    pageUrl: window.location.href,
  });
};

/**
 * تتبع عرض صفحة المنتج
 */
export const trackProductView = (productName: string, productId?: number): void => {
  sendGTMEvent({
    event: 'product_view',
    eventCategory: 'Product',
    eventAction: 'View',
    eventLabel: productName,
    productName,
    productId,
    pageUrl: window.location.href,
  });
};

/**
 * تتبع عرض صفحة المقال
 */
export const trackBlogView = (blogTitle: string, blogSlug: string): void => {
  sendGTMEvent({
    event: 'blog_view',
    eventCategory: 'Blog',
    eventAction: 'View',
    eventLabel: blogTitle,
    blogTitle,
    blogSlug,
    pageUrl: window.location.href,
  });
};

/**
 * تتبع التفاعل مع وسائل التواصل الاجتماعي
 */
export const trackSocialClick = (platform: string, url: string): void => {
  sendGTMEvent({
    event: 'social_click',
    eventCategory: 'Social Media',
    eventAction: 'Click',
    eventLabel: platform,
    socialPlatform: platform,
    socialUrl: url,
    pageUrl: window.location.href,
  });
};

/**
 * تتبع عرض الصفحة (Page View)
 */
export const trackPageView = (pagePath: string, pageTitle?: string): void => {
  sendGTMEvent({
    event: 'pageview',
    page_path: pagePath,
    page_title: pageTitle || document.title,
    page_location: window.location.href,
  });
};

/**
 * تهيئة التتبع عند تحميل الصفحة
 */
export const initializeTracking = (): void => {
  if (typeof window !== 'undefined') {
    // تتبع عرض الصفحة الأولى
    trackPageView(window.location.pathname, document.title);

    // إضافة مستمع للنقرات على الروابط الخارجية
    document.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest('a');
      if (target && target.href) {
        const url = new URL(target.href, window.location.href);
        
        // تتبع الروابط الخارجية
        if (url.hostname !== window.location.hostname) {
          sendGTMEvent({
            event: 'outbound_click',
            eventCategory: 'Outbound Link',
            eventAction: 'Click',
            eventLabel: url.href,
            outboundUrl: url.href,
          });
        }
      }
    });
  }
};

// تعريف نوع window.dataLayer
declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}


