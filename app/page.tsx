import MenuClient from './MenuClient';

// Dummy Data Server Output
const categories = [
  { id: 'c1', name: 'Paket Bundling Promo' },
  { id: 'c2', name: 'Coffee & Espresso' },
  { id: 'c3', name: 'Non-Coffee' },
  { id: 'c4', name: 'Snack & Pastry' },
];

const menuItems = [
  {
    id: '1',
    name: 'Es Kopi Susu Gula Aren',
    description: 'Espresso house blend dipadukan dengan susu segar creamy dan gula aren murni yang legit.',
    price: 22000,
    categoryId: 'c2',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=500&q=80',
    popular: true
  },
  {
    id: '2',
    name: 'Ice Americano',
    description: 'Double shot espresso murni dengan bongkahan es. Sangat segar dan cocok untuk menjaga fokus Anda.',
    price: 18000,
    categoryId: 'c2',
    image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=500&q=80',
    popular: true
  },
  {
    id: '3',
    name: 'Caramel Macchiato',
    description: 'Paduan harmonis espresso, susu vanilla hangat/dingin, dengan siraman saus karamel lezat di atasnya.',
    price: 35000,
    categoryId: 'c2',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=500&q=80',
    popular: false
  },
  {
    id: '4',
    name: 'Premium Matcha Latte',
    description: 'Serbuk Uji Matcha asli Jepang diseduh lambat bersama susu segar untuk tekstur silky yang menenangkan.',
    price: 30000,
    categoryId: 'c3',
    image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=500&q=80',
    popular: true
  },
  {
    id: '5',
    name: 'French Fries & Sausage Platter',
    description: 'Porsi besar kentang krispi berbumbu rahasia beserta potongan sosis bratwurst premium bakar.',
    price: 28000,
    categoryId: 'c4',
    image: 'https://images.unsplash.com/photo-1580959050965-edced1fe1cda?auto=format&fit=crop&w=500&q=80',
    popular: true
  },
  {
    id: '6',
    name: 'Classic Butter Croissant',
    description: 'Pastry renyah ala Prancis dengan lapisan flaky di luar dan aroma lumeran pure butter di alamnya.',
    price: 25000,
    categoryId: 'c4',
    image: 'https://images.unsplash.com/photo-1549903072-7e6e00b1d30c?auto=format&fit=crop&w=500&q=80',
    popular: false
  },
  {
    id: '7',
    name: 'Paket WFC (Work From Cafe)',
    description: 'Bundling super hemat para pekerja! Dapatkan 1 Iced Americano + 1 Butter Croissant hangat garing.',
    price: 39000,
    categoryId: 'c1',
    image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=500&q=80',
    popular: true
  },
  {
    id: '8',
    name: 'Paket Nongkrong Berdua',
    description: 'Bundling ngerumpi teman: 2 Gelas Kopi Susu Gula Aren + 1 Porsi French Fries & Sausage Platter.',
    price: 65000,
    categoryId: 'c1',
    image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=500&q=80',
    popular: true
  },
];

export default function MenuPage() {
  return <MenuClient categories={categories} menuItems={menuItems} />;
}
