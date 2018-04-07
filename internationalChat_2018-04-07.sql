# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.18)
# Database: internationalChat
# Generation Time: 2018-04-07 16:51:59 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table Account
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Account`;

CREATE TABLE `Account` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `Username` varchar(255) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `DisplayName` varchar(255) DEFAULT NULL,
  `Picture` int(11) DEFAULT NULL,
  `LanguagesKnown` text,
  `LearnLanguage` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table ChatRooms
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ChatRooms`;

CREATE TABLE `ChatRooms` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) DEFAULT NULL,
  `Users` text,
  `ChatHistory` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `ChatRooms` WRITE;
/*!40000 ALTER TABLE `ChatRooms` DISABLE KEYS */;

INSERT INTO `ChatRooms` (`id`, `Name`, `Users`, `ChatHistory`)
VALUES
	(2,'English',NULL,NULL),
	(3,'Chinese',NULL,NULL),
	(4,'French',NULL,NULL),
	(5,'Hindi',NULL,NULL),
	(6,'Tagalog',NULL,NULL),
	(7,'Arabic',NULL,NULL),
	(8,'Spanish',NULL,NULL),
	(9,'Vietnamese',NULL,NULL),
	(10,'Portuguese',NULL,NULL),
	(11,'Russian',NULL,NULL),
	(12,'Dutch',NULL,NULL),
	(13,'Italian',NULL,NULL),
	(14,'Swahili',NULL,NULL),
	(15,'Klingon',NULL,NULL);

/*!40000 ALTER TABLE `ChatRooms` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
