import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    search(){
      console.log('search');
      this.get('parentView').send('search');
    }
  }
});
