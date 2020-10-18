Error handling
    1. Have consistent structure from all servers
        - error handling middleware
    2. All kind of errors must be handled.
        - catch all errors and pass onto express

Express error handling
    - Scenario 1: sync route handler - just throw and express catches it.
    - Scenario 2: async route handler - we catch and call next().
        - applies for callback, promise, async/await.
    
    - a function with 4 args is an error handling
    
    Abstract class
        - Cannot be instantiated
        - Use to setup requirement on subclasses
        - Does create a class in JS which we can use it in 'instanceof'
        

CustomError
    - Typescript will guide you on what the requirements are
    - statusCode of number
    - serializeErrors returning array of { message: string; field?: string }


Mongoose
    - when import mongoose first time in VSCode, it suggested to include mongoose types.

