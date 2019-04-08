// Get the grid element.
var elem = document.querySelector('.grid');

// If they are all true call the Masonry function.
var msnry = new Masonry(elem, {
    itemSelector: '.grid-item',
    columnWidth: 100,
    fitWidth: true
});