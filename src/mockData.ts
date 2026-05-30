import { Product, Order, Category } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'all', name: 'همه دسته‌بندی‌ها', emoji: '✨' },
  { id: 'digital', name: 'کالای دیجیتال', emoji: '💻' },
  { id: 'fashion', name: 'پوشاک و مد', emoji: '👕' },
  { id: 'food', name: 'کالای اساسی و غذا', emoji: '🍎' },
  { id: 'home', name: 'خانه و دکوراسیون', emoji: '🏠' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'تلفن همراه آیفون ۱۵ پرو ۲۵۶ گیگابایت',
    price: 64900000,
    category: 'digital',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=600',
    discount: 5,
    rating: 4.8,
    stock: 12,
    salesCount: 43,
    description: 'گوشی پرچمدار اپل با بدنه تیتانیومی، تراشه قدرتمند A17 Pro و دوربین ۴۸ مگاپیکسلی سه‌گانه با زوم اپتیکال بی‌نظیر.',
  },
  {
    id: 'prod-2',
    name: 'کیبورد مکانیکال گیمینگ RGB مدل Keychron K2',
    price: 4950000,
    category: 'digital',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600',
    discount: 10,
    rating: 4.7,
    stock: 8,
    salesCount: 124,
    description: 'کیبورد مکانیکال ۷۵٪ بی‌سیم با نورپردازی آرجی‌بی، سوییچ‌های قهوه‌ای با کیفیت و سازگاری کامل با مک و ویندوز.',
  },
  {
    id: 'prod-3',
    name: 'ساعت هوشمند هیبریدی شیائومی سری واچ',
    price: 8200000,
    category: 'digital',
    image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=600',
    discount: 15,
    rating: 4.4,
    stock: 25,
    salesCount: 95,
    description: 'صفحه نمایش آمولد روشن، سنسورهای پایش اکسیژن خون و ضربان قلب، عمر باتری ۱۴ روزه با بیش از ۱۰۰ حالت ورزشی.',
  },
  {
    id: 'prod-4',
    name: 'کاپشن چرم طبیعی کلاسیک طرح تبریز',
    price: 3600000,
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600',
    discount: 20,
    rating: 4.9,
    stock: 5,
    salesCount: 18,
    description: 'تولید شده از چرم صد درصد طبیعی، آستر گرم و لطیف داخلی با دکمه‌ها و زیپ‌های بسیار بادوام و گارانتی اصل بودن کالا.',
  },
  {
    id: 'prod-5',
    name: 'کفش رانینگ مردانه تنفس‌پذیر نایک مشکی',
    price: 5200000,
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
    discount: 0,
    rating: 4.6,
    stock: 14,
    salesCount: 61,
    description: 'بسیار سبک و نرم با کفی ضربه‌گیر، مناسب دویدن‌های طولانی و پیاده‌روی روزانه با رویه مشبک برای تنفس هوا.',
  },
  {
    id: 'prod-6',
    name: 'زعفران ممتاز خراسان سرگل صادراتی ۴ گرمی',
    price: 480000,
    category: 'food',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600',
    discount: 12,
    rating: 4.9,
    stock: 40,
    salesCount: 220,
    description: 'زعفران سرگل اصل قائنات، با عالی‌ترین درجه عطر و رنگ‌دهی طبیعی، بسته‌بندی شده در قوطی فلزی محافظ برای حفظ رایحه.',
  },
  {
    id: 'prod-7',
    name: 'عسل طبیعی کوهستان پونه وحشی سبلان - یک کیلو',
    price: 320000,
    category: 'food',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600',
    discount: 8,
    rating: 4.5,
    stock: 50,
    salesCount: 147,
    description: 'عسل صد درصد طبیعی ارگانیک حاصل شهد گل‌های وحشی دامنه‌های کوهستان سبلان با ساکارز زیر ۲ درصد.',
  },
  {
    id: 'prod-8',
    name: 'چراغ مطالعه مینیمال بازویی کلاسیک متالیک',
    price: 1450000,
    category: 'home',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600',
    discount: 15,
    rating: 4.3,
    stock: 15,
    salesCount: 52,
    description: 'پایه سنگین ضد لغزش، بدنه فلزی انعطاف‌پذیر با بازوی تنظیم ارتفاع و زاویه تابش نور؛ دکوراتیو و بسیار کاربردی.',
  },
  {
    id: 'prod-9',
    name: 'ماگ سفالی دست‌ساز فانتزی لعاب‌دار',
    price: 180000,
    category: 'home',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    discount: 0,
    rating: 4.7,
    stock: 30,
    salesCount: 310,
    description: 'ساخته شده توسط هنرمندان لالجین همدان، قابل استفاده در مایکروویو و ماشین ظرفشویی، لعاب ضد سرب و بهداشتی.',
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'order-1024',
    customerName: 'علیرضا حسینی',
    customerPhone: '۰۹۱۲۳۴۵۶۷۸۹',
    customerAddress: 'تهران، سعادت آباد، خیابان سرو غربی، پلاک ۱۲، واحد ۴',
    date: '۱۴۰۵/۰۳/۰۸',
    items: [
      { productId: 'prod-2', name: 'کیبورد مکانیکال گیمینگ RGB مدل Keychron K2', price: 4455000, quantity: 1 }
    ],
    totalPrice: 4455000,
    status: 'paid'
  },
  {
    id: 'order-1025',
    customerName: 'سارا کریمی',
    customerPhone: '۰۹۱۹۸۷۶۵۴۳۲',
    customerAddress: 'اصفهان، خیابان چهارباغ عباسی، مجتمع صدف، طبقه ۲',
    date: '۱۴۰۵/۰۳/۰۹',
    items: [
      { productId: 'prod-6', name: 'زعفران ممتاز خراسان سرگل صادراتی ۴ گرمی', price: 422400, quantity: 2 },
      { productId: 'prod-9', name: 'ماگ سفالی دست‌ساز فانتزی لعاب‌دار', price: 180000, quantity: 1 }
    ],
    totalPrice: 1024800,
    status: 'paid'
  },
  {
    id: 'order-1026',
    customerName: 'محمد رضایی',
    customerPhone: '۰۹۳۵۴۴۴۳۳۲۲',
    customerAddress: 'مشهد، بلوار وکیل‌آباد، کوچه دانشجو ۱۵، پلاک ۸',
    date: '۱۴۰۵/۰۳/۰۹',
    items: [
      { productId: 'prod-5', name: 'کفش رانینگ مردانه تنفس‌پذیر نایک مشکی', price: 5200000, quantity: 1 }
    ],
    totalPrice: 5200000,
    status: 'pending'
  },
  {
    id: 'order-1027',
    customerName: 'نیلوفر امینی',
    customerPhone: '۰۹۱۵۳۳۳۲۲۱۱',
    customerAddress: 'شیراز، معالی آباد، مجتمع گاندی، واحد ۳۱',
    date: '۱۴۰۵/۰۳/۱۰',
    items: [
      { productId: 'prod-8', name: 'چراغ مطالعه مینیمال بازویی کلاسیک متالیک', price: 1232500, quantity: 1 },
      { productId: 'prod-7', name: 'عسل طبیعی کوهستان پونه وحشی سبلان - یک کیلو', price: 294400, quantity: 3 }
    ],
    totalPrice: 2115700,
    status: 'cancelled'
  }
];
