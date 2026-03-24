-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: resto_db
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Category_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES ('02550f12-61b4-452c-b307-350b9801dd33','etc','2026-03-24 03:38:44.669'),('06e07a3a-9957-4112-8c6c-2d8f7ef12ea6','Minuman','2026-03-24 03:25:16.676'),('07f77393-12ff-4cfc-9310-216534b5509d','Paket Hemat','2026-03-24 03:25:24.383'),('47cd2345-3691-4c7b-b051-808325a2cf24','Makanan','2026-03-24 03:25:20.256');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menuitem`
--

DROP TABLE IF EXISTS `menuitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menuitem` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` int NOT NULL,
  `image` text COLLATE utf8mb4_unicode_ci,
  `popular` tinyint(1) NOT NULL DEFAULT '0',
  `categoryId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `MenuItem_categoryId_fkey` (`categoryId`),
  CONSTRAINT `MenuItem_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menuitem`
--

LOCK TABLES `menuitem` WRITE;
/*!40000 ALTER TABLE `menuitem` DISABLE KEYS */;
INSERT INTO `menuitem` VALUES ('dbd97762-890c-4fd6-8056-72ead1c7ac36','Kopi susu','Kopi susuuuuuu',18000,'',1,'06e07a3a-9957-4112-8c6c-2d8f7ef12ea6','2026-03-24 03:25:57.197');
/*!40000 ALTER TABLE `menuitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customerName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tableNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `totalAmount` int NOT NULL,
  `paymentMethod` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `paymentStatus` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `orderStatus` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'NEW',
  `qrUrl` text COLLATE utf8mb4_unicode_ci,
  `deepLinkUrl` text COLLATE utf8mb4_unicode_ci,
  `vaNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bankName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isPush` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Order_orderNumber_key` (`orderNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES ('3f4971e6-899f-4273-b4b9-0c1c7eee8a40','ORD-1774325266117','Royyan','88',19800,'midtrans_va','PAID','DELIVERED',NULL,NULL,'18772984930233671455176','bca',0,'2026-03-24 04:07:46.859','2026-03-24 04:08:00.463'),('4974c853-1156-4df0-b3e0-048320e971fa','ORD-1774324704774','krisna','88',19800,'midtrans_va','PAID','DELIVERED',NULL,NULL,'18772176277698471431027','bca',0,'2026-03-24 03:58:25.562','2026-03-24 04:06:25.997'),('5cec6e5a-debb-4307-bafe-2b65fdad08b9','ORD-1774325784241','krisna','881',99000,'midtrans_va','PAID','DELIVERED',NULL,NULL,'18772615316358115374491','bca',0,'2026-03-24 04:16:25.538','2026-03-24 04:17:26.743'),('a5ec0ff0-a4fd-44b8-b7be-84fdc6dcaf12','ORD-1774326109461','Easy Orders','11',39600,'kasir','PAID','DELIVERED',NULL,NULL,NULL,NULL,0,'2026-03-24 04:21:49.465','2026-03-24 04:25:10.316'),('bf3a67e5-bb1d-4730-8986-9a7fc4539f06','ORD-1774324481815','Bunga','12',19800,'midtrans_va','PAID','DELIVERED',NULL,NULL,'18772271333441781745489','bca',0,'2026-03-24 03:54:42.706','2026-03-24 03:55:31.148'),('c7ccb55c-e0cd-436e-87d5-197ae4549d57','ORD-1774326288684','Imam','12',19800,'kasir','PAID','DELIVERED',NULL,NULL,NULL,NULL,0,'2026-03-24 04:24:48.686','2026-03-24 04:25:13.358'),('c8527170-f872-412f-a6b5-3b79fa520c5d','ORD-1774324083513','Adinda bunga','12',19800,'midtrans_va','PAID','DELIVERED',NULL,NULL,'18772679985355527218228','bca',0,'2026-03-24 03:48:04.306','2026-03-24 03:54:24.351'),('d273620a-61ba-4653-94aa-387bce0e1b51','ORD-1774324924927','krisna','12',59400,'midtrans_va','PAID','DELIVERED',NULL,NULL,'18772793544643973126844','bca',0,'2026-03-24 04:02:05.552','2026-03-24 04:06:26.578'),('eacb2867-02e6-427c-8e4a-c1288fe988bd','ORD-1774326657000','Jalu','3',19800,'kasir','PENDING','NEW',NULL,NULL,NULL,NULL,0,'2026-03-24 04:30:57.003','2026-03-24 04:30:57.003'),('f596f914-725f-4b3b-9ba5-edd855ab4269','ORD-1774323687783','Muhammad Royyan','12',19800,'midtrans_qris','PAID','DELIVERED','https://api.sandbox.midtrans.com/v2/qris/5a501bb3-f0ed-4354-8d90-ecbc20c9cf04/qr-code',NULL,NULL,NULL,0,'2026-03-24 03:41:28.374','2026-03-24 03:54:25.654');
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderitem`
--

DROP TABLE IF EXISTS `orderitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderitem` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `menuItemId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `price` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `OrderItem_orderId_fkey` (`orderId`),
  KEY `OrderItem_menuItemId_fkey` (`menuItemId`),
  CONSTRAINT `OrderItem_menuItemId_fkey` FOREIGN KEY (`menuItemId`) REFERENCES `menuitem` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderitem`
--

LOCK TABLES `orderitem` WRITE;
/*!40000 ALTER TABLE `orderitem` DISABLE KEYS */;
INSERT INTO `orderitem` VALUES ('09ec54b1-a40b-48c7-8f4d-52b56b2a28fc','3f4971e6-899f-4273-b4b9-0c1c7eee8a40','dbd97762-890c-4fd6-8056-72ead1c7ac36',1,18000),('20e55818-1bde-421d-9171-bfc55d17a2f7','4974c853-1156-4df0-b3e0-048320e971fa','dbd97762-890c-4fd6-8056-72ead1c7ac36',1,18000),('509eb30b-4620-4b85-b32b-d46dd216926b','d273620a-61ba-4653-94aa-387bce0e1b51','dbd97762-890c-4fd6-8056-72ead1c7ac36',3,18000),('5564f1a0-86c4-4dd2-901c-54aa88f7cd1f','f596f914-725f-4b3b-9ba5-edd855ab4269','dbd97762-890c-4fd6-8056-72ead1c7ac36',1,18000),('9cdd44f6-f408-490b-b99b-01d53b93e7e1','c8527170-f872-412f-a6b5-3b79fa520c5d','dbd97762-890c-4fd6-8056-72ead1c7ac36',1,18000),('ba9ccaf7-9bfb-457e-b9eb-6535b81ea39c','c7ccb55c-e0cd-436e-87d5-197ae4549d57','dbd97762-890c-4fd6-8056-72ead1c7ac36',1,18000),('c224c24b-58f4-4f38-a095-eac82fc67eee','bf3a67e5-bb1d-4730-8986-9a7fc4539f06','dbd97762-890c-4fd6-8056-72ead1c7ac36',1,18000),('d3912eff-3ce0-47df-857f-63f92785b2d4','a5ec0ff0-a4fd-44b8-b7be-84fdc6dcaf12','dbd97762-890c-4fd6-8056-72ead1c7ac36',2,18000),('e3a62078-137c-4241-8426-21e4af5adf81','eacb2867-02e6-427c-8e4a-c1288fe988bd','dbd97762-890c-4fd6-8056-72ead1c7ac36',1,18000),('fa964378-c745-4451-932c-2b4e82e4d3ee','5cec6e5a-debb-4307-bafe-2b65fdad08b9','dbd97762-890c-4fd6-8056-72ead1c7ac36',5,18000);
/*!40000 ALTER TABLE `orderitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CASHIER',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('48ac82f6-be5c-4e85-842c-7d5b4673db16','Super Admin','admin@admin.com','$2b$10$XTetWtvTkU137mAOAgmYguXMYcoOwLhmHOnSZUV8foY3nJ8VYiNlm','ADMIN','2026-03-24 03:32:32.518');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-24 11:37:46
