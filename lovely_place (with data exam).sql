-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.28-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for lovely_place
CREATE DATABASE IF NOT EXISTS `lovely_place` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `lovely_place`;

-- Dumping structure for table lovely_place.posts
CREATE TABLE IF NOT EXISTS `posts` (
  `post_id` int(11) NOT NULL AUTO_INCREMENT,
  `post_title` varchar(100) NOT NULL,
  `post_preDes` varchar(255) DEFAULT NULL,
  `post_descript` text DEFAULT NULL,
  `post_img` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`post_id`),
  KEY `posts_users` (`user_id`),
  CONSTRAINT `posts_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table lovely_place.posts: ~6 rows (approximately)
DELETE FROM `posts`;
INSERT INTO `posts` (`post_id`, `post_title`, `post_preDes`, `post_descript`, `post_img`, `user_id`) VALUES
	(16, 'คณะเทคโนโลยี มหาลัยพะเยา', 'ไม่รู้ว่าสามารถท่องเที่ยว และพักผ่อนได้มั้ยนะ แต่ดูหมอกนั่นสิ', 'เรื่องของเรื่องมีอยู่ว่าต้องไปเรียนเช้าครับ 8.00 น. แหนะ แต่สิ่งที่ได้ตอบแทนคือวิวนี้ โหหหหห!! หมอกแบบ บรรยากาศแบบ ความหนาวแบบ สุดยอดดดดดดดดดด!! สำหรับคนทั่วไปอยากรับบรรยากาศแบบนี้ ก็สามารถมาวิ่งๆ เล่นบริเวณอ่างเก็บน้ำได้นะครับ', '1707346333639.jpg', 1),
	(18, 'งานลอยกระทงสุโขทัย', 'จะมีงานลอยกระทงที่ไหนที่ยิ่งใหญ่ไปกว่าจังหวัดต้นกำเนิดล่ะ!!', 'ภาพนี้ค่อนข้างเก่าแล้วครับ แต่จะเห็นได้ว่า คนเยอะมว้ากกกกกกกกกก แถมบรรยายกาศดีสุดๆ สำหรับคนที่อยากไป ไม่ต้องห่วงครับ งานแบบนี้ บรรยากาศแบบนี้มีทุกปี วันลอยกระทงก็อย่าลืมไปเที่ยวพักผ่อนกันนะครับ "ในชีวิตต้องได้ไปถิ่นกำเนิดเทศกาลลอยกระทงสักครั้ง!!"', '1707347520551.jpg', 5),
	(19, 'กว๊านพะเยา', 'สถานที่สุดโด่งดัง ทะเลสาบน้ำจืดที่ใหญ่ที่สุดในภาคเหนือ!!', 'เป็นแหล่งพักผ่อนชั้นดีของคนพะเยา รวมถึงนักศึกษาอย่างเราด้วย ถึงจะไกลจากหน้ามอไปหน่อย แต่ไปถึงทีไรก็ฮีลใจได้ตลอด บรรยายกาศสุดชิล ลมพัดเย็นๆ ตลอดเวลา ของกิน ร้านค้ารอบๆ กว๊าน ฟิน!!', '1707347781401.jpg', 6),
	(20, 'อุทยานแห่งชาติศรีสัชนาลัย', 'สายแคมป์บอกเลย ฟินนน!!', 'ไปกางเต้นท์ปิ้งของกินได้ฟีลสุดๆ หรือสำหรับใครที่ใม่ใช่สายแคมป์ขนาดนั้น เขาก็มีบ้านพักให้นะเออ บรรยากาศจัดว่าดีสุดๆ อยู่กลางธรรมชาติ ไปสูดโอโซนให้เต็มปอดก็คุ้มแล้วเอาจริงแก', '1707348059779.jpg', 5),
	(21, 'ห้องซ้อมดนตรีไผ่ล้อม สวรรคโลก', 'ห้องซ้อมดนตรีที่เด็กๆ สวรรคโลกมาปลดปล่อยบรรเลงเพลง', 'ใครเป็นเด๋กหวันโลก โข๋ทัย ไม่รู้จั๊กไม่ได้หนา สถานที่ซ้อมดนตรีสุดฮิตของทุกคนตั้งแต่เด็กนักเรียน ยันนักดนตรีอาชีพ ด้วยอุปกรณ์ที่ครบครัน สะอาด สวยอีกด้วย เหมือนเห็นว่าเพิ่งสร้างห้องซ้อมใหม่อลังการกว่าเดิม ลองไปเล่นกันได้จ้า ราคาไม่แพง', '1707348356115.jpg', 1),
	(22, 'อ่างเก็บน้ำแม่ต๋ำ', 'สถานที่สุดชิลที่เด็กมอพะเยาต้องเคยไป!!', 'ถึงจะเคยไป แต่ก็ต้องได้ยินกันอย่างเป็นประจำสำหรับอ่างเก็บน้ำแม่ต๋า สถานที่แสนชิว นั่งตากลม คือหมายถึงตากลมอะ ไม่ใช่ตากลมนะ นั่นแหละ ในตอนกลางคืนก็ยังถือว่าเป็นที่นอนดูดาวที่ดีมากอีกดั๊วะ ยิ่งช่วงไหนมีดาวตกนะ คนไปนอนดูกันเต็มไปหมด แต่ขอแนะนำช่วงไม่มีดาวตก ก็พาเพื่อนไปเยอะๆ นิดนึง มันมืดอะ เวรี่ๆ ไปน้อยคนจะน่ากลัวเอาเด้อ ระวังได้โทรไปเล่า the ghost', '1707348647627.jpg', 6);

-- Dumping structure for table lovely_place.reports
CREATE TABLE IF NOT EXISTS `reports` (
  `report_id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL,
  `report_message` text DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`report_id`),
  KEY `post_id` (`post_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `reports_posts` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reports_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table lovely_place.reports: ~0 rows (approximately)
DELETE FROM `reports`;
INSERT INTO `reports` (`report_id`, `post_id`, `report_message`, `user_id`) VALUES
	(5, 22, 'โพสต์นี้ไม่เหมาะสม', 1);

-- Dumping structure for table lovely_place.users
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(50) NOT NULL,
  `user_password` varchar(50) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table lovely_place.users: ~3 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`user_id`, `user_name`, `user_password`) VALUES
	(1, 'adminLPW', 'lovelyplace'),
	(5, 'martin', '1234'),
	(6, 'jack', '1234');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
