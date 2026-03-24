import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Dapatkan atau Buat Cabang Default
  let branch = await prisma.branch.findFirst({ orderBy: { createdAt: 'asc' }});
  if (!branch) {
      branch = await prisma.branch.create({ data: { name: 'Pusat (Headquarters)' }});
      console.log('✅ Cabang Utama berhasil didirikan:', branch.name);
  }

  // 2. Buat Akun Kustom Sesuai Permintaan
  const email = 'admin@admin.com';
  const plainPassword = 'password';
  const hashedPassword = bcrypt.hashSync(plainPassword, 10);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword, role: 'SUPERADMIN' },
    create: {
      name: 'Root Administrator',
      email: email,
      password: hashedPassword,
      role: 'SUPERADMIN',
      // Karena dia SUPERADMIN, branchId dibiarkan Null (Akses Global)
    }
  });
  console.log(`✅ Akses Diterbitkan: E: ${user.email} | P: ${plainPassword}`);

  // 3. Buat Kategori Dummy Khusus Cabang Pusat
  const catMakanan = await prisma.category.create({
    data: { name: 'Makanan Spesial', branchId: branch.id }
  });
  const catMinuman = await prisma.category.create({
    data: { name: 'Minuman Segar', branchId: branch.id }
  });
  console.log('✅ 2 Kategori Utama dibuat');

  // 4. Buat Item Menu Dummy
  await prisma.menuItem.createMany({
    data: [
      {
        name: 'Nasi Goreng Gila',
        description: 'Nasi goreng super pedas dengan topping daging melimpah ruah.',
        price: 32000,
        popular: true,
        categoryId: catMakanan.id,
        branchId: branch.id,
      },
      {
        name: 'Ayam Bakar Madu',
        description: 'Potongan ayam dibakar perlahan dengan olesan madu hutan legit.',
        price: 35000,
        popular: false,
        categoryId: catMakanan.id,
        branchId: branch.id,
      },
      {
        name: 'Es Kopi Susu Aren',
        description: 'Kopi espresso robusta dipadukan susu krimer dan gula aren.',
        price: 18000,
        popular: true,
        categoryId: catMinuman.id,
        branchId: branch.id,
      },
      {
        name: 'Wedang Jahe Merah',
        description: 'Penghangat tubuh berbahan baku 100% rempah jahe keraton asli.',
        price: 15000,
        popular: false,
        categoryId: catMinuman.id,
        branchId: branch.id,
      }
    ]
  });
  console.log('✅ 4 Katalog Menu sukses diinjeksikan!');
  console.log('-------------------------------------------');
  console.log('🏆 SEEDING DATABASE MULTI-CABANG SELESAI');
}

main()
  .catch(e => {
    console.error('❌ Gagal Seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
