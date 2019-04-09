window.onload = function() {
    // If they are all true call the Masonry function.
    var msnry = new Masonry('.masonry', {
        itemSelector: '.grid-item',
        columnWidth: 100,
        fitWidth: true
    });
}