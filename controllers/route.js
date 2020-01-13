/**
 * Router
 * @param app
 */
module.exports = (app) => {
  app
    .get('/conference', (req, res) => {
      res.render('conference/index.ejs', {
        title: '- 1:1 화상회의 만들기',
      });
    })
};
