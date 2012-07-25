-- phpMyAdmin SQL Dump
-- version 3.2.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 25, 2012 at 01:21 AM
-- Server version: 5.1.44
-- PHP Version: 5.2.13

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Database: `campus_conquest`
--

-- --------------------------------------------------------

--
-- Table structure for table `q_games`
--

CREATE TABLE `q_games` (
  `game_id` int(11) NOT NULL AUTO_INCREMENT,
  `game_title` varchar(255) NOT NULL,
  `game_desc` text NOT NULL,
  `game_created` datetime NOT NULL,
  `game_start` datetime NOT NULL,
  `game_turn` int(11) NOT NULL,
  PRIMARY KEY (`game_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `q_games`
--

INSERT INTO `q_games` VALUES(1, 'Game 1', 'This is the first game that has ever been created! woohoo!', '2012-06-30 22:38:15', '2012-06-30 22:38:27', 15);
INSERT INTO `q_games` VALUES(2, 'Game 2', 'This time it will create!', '2012-07-23 23:31:16', '2012-07-23 23:31:16', 1);
INSERT INTO `q_games` VALUES(3, 'Game2', 'WOrk?', '2012-07-23 23:31:33', '2012-07-23 23:31:33', 1);
INSERT INTO `q_games` VALUES(4, 'Game3', 'This is game3', '2012-07-23 23:41:00', '2012-07-23 23:41:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `q_states`
--

CREATE TABLE `q_states` (
  `state_id` int(11) NOT NULL AUTO_INCREMENT,
  `t_id` varchar(255) NOT NULL,
  `u_id` int(11) NOT NULL,
  `num_troops` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  PRIMARY KEY (`state_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=28 ;

--
-- Dumping data for table `q_states`
--

INSERT INTO `q_states` VALUES(1, 'dickson', 1, 174, 1);
INSERT INTO `q_states` VALUES(2, 'baker', 1, 210, 1);
INSERT INTO `q_states` VALUES(3, 'uris', 2, 420, 1);
INSERT INTO `q_states` VALUES(4, 'day', 2, 100, 1);
INSERT INTO `q_states` VALUES(5, 'duffield_phillips', 1, 200, 1);
INSERT INTO `q_states` VALUES(6, 'hoy', 2, 150, 1);
INSERT INTO `q_states` VALUES(7, 'goldwin', 6, 360, 1);
INSERT INTO `q_states` VALUES(8, 'barton', 5, 354, 1);
INSERT INTO `q_states` VALUES(9, 'statler', 5, 260, 1);
INSERT INTO `q_states` VALUES(10, 'teagle', 5, 120, 1);
INSERT INTO `q_states` VALUES(11, 'ives', 5, 178, 1);
INSERT INTO `q_states` VALUES(12, 'comstock', 5, 241, 1);
INSERT INTO `q_states` VALUES(13, 'barton', 1, 100, 1);
INSERT INTO `q_states` VALUES(14, 'statler', 1, 100, 1);
INSERT INTO `q_states` VALUES(15, 'uris', 1, 100, 1);
INSERT INTO `q_states` VALUES(16, 'olin_lib', 1, 100, 1);
INSERT INTO `q_states` VALUES(17, 'bailey', 1, 100, 1);
INSERT INTO `q_states` VALUES(18, 'day', 1, 100, 1);
INSERT INTO `q_states` VALUES(19, 'sage', 2, 100, 1);
INSERT INTO `q_states` VALUES(20, 'willard_straight', 2, 100, 1);
INSERT INTO `q_states` VALUES(21, 'taylor', 2, 100, 1);
INSERT INTO `q_states` VALUES(22, 'hollister', 2, 100, 1);
INSERT INTO `q_states` VALUES(23, 'ktb', 2, 100, 1);
INSERT INTO `q_states` VALUES(24, 'mcgraw_uris', 2, 100, 1);
INSERT INTO `q_states` VALUES(25, 'willard_straight', 1, 100, 1);
INSERT INTO `q_states` VALUES(26, 'schoellkopf', 2, 100, 1);
INSERT INTO `q_states` VALUES(27, 'morris', 1, 100, 1);

-- --------------------------------------------------------

--
-- Table structure for table `q_users`
--

CREATE TABLE `q_users` (
  `u_id` int(11) NOT NULL AUTO_INCREMENT,
  `u_email` varchar(255) NOT NULL,
  `u_pwd` varchar(255) NOT NULL,
  `u_lastlogin` datetime NOT NULL,
  `u_avatar` varchar(255) NOT NULL,
  `u_isadmin` int(11) NOT NULL,
  PRIMARY KEY (`u_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `q_users`
--

INSERT INTO `q_users` VALUES(1, 'qf26@cornell.edu', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', '2012-05-21 13:24:26', '', 1);
INSERT INTO `q_users` VALUES(2, 'bae43@cornell.edu', '9e02d06dd535a7663c0eb74ffe3c634122a35fb93707b31702cc33a5ef0b7b31', '2012-07-15 02:53:13', '', 1);
INSERT INTO `q_users` VALUES(3, 'test@cornell.edu', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', '2012-07-15 02:53:43', '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `q_users_games`
--

CREATE TABLE `q_users_games` (
  `u_id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  `user_order` int(11) NOT NULL,
  PRIMARY KEY (`u_id`,`game_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `q_users_games`
--

INSERT INTO `q_users_games` VALUES(1, 1, 1);
INSERT INTO `q_users_games` VALUES(1, 4, 1);
INSERT INTO `q_users_games` VALUES(2, 1, 2);
