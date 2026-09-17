import StatCard from "./StatCard";
import TaskCard from "./TaskCard";
import AddTask from "./AddTask";

function Dashboard(props) {

    async function toggleTask(id){
        const task = props.tasks.find((task)=>task._id === id);
        const newStatus = task.status ==="Completed"
         ? "Pending" : "Completed";
        
        const response = await fetch(`http://localhost:5000/api/tasks/${id}`
            , {
                method: "PUT",
                headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                status:newStatus
            })
        });

        if (!response.ok) {
            throw new Error("Unable to update task status");
        }

        const updatedTask = await response.json();

        props.setTasks(
            props.tasks.map((task) => {
                if(task._id === id){
                    return updatedTask;
                }
                return task;
            })
        );
    }

    function addTask(newTask){
        props.setTasks([...props.tasks, newTask]);
    }

    async function deleteTask(id){
        const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Unable to delete task");
            }

            const deletedTask = await response.json();
        props.setTasks(
            props.tasks.filter((task)=>task._id !== deletedTask._id)
        );
    }

    const totalTasks = props.tasks.length;
    const completedTasks = props.tasks.filter((task) => task.status === "Completed").length;
    const pendingTasks = props.tasks.filter((task) => task.status === "Pending").length;

    return (
        <main>
        
            <div className="stats-container">
                <StatCard title="Total Tasks" value={String(totalTasks)}/>
                <StatCard title="Completed" value={String(completedTasks)}/>
                <StatCard title="Pending" value={String(pendingTasks)}/>
                
            </div>

            <AddTask  onAddTask={addTask}/>

            <h2>Recent Tasks</h2>

            <div className="tasks-container">
                {props.tasks.length === 0 ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '220px',
                        textAlign: 'center',
                        color: '#333',
                        width: '100%'
                    }}>
                        <div style={{
                            width: '72px',
                            height: '72px',
                            borderRadius: '50%',
                            backgroundColor: '#dc2626',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '42px',
                            fontWeight: 'bold',
                            marginBottom: '12px',
                            lineHeight: 1
                        }}>
                            !
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>No tasks found</div>
                    </div>
                ) : (
                    props.tasks.map((task)=>(
                        <TaskCard 
                            key={task._id || task.id} 
                            id={task._id || task.id}
                            title={task.title} 
                            description={task.description} 
                            status={task.status}
                            onToggle={()=>toggleTask(task._id || task.id)} 
                            onDelete={()=>deleteTask(task._id || task.id)}
                        />
                    ))
                )}
            </div>

        </main>
    );
}

export default Dashboard;