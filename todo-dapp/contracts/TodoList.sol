// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {
    struct Task {
        uint id;
        string content;
        bool completed;
        bool isDeleted;  // Added isDeleted field
    }

    mapping(uint => Task) public tasks;
    uint public taskCount;

    event TaskCreated(uint id, string content, bool completed);
    event TaskCompleted(uint id, bool completed);
    event TaskDeleted(uint id);

    constructor() {
        taskCount = 0;
    }

    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false, false);  // Initialize isDeleted as false
        emit TaskCreated(taskCount, _content, false);
    }

    function toggleCompleted(uint _id) public {
        Task storage _task = tasks[_id];
        _task.completed = !_task.completed;
        emit TaskCompleted(_id, _task.completed);
    }

    function getTask(uint _id) public view returns (uint id, string memory content, bool completed, bool isDeleted) {
        Task memory _task = tasks[_id];
        return (_task.id, _task.content, _task.completed, _task.isDeleted);  // Return isDeleted as well
    }

    function deleteTask(uint _id) public {
        require(_id > 0 && _id <= taskCount, "Invalid task ID");
        Task storage _task = tasks[_id];
        _task.isDeleted = true;
        emit TaskDeleted(_id);
    }
}
