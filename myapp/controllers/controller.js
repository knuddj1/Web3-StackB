module.exports = {
    index(req, res){
        return res.status(200).render('index', { title: 'Country Information' });
    },
    about(req, res){
        return res.status(200).render('about', { title: 'About' });
    }
}
