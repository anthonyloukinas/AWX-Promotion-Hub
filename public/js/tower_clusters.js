$( document ).ready(function() {
   console.log('tower_clusters.js loaded!');
   $( "" ).each(function(index) {
       $.ajax({
           method: 'GET',
           url: 'localhost:3000/admin/settings/check_tower_connectivity/'
       })
       ,done(response => {

       })
       .fail(error => {

       })
   });

});