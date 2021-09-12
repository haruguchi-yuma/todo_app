const STORAGE_KEY = 'todo-app'
const todoStorage = {
  fetch: function() {
    const todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')

    todos.forEach(function(todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

new Vue({
  el: '#app',
  data: {
    newBody: '',
    editedTodo: null,
    todos: todoStorage.fetch()
  },
  methods: {
    addTodo: function() {
      if( this.newBody.trim() === '' ) { return }
      this.todos.push({
        id: todoStorage.uid++,
        body: this.newBody,
        done: false
      })
      this.newBody = ''
    },
    editTodo: function(todo) {
      this.beforeEditCache = todo.body
      this.editedTodo = todo
    },
    doneEdit: function(todo) {
      if (!this.editedTodo) { return }
      this.editedTodo = null
      todo.body = todo.body.trim()
      if (!todo.body) { this.deleteTodo(todo) }
    },
    cancelEdit: function(todo) {
      this.editedTodo = null
      todo.body = this.beforeEditCache
    },
    deleteTodo: function(todo) {
      const index = this.todos.indexOf(todo)
      this.todos.splice(index, 1)
    }
  },
  watch: {
    todos: {
      handler: function(todos) {
        todoStorage.save(todos)
      },
      deep: true
    }
  },
  directives: {
    "todo-focus": function(el, binding) {
      if (binding.value) {
        el.focus();
      }
    }
  }
})
