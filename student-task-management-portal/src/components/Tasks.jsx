function Tasks(props){
    return (
        <div>
            <h1>Tasks Page</h1>
            
            {props.tasks.length === 0 ? (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '300px',
                    textAlign: 'center',
                    color: '#333'
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
                    <div key={task.id}>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p>Status: {task.status}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default Tasks;