// Grab the articles as a json
$.getJSON("/articles", function (data) {


  $('notes').hide();

  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    var rowDiv = $("<div class='row mx-2'>")
    var col1Div = $("<div class='col-md-3'>");
    var col2Div = $("<div class='col-md-9'>");

    var h6Tag = $("<h6>");
    h6Tag.text("Section: " + data[i].section);
    col2Div.prepend(h6Tag);
    var buttonVar = $("<a>")
    buttonVar.attr("class", "btn btn-primary float-right");
    buttonVar.attr("id", 'addNoteBtn')
    buttonVar.attr("role", 'button')
    buttonVar.html('<i class="fas fa-bullhorn"></i>Add note')
    buttonVar.attr("data-id", data[i]._id);
    col2Div.append(buttonVar);

    var h4Tag = $('<h4>');

    var aTag = $('<a>')
    aTag.attr("href", data[i].articleLink);
    aTag.text(data[i].title);
    h4Tag.append(aTag);
    col2Div.append(h4Tag);
    var pTag = $('<p>');
    pTag.text(data[i].summary);
    col2Div.append(pTag);

    // wrap img in a div so I can put on a download icon
    var imgDiv = $('<div id="imgDiv">');
    //create image element with all attr to support start/stop of the animated GIF
    //also included alt element
    var topicImage = $("<img>");
    topicImage.attr("src", data[i].articleImageLink);
    topicImage.attr("class", "article-gif img-fluid mx-auto d-block")
    topicImage.attr("alt", data[i].articleImageAlt);
    topicImage.attr("title", data[i].articleImageTitle);

    //fill up the imgDiv
    imgDiv.prepend(topicImage);

    col1Div.prepend(imgDiv);

    //put col1 first then col2
    rowDiv.append(col1Div);
    rowDiv.append(col2Div);

    //put this into the index.html
    $("#articles").append(rowDiv);
  }
});


// Whenever someone clicks a btn
$(document).on("click", "#addNoteBtn", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  $(".modal-footer").empty();

  // Save the id from the btn
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {

      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data[0].title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button class='btn m-3' data-id='" + data[0]._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data[0].note.length != 0) {
        for (i = 0; i < data[0].note.length; i++) {

          console.log("inside for loop for notes adding");
          console.log(data[0].note.length);

          // Display the apropos information on the page
          var rowDiv = $("<div class='row mx-2'>")
          var col1Div = $("<div class='col-md-10'>");
          var col2Div = $("<div class='col-md-2'>");

          var deleteButtonVar = $("<a>")
          deleteButtonVar.attr("class", "btn btn-primary float-right");
          deleteButtonVar.attr('id', 'delete-btn');
          deleteButtonVar.html('<i class="fas fa-remove"></i>')
          deleteButtonVar.attr("note-data-id", data[0].note[i]._id);
          deleteButtonVar.attr("article-data-id", data[0]._id);
          col2Div.append(deleteButtonVar);

          // Place the title of the note in Col1 of the Row
          var h4Tag = $('<h4>');
          h4Tag.text(data[0].note[i].title);
          h4Tag.append(col1Div);

          // Place the title of the note in Col1 of the Row
          var pTag = $('<p>');
          pTag.text(data[0].note[i].body);
          col1Div.append(pTag);

          //put col1 first then col2
          rowDiv.append(col1Div);
          rowDiv.append(col2Div);

          //put this into the index.html modal
          $(".modal-footer").append(rowDiv);
        }
      }

      $(".modal-title").text("Please add your note to this article.");
      $(".modal").modal('toggle');
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Clear the modal from the screen
  $(".modal").modal('toggle');
  $(".modal-footer").empty();

  console.log(thisId);
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);

    });

});

// When you click the delete button
$(document).on("click", "#delete-btn", function () {
  // Grab the ids associated with the note and article from the delete button
  var thisNoteId = $(this).attr("note-data-id");
  var thisArticleId = $(this).attr("note-data-id");

  // Clear the modal from the screen
  $(".modal").modal('toggle');
  $(this).parent('row').hide();

  console.log('note id',thisNoteId);
  console.log('article id', thisArticleId);

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "DELETE",
    url: "/notes/" + thisNoteId,
    data: {id:thisArticleId}
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);

    });

});
