import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      <div className={`glass-panel ${styles.heroPanel}`}>
        <h1 className={styles.heroTitle}>Resto Modern</h1>
        <p className={styles.heroSubtitle}>
          Experience seamless dining. Please scan the QR code on your table to browse the menu and order instantly, or try the interactive demo below.
        </p>
        
        <div className={styles.actionButtons}>
          <Link href="/table/1" className="btn btn-primary">
            Menu Demo (Table 1)
          </Link>
          <Link href="/admin" className={`btn ${styles.glassBtn}`}>
            Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
