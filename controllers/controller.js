var exports = module.exports = {}


  const indexView =  (req, res) => {
      var ret = {};
      if(req.isAuthenticated()){
          ret.user= req.user;
          res.render("index.ejs", ret);
      }
      else {
          res.redirect('/login');
          return;
      }
    
}

const loginView = (req,res) => {
    res.render("login.ejs");
}

const registerView = (req,res) => {
    let error = 'Please register yourself';
    res.render("register.ejs", {error});
}

const orderView = (req,res) => {
    if(req.isAuthenticated()) {
    res.render("../views/orders/index.ejs");
    }
    else{
        res.redirect("/login");
    }
}

const deleteView = (req,res) => {
    if(req.isAuthenticated()) {
        res.render("../views/orders/delete.ejs");
        }
        else{
            res.redirect("/login");
        }
}

const updateView = (req,res) => {
    if(req.isAuthenticated()) {
        res.render("../views/orders/edit.ejs");
        }
        else{
            res.redirect("/login");
        }
}

module.exports = {
    indexView,
    loginView, 
    registerView,
    orderView, 
    deleteView, 
    updateView
}