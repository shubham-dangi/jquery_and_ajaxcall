$(document).ready(function()  {
  var offset = 0;
  var templateRecord=$(".templateRecord").html();

   $("#find").click(function()  {
    $(".table_poster").empty();
    $(".table_data").empty();
   var title = $("#textbox").val();
   
//SEARCHING IN THE DATABASE
   
    $.ajax({
      type:'GET',
      url: "http://localhost:8080/employee?name_like=^" + title + "&_sort=name&_limit=10", 
      success: function(newData){
        if (title == ''){
           window.alert("Please enter the string");
        }
        else{
          if(title!=newData){
          $.each(newData, function(i, newRecord){
             $('.table_data').append(Mustache.render(templateRecord, newRecord));
          });//End each function    
          }
          else{
            alert("Match not found!!!");
          } 
        }
        },
        error: function() {
          alert("Error searching data");
        }
    }); // End ajax function
   }); // Click function ends

   $("#load").click(function()  {
    $(".table_poster").empty();
    $(".table_data").empty();
    
//LOADING THE WHOLE DATABASE

    $.ajax({
      type:'GET',
      url: "http://localhost:8080/employee/?_start=0&_sort=name&_limit=50", 
      success: function(newData){
         window.alert("LOADING successfull");
           $.each(newData, function(i, newRecord){
            $('.table_data').append(Mustache.render(templateRecord, newRecord));
           });//End each function
        },
        error: function() {
          alert("Error loading data");
        }
    }); // End ajax function
   }); // Click function ends

//submit call
    $('#formBtnSubmit').on('submit', function(){
      console.log("Kuch bhi ");
        var names = $("#inputName").val();
        var gender = $("#inputGender").val();
        var country = $("#inputCountry").val();
        var email = $("#inputEmail").val();
        var phone = $("#inputPhone").val();
        var company = $("#inputCompany").val();
        var address = $("#inputAddress").val();
        // var product_id = $("#inputProductID").val();
        // var favoriteLaptop = $("#inputFavoriteLaptop").val();

      var addRecord={
        name: names,
        gender: gender,
        country: country,
        email: email,
        phone: phone,
        company: company,
        address: address,
        // Electronics: [
        // {
        //   index: 0,
        //   product_id: product_id,
        //   favoriteLaptop: favoriteLaptop
        //  }
        // ]
      };

        $(".table_data").empty();

//POSTING TO THE DATABASE
        window.alert(addRecord);
        $.ajax({
        url: "http://localhost:8080/employee/",
        type: 'POST',
        data: addRecord,
          success: function(newData){
          window.alert("POST successfull");
           $('.table_data').append(Mustache.render(templateRecord, newData));
          }, //End success function
          error: function() {
            alert("Error adding record to the database");
          }
        }); // End ajax function
    });  //click function ends
//end submit
    $(".table_data").delegate('.delete', 'click', function(){

      var $tr= $(this).closest('tr');

//DELETING A RECORD FROM THE DATABASE

       $.ajax({
        url: "http://localhost:8080/employee/" + $(this).attr('data-id'),
        type: 'DELETE',
        success: function(del){
            $tr.fadeOut(500, function() {
              $(this).remove();
            });
        }
      });
    });

//Update button

    $(".table_data").delegate('.update', 'click', function(){
      
      var $tr= $(this).closest('tr');
      $tr.find('input.name').val($tr.find('span.name').html());
      $tr.find('input.gender').val($tr.find('span.gender').html());
      $tr.find('input.country').val($tr.find('span.country').html());
      $tr.find('input.email').val($tr.find('span.email').html());
      $tr.find('input.phone').val($tr.find('span.phone').html());
      $tr.find('input.company').val($tr.find('span.company').html());
      $tr.find('input.address').val($tr.find('span.address').html());
      $tr.addClass('edit');
    });//End click function

    $(".table_data").delegate('.cancelEdit', 'click', function(){
          $(this).closest('tr').removeClass('edit');
    });//Cancel Edit button

     $(".table_data").delegate('.saveEdit', 'click', function(){
      var $tr= $(this).closest('tr');
      var names= $tr.find('input.name').val();
      var gender= $tr.find('input.gender').val();
      var country= $tr.find('input.country').val();
      var email= $tr.find('input.email').val();
      var phone= $tr.find('input.phone').val();
      var company= $tr.find('input.company').val();
      var address= $tr.find('input.address').val();
      var obj={
        name: names,
        gender: gender,
        country: country,
        email: email,
        phone: phone,
        company: company,
        address: address
      }
 
//SAVING A RECORD

      $.ajax({
        url: "http://localhost:8080/employee/" + $tr.attr("data-id"),
        type: 'PUT',
        data: obj,
        success:function(){
          $tr.find('span.name').html(obj.name);
          $tr.find('span.gender').html(obj.gender);
          $tr.find('span.country').html(obj.country);
          $tr.find('span.email').html(obj.email);
          $tr.find('span.phone').html(obj.phone);
          $tr.find('span.company').html(obj.company);
          $tr.find('span.address').html(obj.address);
          $tr.removeClass('edit');
        },
        error: function() {
          alert("Error saving record to the database");
        }        
      });// End ajax function
    });//Save Edit button

//Infinite Scrolling

  var start=50;
  $(window).data('ajaxready',true);             

  window.onscroll=yHandler;

  function yHandler(){

    if($(window).data('ajaxready') == false ) return;

    var wrap = document.getElementById('tble');
    var contentHeight = wrap.offsetHeight;
    var yOffset = window.pageYOffset;
    var y = yOffset + window.innerHeight;

    if(y>contentHeight)
    {
      $(window).data('ajaxready',false);
      console.log("Updation - " + y + " " + contentHeight);
      wrap.innerHTML += '<div class= "newData"></div>';

      $.ajax({
          url: "http://localhost:8080/employee?_start=" + start + "&_sort=name&_limit=10",
          type: 'GET',
          success:function(data)
          {
              start = start + 10;
              var records= JSON.stringify(data);
              $.each(data, function(i, newRecord)
              {
                $('.table_data').append(Mustache.render(templateRecord, newRecord));
              });//End each function 
              $(window).data('ajaxready',true);           
          } //End success function
      });// End ajax function
    }//End IF
  }//End yHandler 
});//ready function ends
