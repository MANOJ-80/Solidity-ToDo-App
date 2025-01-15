// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {
    struct Task {
    uint id;
    string content;
    bool completed;
    bool isDeleted;
}


    mapping(uint => Task) public tasks;
    uint public taskCount;

    event TaskCreated(uint id, string content, bool completed);
    event TaskCompleted(uint id, bool completed);
    event TaskDeleted(uint id);  // Added missing event declaration

    constructor() {
        taskCount = 0;
    }

    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
        emit TaskCreated(taskCount, _content, false);
    }

    function toggleCompleted(uint _id) public {
        Task memory _task = tasks[_id];
        _task.completed = !_task.completed;
        tasks[_id] = _task;
        emit TaskCompleted(_id, _task.completed);
    }

    function getTask(uint _id) public view returns (uint id, string memory content, bool completed) {
        Task memory _task = tasks[_id];
        return (_task.id, _task.content, _task.completed);
    }

    function deleteTask(uint _id) public {
    require(_id > 0 && _id <= taskCount, "Invalid task ID");
    Task storage _task = tasks[_id];
    _task.isDeleted = true;
    emit TaskDeleted(_id);
}

}