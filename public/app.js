// Whenever someone clicks a btn
$(document).on("click", "#addNoteBtn", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  $("#notes-footer").empty();

  // Save the id from the btn
  var thisId = $(this).attr("data-id");
  console.log("thisid", thisId);

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {

      console.log(data);

      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button class='btn m-3' data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note.length != 0) {
        for (i = 0; i < data.note.length; i++) {

          console.log("inside for loop for notes adding");
          console.log(data.note.length);

          // Display the apropos information on the page
          var rowDiv = $("<div class='row mx-2'>")
          var col1Div = $("<div class='col-md-10'>");
          var col2Div = $("<div class='col-md-2'>");

          var deleteButtonVar = $("<a>")
          deleteButtonVar.attr("class", "btn btn-primary float-right");
          deleteButtonVar.attr('id', 'delete-btn');
          deleteButtonVar.html('<i class="fas fa-remove">&#xf00d;</i>')
          deleteButtonVar.attr("note-data-id", data.note[i]._id);
          deleteButtonVar.attr("article-data-id", data._id);
          col2Div.append(deleteButtonVar);

          // Place the title of the note in Col1 of the Row
          var h4Tag = $('<h4>');
          h4Tag.text(data.note[i].title);
          col1Div.append(h4Tag);

          // Place the title of the note in Col1 of the Row
          var pTag = $('<p>');
          pTag.text(data.note[i].body);
          col1Div.append(pTag);

          //put col1 first then col2
          rowDiv.append(col1Div);
          rowDiv.append(col2Div);

          //put this into the index.html modal
          $("#notes-footer").append(rowDiv);
        }
      }
      $(".modal-title").text("Please add your note to this article.");
      $("#note-modal").modal('toggle');
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Clear the modal from the screen
  $(".modal").modal('toggle');
  // $("#notes-footer").empty();

  console.log(thisId);
  // Run a POST request to change the note, using what's entered in the inputs


  // With that done
  wrapped_ajax(thisId).then(function (data) {
    // Log the response
    console.log(data);

  });

});

function wrapped_ajax(ajaxIdForAjaxCall) {

  return $.ajax({
    method: "POST",
    url: "/articles/" + ajaxIdForAjaxCall,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
}
// When you click the delete button
$(document).on("click", "#delete-btn", function () {
  // Grab the ids associated with the note and article from the delete button
  var thisNoteId = $(this).attr("note-data-id");
  var thisArticleId = $(this).attr("note-data-id");

  // Clear the modal from the screen
  $(".modal").modal('toggle');
  $(this).parent('row').hide();

  console.log('note id', thisNoteId);
  console.log('article id', thisArticleId);

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "DELETE",
    url: "/notes/" + thisNoteId,
    data: { id: thisArticleId }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);

    });

});

// Whenever someone clicks a btn
$(document).on("click", "#scrapeBtn", function () {

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    // With that done, add the note information to the page
    .then(function (data) {

      console.log(data);
      $(".modal-title").text(data);
      $("#scrape-modal").modal('toggle');
    })
});