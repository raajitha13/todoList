require('dotenv').config()
const express = require("express");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/'))

// mongoose.connect("mongodb://127.0.0.1:27017/todoListDB");     //for local mongodb
mongoose.connect(process.env.MONGOOSE_URL);

const itemsSchema = {
  id: Number,
  name: String,
  }
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({ name: "Welcome to your todo List" });
const item2 = new Item({ name: "Hit the + button to add a new item" });
const item3 = new Item({ name: "<-- Hit this button to delete an item" });

const defaultItems = [item1, item2, item3];

const listsSchema = {
  name: String,
  items: [itemsSchema] //array of item documents
};

const List = mongoose.model("List", listsSchema);

app.get("/", function(req, res){
  let currentday = date.getDay();
  Item.find()
  .then(function(foundItems){
      if(foundItems.length === 0)
      {
          Item.insertMany(defaultItems)
          .then(function(){
             console.log("successfully inserted");
          }).catch(function(err){
            console.log(err);
          });
          res.redirect("/");
      }
      // res.render('lists', {listTitle: currentday ,newListItems: foundItems});
      res.render('lists', {listTitle: "Today" ,newListItems: foundItems});
  })
});

app.post("/", (req,res)=>{
    let listName = req.body.list;
    let itemName = req.body.newItem;
    const item = new Item({
      name: itemName
    });

    if(listName === "Today"){
      item.save();
      res.redirect("/");
    }
    else{
      List.findOne({name: listName})
      .then((foundList)=>{
        foundList.items.push(item);
        foundList.save();
        res.redirect('/'+listName);
      })
    }

})

app.post("/delete" ,function(req,res){
  console.log(req.body.checkbox); //gives undefined......req.body gives {}
  const listName = req.body.listName;
  if(req.body.checkbox != undefined)
  {
    const checkboxValue= req.body.checkbox.trim();


    if(listName === "Today")
    {
      Item.findOneAndDelete({_id: checkboxValue})
      .then(()=>{
        res.redirect('/');
      }).catch((err)=>{
      console.log(err);
      })
    }
    else{
      List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkboxValue}}})
      .then((foundList)=>{
        res.redirect('/'+ listName);
      })
    }
  }
  else{
    if(listName === "Today")
      res.redirect('/');
    else
      res.redirect('/'+listName);
  }
})

app.get("/:customListName", function(req,res){
  const customListName = _.capitalize(req.params.customListName);  //_.capitalize(req.params.customListName)...would solve the problem of case sensitives

  List.findOne({name: customListName})
  .then(function(foundList){
        if(!foundList){
          //create new list
          const list = new List({
            name: customListName,
            items: defaultItems
          });
          list.save();
          res.redirect("/"+customListName);
        }
        else{
          //show existing list
          res.render("lists", {listTitle: foundList.name, newListItems: foundList.items });
        }
  }).catch((err)=>{
    console.log(err);
  })
})



// app.get('/work', (req,res)=>{
//   res.render('lists',  {listTitle: 'work', newListItems: workItems});
// })

app.get("/about", (req,res)=>{
  res.render('about');
})



app.listen(process.env.PORT || 3000, function(){
  console.log("Server started on port 3000.");
});
