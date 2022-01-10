var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    console.log(list, arr);
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};




// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});


// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

var currentTask = {
  taskElement: undefined,
  propertyElement: undefined,
  index: undefined
};

// task date was clicked
$("#list-toDo").on("click", "li > span", function(event) {
  // if the date span does not already have an input element inside
  if (event.currentTarget.firstElementChild === null) {
    // get an array of tasks
    var parentChildren = Array.from(event.currentTarget.childNodes);

    // get index of the current task inside the childNodes of #list-toDo
    currentTask.index = parentChildren.indexOf(event.currentTarget);

    // create an input element inside the date span
    event.currentTarget.innerHTML = `
      <input type="text" value="${event.currentTarget.innerText}" 
        style="border: none; background: none; font-size: inherit; 
        color: inherit; padding: 0; width: ${event.currentTarget.clientWidth - 7.2 * 2}px;
        height: ${event.currentTarget.clientHeight - 6}px; font-weight: bold;" />
    `;
    
    /*
     * this element disables clicking on any other
     * element on the page, when it is clicked
     * the user cannot edit the property of the task anymore
    */ 
    $(".stop-editing").css("display", "block")

    // focus on the input inside the property to edit
    event.currentTarget.firstElementChild.focus()
    
    // save the task being edited
    currentTask.taskElement = event.currentTarget.parentElement;
    currentTask.propertyElement = event.currentTarget;
  }
})

// task description was clicked
$("#list-toDo").on("click", "li > p", function(event) {
  // if the description paragraph does not already have an input element inside
  if (event.currentTarget.firstElementChild === null) {
    // get an array of tasks
    var parentChildren = Array.from(event.currentTarget.childNodes);

    // get index of the current task inside the childNodes of #list-toDo
    currentTask.index = parentChildren.indexOf(event.currentTarget);

    // create an input element inside the description paragraph
    event.currentTarget.innerHTML = `
      <input type="text" value="${event.currentTarget.innerText}" 
        style="border: none; background: none; font-size: inherit; 
        color: inherit; padding: 0; width: ${event.currentTarget.clientWidth}px;
        height: ${event.currentTarget.clientHeight}px;" />
    `;

    /*
     * this element disables clicking on any other
     * element on the page, when it is clicked
     * the user cannot edit the property of the task anymore
    */ 
    $(".stop-editing").css("display", "block")

    // focus on the input inside the property to edit
    event.currentTarget.firstElementChild.focus()
    
    // save the task being edited
    currentTask.taskElement = event.currentTarget.parentElement;
    currentTask.propertyElement = event.currentTarget;

  }
})

// stop editing element was clicked
$(".stop-editing").on("click", function() {
  // hide stop editing element
  $(".stop-editing").css("display", "none")
  
  // set the value of the element to the value of the inner input
  currentTask.propertyElement.innerHTML = currentTask.propertyElement.firstElementChild.value;
  
  // update the tasks toDo list
  tasks.toDo = tasks.toDo.map(function(task, toDoTaskIndex) {
    var { taskElement, index } = currentTask;
    var parentChildren = Array.from(taskElement.parentNode.childNodes);
    var currentTaskIndex = parentChildren.indexOf(taskElement);

    if (currentTaskIndex -1 === toDoTaskIndex) {
      return {
        date: taskElement.querySelector('span').innerText,
        text: taskElement.querySelector('p').innerText
      }
    }

    return task
  });

  // save the edited task in localstorage
  localStorage.setItem("tasks", JSON.stringify(tasks));
})

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();


