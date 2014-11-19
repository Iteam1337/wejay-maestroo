CREATE TABLE history (
  HistoryId INT NOT NULL AUTO_INCREMENT,
  SongId VARCHAR(500) NULL,
  SongLength INT NULL,
  RoomId VARCHAR(500) NULL,
  UserId VARCHAR(500) NULL,
  SongPlayed DATETIME NULL,
  PRIMARY KEY (`HistoryId`)
);