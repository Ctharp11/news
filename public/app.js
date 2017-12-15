
$(document).on('click', '.save', function(e) {
    e.preventDefault();

    $('.saved-bubble').show()

   setTimeout(function(){
    $('.saved-bubble').hide()
   }, 2000)


    var savedData = {
        title: $(this).attr('value-title'),
        link: $(this).attr('value-link')
    }

    $.ajax({
        url: '/save',
        type: 'POST',
        data: {
            title: $(this).attr('value-title'),
            link: $(this).attr('value-link'),
            date: Date.now()
        }
      })
   })

$('.delete').on('click', function(e) {
    var id = $(this).attr('value-id');
    $.ajax({
        url: '/delete',
        type: 'DELETE',
        data: {
            id: id
        }
    })
})





