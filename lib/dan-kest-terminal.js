function DKT() {
    this.term = null;
    this.uh = 20;
    this.uw = 10;
}

DKT.isNull = function() {
    if (this.term === null) {
        console.error('Please call setId(id) first to set terminal object');
        return true;
    }
    return false;
}

DKT.setId = function(id) {
    this.term = document.getElementById(id);
}

DKT.setText = function(text) {
    text = text.replace(/ /gm, '&nbsp;').replace(/(\r\n|\n|\r)/gm, '<br>');
    this.term.innerHTML = text;
};
