import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'table',
  classNames: ['ember-gridview'],
  search: true,
  pagination: true,
  searchFieldValue: null,
  didSearch: false,
  currentPage: 1,
  itemsPerPage: 15,
  originalLoaded: false,


  bodyContent: Ember.computed('content', function(){

    //Prepare content
    var model = this.get('content');
    var modelLength = model.length;
    var arrayModel = [];
    var itemsPerPage = this.get('itemsPerPage');
    var currentPage = this.get('currentPage');

    //Set page count
    this.set('pageCount', Math.round(modelLength/itemsPerPage));

    //Transfer model to array
    for(var i = 0; i < modelLength; i++)
      arrayModel[i] = model[i];

    var content = [];
    var indexi = 0;

    //Transfer properties to array
    arrayModel.forEach((item) => {
      var indexj = 0;
      content[indexi] = [];
      for(var key in item){
        if(item.hasOwnProperty(key)){
          content[indexi][indexj] = item[key];
        }
        indexj++;
      }
      indexi++;
    });

    if(!this.get('originalLoaded')){
      this.set('originalContent', content);
      this.set('originalLoaded', true);
    }

    return content.slice((itemsPerPage*(currentPage-1)), (itemsPerPage*currentPage));
  }),

  actions: {
    search(){
      this.set('currentPage', 1);

      var originalContent = this.get('originalContent');
      var searchFieldValue = this.get('searchFieldValue');
      var bodyContent = this.get('bodyContent');
      var itemsPerPage = this.get('itemsPerPage');
      var currentPage = this.get('currentPage');

      // Set bodyContent to original if search field is empty
      if(!searchFieldValue){
        this.set('bodyContent', originalContent.slice((itemsPerPage*(currentPage-1)), (itemsPerPage*currentPage)));
        return;
      }

      // Search if any attribute of the elements has the search value
      var searchGrid = (item) => {
        for(var key in item){
          if(item.hasOwnProperty(key)){
            if(item[key].toString().toLowerCase().indexOf(searchFieldValue.toLowerCase()) != -1){
              return true;
            }
          }
        }
        return false;
      }

      // Filter originalContent and sets it to bodyContent
      var bodyContent = originalContent;
      var bodyContent = bodyContent.filter(searchGrid);
      this.set('bodyContent', bodyContent.slice((itemsPerPage*(currentPage-1)), (itemsPerPage*currentPage)));

      this.send('colorRows');
    },

    colorRows(){
      setInterval(() => {
        this.$('tr').css({'background-color' : 'transparent'});
        this.$('tr:odd').css({'background-color' : 'rgb(235, 235, 235)'});
      },0)
    }
  },

  didInsertElement(){
    this.send('colorRows');
  }
});
