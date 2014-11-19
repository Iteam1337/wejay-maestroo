CREATE TABLE `maestroo`.`vote` (
  `VoteId` INT NOT NULL AUTO_INCREMENT,
  `UserId` VARCHAR(500) NULL,
  `SongId` VARCHAR(500) NULL,
  `VoteValue` SMALLINT NULL,
  PRIMARY KEY (`VoteId`));
