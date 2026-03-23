import Link from 'next/link';
import styles from './table.module.css';

export default async function TableLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tableId: string }>;
}) {
  const { tableId } = await params;

  return (
    <div className={styles.customerLayout}>
      <header className={`glass-panel ${styles.header}`}>
        <div className="container">
          <div className={styles.headerContent}>
            <Link href="/" className={styles.logo}>Resto Modern</Link>
            <div className={styles.tableBadge}>Table {tableId}</div>
          </div>
        </div>
      </header>
      
      <main className={styles.mainContent}>
        {children}
      </main>
      
      {/* Pending: Floating Cart Drawer Component */}
    </div>
  );
}
