/**
 * Main Entry Point of Application
 * Executed in game.html on document ready
 */

var OnReady = {};
OnReady.init = function() {
        
        key_handler = new KeyEventHandler();
        key_handler.init();

        var init_data = {};

        $('#new-game').click(function() {
          window.location.href = '/new-game';
        });

        
        function newGameFormSubmit(e) {
          e.preventDefault();
         
          key_handler.unsetKeyListener(key_handler.keys.ENTER);
          // Prevents the page from refreshing
          var $this = $(this);
          // `this` refers to the current form element
          console.log($this);
          $.post("/create-game", $(this).serialize(), function(data) {
            console.log('data', data);
          });
        }
        $('#new-game-form').submit(newGameFormSubmit);
        // key_handler.setKeyListener(key_handler.keys.ENTER, newGameFormSubmit);

        $("#create-game-button").click(function(e) {
          $('#new-game-form').submit();
        });

        $.ajax({
          url : "/open-games",
        }).done(function(data) {
          var join_game_id = window.location.hash.replace(/^#/, '');

          for (var i = 0; i < data.length; i++) {
            var id = data[i].id;
            if (join_game_id == id) {
              init_data.game_id = join_game_id;
              $('#join-game-header').text(join_game_id);
              $('.pane').hide();
              $('#signin-pane').show();
              break;
            }
            $('#input-game-id').append('<option value="' + id + '">' + id + '</option>')
          }
        });

        var teams_in_games = {};

        $.ajax({
          url : "/open-games",
        }).done(function(data) {
          var waiting_on = data.length;
          if (waiting_on === 0) {
            $('.no-games').removeClass('hidden');
            return;
          }
          var rows = new Array(waiting_on);
          for (var i = 0; i < data.length; i++) {
            var game = data[i];
            var row = $('<tr/>');
            row.append('<td>' + game.id + '</td>');
            row.append('<td>' + game.desc + '</td>');
            
            $.ajax({
              url : "/state",
              data : {
                id : game.id
              }
            }).done( function(data) {
              var row = this.row;
              var rows = this.rows;
              var i = this.i;
              row.append('<td>' + data.team_order.length + '</td>');
              row.append('<td>' + data.stage + '</td>');
              teams_in_games[data.id] = data.team_order;
              rows[i] = row;
              
              waiting_on--;
              if(waiting_on == 0) {
                for(var j in rows) {
                  $('#open-games').append(rows[j]);
                }
              }

            }.bind({row: row, rows: rows, i: i}));

          }
          $('#open-games').on('click', 'tr', function() {
            $('.pane').hide();
            $('#signin-pane').show();
            var game_id = this.children[0].innerText
            $('#join-game-header').text(game_id);
            init_data.game_id = game_id;

            // populate list of possible teams
            $('#team-list').empty();

            var selected = teams_in_games[game_id][0];
            $('#myteam').text(selected);
            for (var index in teams_in_games[game_id]) {
              var team_id = teams_in_games[game_id][index];
              $('#team-list').append('<li><label>	<input type="radio" name="team-choice" value="' + team_id + '" ' + (team_id == selected ? 'checked' : '') + '/><img src="rsc/images/flags/128/' + team_id + '.jpg"> </label></li>');
            }

            $('input:radio[name=team-choice]').click(function(e) {
              $('#myteam').text(e.target.value);
            });
            $('img').on('dragstart', function(event) {
              event.preventDefault();
            });

          });
        });

        $('#join-button').click(function() {

          init_data.player = {};
          init_data.player.id = $('#input-player-id').val();
          init_data.player.name = $('#input-player-name').val();
          init_data.player.team = $('input:radio[name=team-choice]:checked').val();

          initGame(init_data);

          //$('#signin-pane').hide();
          //$('#lobby-pane').show();
          //$('#lobby-game-id').text($('#input-game-id').val());
          //$('#lobby-table').append('<tr class="team-style ' + $('input:radio[name=team-choice]:checked').val() + '"><td class="team-icon small ' + $('input:radio[name=team-choice]:checked').val() + '"></td><td >' + $('#input-player-name').val() + '</td><td class="faded-text">' + $('#input-player-id').val() + '</td><td class="team-icon small"></td></tr>');
        });

        $('#start-game-button').click(function() {

        });
  
}
