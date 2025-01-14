// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {
    struct Task {
        uint id;
        string content;
        bool completed;
    }

    mapping(uint => Task) public tasks;
    uint public taskCount;

    event TaskCreated(uint indexed id, string content, bool completed);
    event TaskCompleted(uint indexed id, bool completed);

    constructor() {
        taskCount = 0;
    }

    function createTask(string memory _content) external {
        require(bytes(_content).length > 0, "Content cannot be empty");
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
        emit TaskCreated(taskCount, _content, false);
    }

    function toggleCompleted(uint _id) external {
        require(_id > 0 && _id <= taskCount, "Task does not exist");
        tasks[_id].completed = !tasks[_id].completed;
        emit TaskCompleted(_id, tasks[_id].completed);
    }
}
