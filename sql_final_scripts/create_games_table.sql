USE BETSY; 
DROP TABLE games;
CREATE TABLE games (
	homeTeamName VARCHAR(255), 
	awayTeamName VARCHAR(255),
    homeTeamNameRender VARCHAR(255),
    awayTeamNameRender VARCHAR(255),
	winningTeamPrediction VARCHAR(255),
    homeTeamStat1 DECIMAL(6,3),
    homeTeamStat2 DECIMAL(6,3),
    homeTeamStat3 DECIMAL(6,3),
    awayTeamStat1 DECIMAL(6,3),
    awayTeamStat2 DECIMAL(6,3),
    awayTeamStat3 DECIMAL(6,3),
	gameResult VARCHAR(255),
    gameDate VARCHAR(255),
    gameDateRender VARCHAR(255)
);

