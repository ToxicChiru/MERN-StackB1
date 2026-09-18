import { useState } from "react";

function AddTask(props){
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const isInvalid = Boolean(errorMessage);

    function clearErrorIfNeeded(nextTitle, nextDescription) {
        if (errorMessage && nextTitle.trim() && nextDescription.trim()) {
            setErrorMessage("");
        }
    }

    function showError(message) {
        setErrorMessage(message);
        window.clearTimeout(showError.timeoutId);
        showError.timeoutId = window.setTimeout(() => {
            setErrorMessage("");
        }, 4500);
    }
    
    async function handleSubmit(e){
        e.preventDefault();

        const trimmedTitle = title.trim();
        const trimmedDescription = description.trim();

        if (!trimmedTitle || !trimmedDescription) {
            showError("Please enter details");
            return;
        }

        const newTask = {
            id: Date.now(),
            title: trimmedTitle,
            description: trimmedDescription,
            status: "Pending"
        };

        try{
            const response = await fetch("http://localhost:5000/api/tasks", {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify(newTask)
            });

            const data = await response.json();

            if (!response.ok) {
                showError(data.message || "Please enter details");
                return;
            }

            setTitle("");
            setDescription("");
            setErrorMessage("");
            window.clearTimeout(showError.timeoutId);
            props.onAddTask(data);
        }catch(error){
            console.log(error);
            showError("Please enter details");
        }
    }
    
    return (
        <div>
            <h2>Add Task</h2>
            <form
                className={isInvalid ? "task-form task-form-invalid" : "task-form"}
                onSubmit={handleSubmit}
            >
                {errorMessage && (
                    <div className="task-form-alert" aria-live="polite">
                        {errorMessage}
                    </div>
                )}

                <label>Add Title: </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        clearErrorIfNeeded(e.target.value, description);
                    }}
                    className={isInvalid ? "task-input-invalid" : ""}
                />
                <label>Add Description: </label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                        clearErrorIfNeeded(title, e.target.value);
                    }}
                    className={isInvalid ? "task-input-invalid" : ""}
                />
                <button type="submit" className={isInvalid ? "task-submit-invalid" : ""}>
                    Add Task!
                </button>
            </form>
        </div>
    );
}
export default AddTask;