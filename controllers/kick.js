exports.index = function(req, res) {
  res.render('kick/home', {
    title: 'Home'
  });
};

exports.getNew = function(req, res) {
    res.render('kick/new', {
        title: 'New'
    })
}