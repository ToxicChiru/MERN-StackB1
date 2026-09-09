import StatCard from "./StatCard";
import TaskCard from "./TaskCard";

function Dashboard() {
    const tasks = [
        {
            id:1,
            title:"Learn React",
            description:"Understanding Components",
            status: "Completed"
        },
        {
            id:2,
            title:"Learn JavaScript",
            description:"Understanding Variables, Functions",
            status: "Pending"
        },
        {
            title:"Learn MongoDB",
            description:"Understanding Databases",
            status: "Pending"
        }
        
    ];
    return (
        <main>

            <div className="stats-container">
                <StatCard title="Total Tasks" value="10"/>
                <StatCard title="Completed" value="6"/>
                <StatCard title="Pending" value="4"/>
                
            </div>

            <h2>Recent Tasks</h2>

            <div className="tasks-container">
                {tasks.map((task)=>(
                    <TaskCard key={task.id} title={task.title} description={task.description} status={task.status} />
                ))};
            </div>

        </main>
    );
}

export default Dashboard;