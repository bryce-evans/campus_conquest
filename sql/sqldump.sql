-- phpMyAdmin SQL Dump
-- version 3.2.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 01, 2012 at 11:18 PM
-- Server version: 5.1.44
-- PHP Version: 5.3.2

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Database: `campus_conquest`
--

-- --------------------------------------------------------

--
-- Table structure for table `q_games`
--

CREATE TABLE `q_games` (
  `game_id` int(11) NOT NULL,
  `game_title` varchar(255) NOT NULL,
  `game_desc` text NOT NULL,
  `game_created` datetime NOT NULL,
  `game_start` datetime NOT NULL,
  PRIMARY KEY (`game_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `q_games`
--

INSERT INTO `q_games` VALUES(1, 'Game 1', 'This is the first game that has ever been created! woohoo!', '2012-06-30 22:38:15', '2012-06-30 22:38:27');

-- --------------------------------------------------------

--
-- Table structure for table `q_games_users_states`
--

CREATE TABLE `q_games_users_states` (
  `game_id` int(11) NOT NULL,
  `u_id` int(11) NOT NULL,
  `state_id` int(11) NOT NULL,
  PRIMARY KEY (`game_id`,`u_id`,`state_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `q_games_users_states`
--

INSERT INTO `q_games_users_states` VALUES(1, 1, -1);

-- --------------------------------------------------------

--
-- Table structure for table `q_states`
--

CREATE TABLE `q_states` (
  `state_id` int(11) NOT NULL,
  PRIMARY KEY (`state_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `q_states`
--


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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `q_users`
--

INSERT INTO `q_users` VALUES(1, 'qf26@cornell.edu', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', '2012-05-21 13:24:26', '', 1);
