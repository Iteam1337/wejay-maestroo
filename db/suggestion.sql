CREATE FUNCTION [dbo].[SuggestSong]
  (
  @room nvarchar(255), -- which room
  @startDate datetime, -- how far back do we want to check?
  @stopDate datetime,
  @userId int -- title separation
  )
  
RETURNS  @table_variable TABLE (order_user_id int, order_song_id int , count_played int, last_played datetime, song_filename nvarchar(255), average_vote float, order_room nvarchar(255))
AS
  BEGIN
  
  IF (EXISTS(SELECT * FROM active_users WHERE login_room = @room))  BEGIN

    INSERT INTO @table_variable 
    SELECT     TOP 10 dbo.maestro_orders.order_user_id, dbo.maestro_orders.order_song_id, COUNT(DISTINCT dbo.maestro_orders.order_id) AS count_played, 
              MAX(song_last_played.order_start_play) AS last_played, dbo.maestro_songs.song_filename, ISNULL(AVG(dbo.maestro_votes.vote_value), 3) 
              AS average_vote, @room

    FROM         dbo.active_users active_users_1 INNER JOIN
        dbo.maestro_votes ON active_users_1.user_id = dbo.maestro_votes.vote_user_id RIGHT OUTER JOIN
        dbo.maestro_orders INNER JOIN
        dbo.maestro_orders song_last_played ON dbo.maestro_orders.order_song_id = song_last_played.order_song_id INNER JOIN
        dbo.maestro_songs ON dbo.maestro_orders.order_song_id = dbo.maestro_songs.song_id INNER JOIN
        dbo.active_users ON active_users.login_room = @room AND 
        dbo.maestro_orders.order_user_id = dbo.active_users.user_id ON dbo.maestro_votes.vote_song_id = dbo.maestro_orders.order_song_id

    GROUP BY dbo.maestro_orders.order_song_id, dbo.maestro_orders.order_user_id, dbo.maestro_songs.song_filename, dbo.maestro_orders.order_room

    HAVING       (@userId IS NULL OR dbo.maestro_orders.order_user_id = @userId) AND 
          (
            (MAX(song_last_played.order_start_play) < @stopDate) -- title separation
            AND (MAX(song_last_played.order_start_play) > @startDate) -- how far back do we want to include?
            AND (COUNT(DISTINCT dbo.maestro_orders.order_id) >= 2) -- or have been played at least two times during the period
            AND (ISNULL(AVG(dbo.maestro_votes.vote_value), 3) >= 3) -- average vote is not below normal
          ) 
          OR
          ( 
            (ISNULL(AVG(dbo.maestro_votes.vote_value), 3) >= 4) -- 
            AND 
            (MAX(song_last_played.order_start_play) < @stopDate) -- play good songs forever but respect title separation
          )
                   
    ORDER BY 
          MAX(song_last_played.order_start_play) DESC, -- sort by latest time played
          CAST(COUNT(DISTINCT dbo.maestro_orders.order_id) / 3 AS int) DESC, -- how many times have this song been played?
          CAST(COUNT(DISTINCT song_last_played.order_id) / 5 AS int) -- 

    -- no good song existed in the current users history, let's broaden the search..
    -- abo 2011-06-23 temporarily disabled broad search for debugging.
    -- IF (NOT EXISTS(SELECT * from @table_variable)) BEGIN
    IF ((0 = 1) AND (NOT EXISTS(SELECT * from @table_variable))) BEGIN
      INSERT INTO @table_variable 
      SELECT  TOP 1    /*no user*/ 0, 
              song_suggestion.order_song_id , 
              COUNT(song_suggestion.order_id), 
              MAX(title_separation.order_start_play) , 
              dbo.maestro_songs.song_artist + '-' + dbo.maestro_songs.song_title, 
              /*no vote*/ 3, 
              @room

      FROM            dbo.maestro_orders INNER JOIN
                   dbo.maestro_orders AS song_suggestion ON ABS(dbo.maestro_orders.order_id - song_suggestion.order_id) < 10 -- songs that have been played 10 songs before or after the current song
                   AND 
                   dbo.maestro_orders.order_song_id <> song_suggestion.order_song_id AND dbo.maestro_orders.order_room = song_suggestion.order_room INNER JOIN -- in the current room

                   dbo.maestro_songs ON song_suggestion.order_song_id = dbo.maestro_songs.song_id INNER JOIN

                   dbo.maestro_orders AS title_separation ON song_suggestion.order_song_id = title_separation.order_song_id INNER JOIN -- and this song havent been played the last day

                   dbo.maestro_orders AS last_hour_playlist ON dbo.maestro_orders.order_song_id = last_hour_playlist.order_song_id AND title_separation.order_room = last_hour_playlist.order_room

      WHERE        (last_hour_playlist.order_played_time > GETDATE() - 0.1) AND (last_hour_playlist.order_room = @room)
      
      GROUP BY song_suggestion.order_song_id, dbo.maestro_songs.song_artist, dbo.maestro_songs.song_title
      
      HAVING        (MAX(title_separation.order_start_play) < GETDATE() - 0.5) AND (COUNT(song_suggestion.order_id) > 3)
      
      ORDER BY 
      
      AVG(MONTH(GETDATE()) - MONTH(song_suggestion.order_start_play)), --weekdayDiff, 
      AVG(ABS({ fn HOUR(GETDATE()) } - { fn HOUR(song_suggestion.order_start_play) })), --hourDiff, 
      AVG(ABS(DATEPART(dw, GETDATE()) - DATEPART(dw, song_suggestion.order_start_play))) --monthDiff


    END
    END
                    
  RETURN
  END

