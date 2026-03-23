import styles from './table.module.css';

// Dummy Data
const categories = [
  { id: 'c1', name: 'Signature Mains' },
  { id: 'c2', name: 'Refreshments' },
  { id: 'c3', name: 'Desserts' },
];

const menuItems = [
  {
    id: '1',
    name: 'Wagyu Truffle Burger',
    description: 'Premium wagyu beef patty with truffle mayo.',
    price: 125000,
    categoryId: 'c1',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80',
    popular: true
  },
  {
    id: '2',
    name: 'Spicy Salmon Roll',
    description: 'Fresh salmon with spicy mayo, caviar, and avocado.',
    price: 85000,
    categoryId: 'c1',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=500&q=80',
    popular: false
  },
  {
    id: '3',
    name: 'Lychee Mojito Mint',
    description: 'Refreshing mocktail with fresh lychee, mint leaves.',
    price: 35000,
    categoryId: 'c2',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80',
    popular: false
  }
];

export default async function MenuPage({ params }: { params: Promise<{ tableId: string }> }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { tableId } = await params;
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className={`container ${styles.menuContainer}`}>
      <div className={styles.greeting}>
        <h2>Good Evening!</h2>
        <p>What are you craving today?</p>
      </div>

      <div className={styles.categoryScroll}>
        {categories.map((cat, idx) => (
          <button key={cat.id} className={`${styles.categoryBtn} ${idx === 0 ? styles.active : ''}`}>
            {cat.name}
          </button>
        ))}
      </div>

      <div className={styles.menuList}>
        {menuItems.map(item => (
          <div key={item.id} className={styles.menuListItem}>
            <div className={styles.itemInfo}>
              <div className={styles.itemHeader}>
                <h3 className={styles.itemName}>{item.name}</h3>
                {item.popular && <span className={styles.badgePopular}>★ Popular</span>}
              </div>
              <p className={styles.itemDesc}>{item.description}</p>
              <div className={styles.itemFooter}>
                <span className={styles.price}>{formatPrice(item.price)}</span>
                <button className={`btn btn-primary ${styles.addButton}`}>Add</button>
              </div>
            </div>
            
            <div className={styles.imageWrapper}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.name} className={styles.menuImage} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
